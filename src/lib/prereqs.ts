// Topic dependency graph + mastery tracking.
// A topic is "unlocked" when the user has answered N correct questions in each prereq topic.

const KEY = "dsg.mastery.v1";
const REQUIRED_HITS = 3;

// Advanced -> required prerequisite topics
export const TOPIC_PREREQS: Record<string, string[]> = {
  "DSA": ["JavaScript"],
  "React": ["JavaScript"],
  "Angular": ["JavaScript", "TypeScript"],
  "AngularJS": ["JavaScript"],
  "Vue": ["JavaScript"],
  "Node.js": ["JavaScript"],
  "TypeScript": ["JavaScript"],
  "NumPy": ["Python"],
  "Pandas": ["Python", "NumPy"],
  "SciPy": ["Python", "NumPy"],
  "Django": ["Python"],
  "Data Science": ["Python"],
  "Gen AI": ["Python"],
  "AI": ["Python"],
  "PostgreSQL": ["SQL"],
  "MySQL": ["SQL"],
  "MongoDB": ["JavaScript"],
  "ASP.NET": ["C#"],
};

interface MasteryStore {
  correct: Record<string, number>; // lang -> total correct
}

function load(): MasteryStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { correct: {} };
    return JSON.parse(raw);
  } catch { return { correct: {} }; }
}

function save(s: MasteryStore) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function recordMasteryCorrect(lang: string) {
  const s = load();
  s.correct[lang] = (s.correct[lang] || 0) + 1;
  save(s);
}

export function getMastery(): Record<string, number> {
  return load().correct;
}

export function isLocked(lang: string): { locked: boolean; missing: { topic: string; need: number; have: number }[] } {
  const prereqs = TOPIC_PREREQS[lang];
  if (!prereqs) return { locked: false, missing: [] };
  const m = load().correct;
  const missing = prereqs
    .map((t) => ({ topic: t, need: REQUIRED_HITS, have: m[t] || 0 }))
    .filter((p) => p.have < p.need);
  return { locked: missing.length > 0, missing };
}

export function clearMastery() {
  try { localStorage.removeItem(KEY); } catch {}
}
