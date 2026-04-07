import { useState, useCallback } from "react";
import { ALL_QUESTIONS, LANGS, type Question } from "@/data/questions";

export type Screen = "start" | "game" | "gameover";

export interface GameState {
  screen: Screen;
  selectedLangs: string[];
  lives: number;
  score: number;
  level: number;
  currentQ: Question | null;
  answered: boolean;
  correct: boolean | null;
  chosen: number | null;
  typedAnswer: string;
  streak: number;
  total: number;
  correctTotal: number;
  shuffledOptions: { o: string; i: number }[];
  usedQIds: Set<string>;
  levelUpBanner: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQId(q: Question): string {
  return `${q.lang}::${q.q}`;
}

function pickQuestion(selectedLangs: string[], level: number, usedQIds: Set<string>): Question {
  let pool = ALL_QUESTIONS.filter(
    (q) =>
      selectedLangs.includes(q.lang) &&
      q.level <= Math.min(level, 4) &&
      !usedQIds.has(getQId(q))
  );
  if (!pool.length) {
    usedQIds.clear();
    pool = ALL_QUESTIONS.filter(
      (q) => selectedLangs.includes(q.lang) && q.level <= Math.min(level, 4)
    );
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

const initialState: GameState = {
  screen: "start",
  selectedLangs: [...LANGS],
  lives: 3,
  score: 0,
  level: 1,
  currentQ: null,
  answered: false,
  correct: null,
  chosen: null,
  streak: 0,
  total: 0,
  correctTotal: 0,
  shuffledOptions: [],
  usedQIds: new Set(),
  levelUpBanner: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const toggleLang = useCallback((lang: string) => {
    setState((s) => {
      if (s.selectedLangs.includes(lang)) {
        if (s.selectedLangs.length <= 1) return s;
        return { ...s, selectedLangs: s.selectedLangs.filter((l) => l !== lang) };
      }
      return { ...s, selectedLangs: [...s.selectedLangs, lang] };
    });
  }, []);

  const selectAll = useCallback(() => {
    setState((s) => ({ ...s, selectedLangs: [...LANGS] }));
  }, []);

  const selectNone = useCallback(() => {
    setState((s) => ({ ...s, selectedLangs: [] }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => {
      if (!s.selectedLangs.length) return s;
      const usedQIds = new Set<string>();
      const q = pickQuestion(s.selectedLangs, 1, usedQIds);
      usedQIds.add(getQId(q));
      return {
        ...s,
        screen: "game",
        lives: 3,
        score: 0,
        level: 1,
        streak: 0,
        total: 0,
        correctTotal: 0,
        answered: false,
        correct: null,
        chosen: null,
        usedQIds,
        levelUpBanner: false,
        currentQ: q,
        shuffledOptions: shuffle(q.options.map((o, i) => ({ o, i }))),
      };
    });
  }, []);

  const answerQuestion = useCallback((chosenIdx: number) => {
    setState((s) => {
      if (s.answered || !s.currentQ) return s;
      const correct = chosenIdx === s.currentQ.answer;
      let newLevel = s.level;
      let levelUpBanner = false;
      let newStreak = correct ? s.streak + 1 : 0;
      let newLives = correct ? s.lives : s.lives - 1;

      if (correct && newStreak > 0 && newStreak % 3 === 0 && s.level < 4) {
        newLevel = s.level + 1;
        levelUpBanner = true;
      }

      return {
        ...s,
        answered: true,
        chosen: chosenIdx,
        correct,
        score: correct ? s.score + 1 : s.score,
        streak: newStreak,
        lives: newLives,
        total: s.total + 1,
        correctTotal: correct ? s.correctTotal + 1 : s.correctTotal,
        level: newLevel,
        levelUpBanner,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      if (s.lives <= 0) {
        return { ...s, screen: "gameover" };
      }
      const q = pickQuestion(s.selectedLangs, s.level, s.usedQIds);
      s.usedQIds.add(getQId(q));
      return {
        ...s,
        answered: false,
        correct: null,
        chosen: null,
        levelUpBanner: false,
        currentQ: q,
        shuffledOptions: shuffle(q.options.map((o, i) => ({ o, i }))),
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState((s) => ({
      ...initialState,
      selectedLangs: s.selectedLangs,
    }));
  }, []);

  return {
    state,
    toggleLang,
    selectAll,
    selectNone,
    startGame,
    answerQuestion,
    nextQuestion,
    restart,
  };
}
