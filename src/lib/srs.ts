// Spaced Repetition System — localStorage backed.
// Tracks wrong/flagged questions and schedules them for review.

const STORAGE_KEY = "dsg.srs.v1";

// Review intervals (ms): 5 min → 1 hr → 1 day → 3 days → 1 week
const INTERVALS = [
  5 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
];

export interface SRSEntry {
  qid: string;
  lang: string;
  stage: number;       // 0..INTERVALS.length-1
  dueAt: number;       // epoch ms
  wrongCount: number;
  hintCount: number;
  lastSeen: number;
}

export interface SRSStore {
  entries: Record<string, SRSEntry>;
  topicFlags: Record<string, number>; // lang -> remaining boosted picks
  failureLog: FailureLogItem[];
}

export interface FailureLogItem {
  date: number;
  lang: string;
  qid: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  note?: string;
}

function load(): SRSStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: {}, topicFlags: {}, failureLog: [] };
    const parsed = JSON.parse(raw);
    return {
      entries: parsed.entries || {},
      topicFlags: parsed.topicFlags || {},
      failureLog: parsed.failureLog || [],
    };
  } catch {
    return { entries: {}, topicFlags: {}, failureLog: [] };
  }
}

function save(store: SRSStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function getStore(): SRSStore {
  return load();
}

export function recordWrong(
  qid: string,
  lang: string,
  question: string,
  userAnswer: string,
  correctAnswer: string,
) {
  const store = load();
  const existing = store.entries[qid];
  const stage = 0; // reset to first interval on wrong answer
  store.entries[qid] = {
    qid,
    lang,
    stage,
    dueAt: Date.now() + INTERVALS[stage],
    wrongCount: (existing?.wrongCount || 0) + 1,
    hintCount: existing?.hintCount || 0,
    lastSeen: Date.now(),
  };
  store.failureLog.unshift({
    date: Date.now(),
    lang,
    qid,
    question,
    userAnswer,
    correctAnswer,
  });
  if (store.failureLog.length > 200) store.failureLog.length = 200;
  save(store);
}

export function recordCorrect(qid: string, lang: string) {
  const store = load();
  const existing = store.entries[qid];
  if (existing) {
    const nextStage = Math.min(existing.stage + 1, INTERVALS.length - 1);
    if (nextStage >= INTERVALS.length - 1 && existing.stage >= INTERVALS.length - 1) {
      // Mastered — remove from review queue
      delete store.entries[qid];
    } else {
      store.entries[qid] = {
        ...existing,
        stage: nextStage,
        dueAt: Date.now() + INTERVALS[nextStage],
        lastSeen: Date.now(),
      };
    }
  }
  // decrement topic flag
  if (store.topicFlags[lang] > 0) {
    store.topicFlags[lang] -= 1;
    if (store.topicFlags[lang] <= 0) delete store.topicFlags[lang];
  }
  save(store);
}

export function recordHintUsed(qid: string, lang: string) {
  const store = load();
  const existing = store.entries[qid];
  store.entries[qid] = {
    qid,
    lang,
    stage: existing?.stage ?? 0,
    dueAt: existing?.dueAt ?? Date.now() + INTERVALS[0],
    wrongCount: existing?.wrongCount || 0,
    hintCount: (existing?.hintCount || 0) + 1,
    lastSeen: Date.now(),
  };
  // Flag topic for 3 boosted picks per hint
  store.topicFlags[lang] = (store.topicFlags[lang] || 0) + 3;
  save(store);
}

export function getDueQids(): string[] {
  const now = Date.now();
  return Object.values(load().entries)
    .filter((e) => e.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((e) => e.qid);
}

export function getFlaggedTopics(): Record<string, number> {
  return load().topicFlags;
}

export function annotateFailure(qid: string, note: string) {
  const store = load();
  const item = store.failureLog.find((f) => f.qid === qid);
  if (item) {
    item.note = note;
    save(store);
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
