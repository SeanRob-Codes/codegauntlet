// Local high-score leaderboard.
const KEY = "dsg.leaderboard.v1";

export interface ScoreRow {
  date: number;
  score: number;
  level: number;
  accuracy: number;
  total: number;
  mode: string;
  langs: string[];
}

export function loadScores(): ScoreRow[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScoreRow[];
  } catch { return []; }
}

export function saveScore(row: ScoreRow) {
  const list = loadScores();
  list.push(row);
  list.sort((a, b) => b.score - a.score);
  if (list.length > 50) list.length = 50;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function clearScores() {
  try { localStorage.removeItem(KEY); } catch {}
}

export function getTopScore(): number {
  const list = loadScores();
  return list.length ? list[0].score : 0;
}
