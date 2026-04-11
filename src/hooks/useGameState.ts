import { useState, useCallback, useRef, useEffect } from "react";
import { ALL_QUESTIONS, LANGS, type Question } from "@/data/questions";

export type Screen = "start" | "game" | "gameover";
export type GameMode = "challenge" | "practice";

export interface GameState {
  screen: Screen;
  mode: GameMode;
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
  lifeRecovered: boolean;
  timeLeft: number;
  timerBonus: number;
  retryAvailable: boolean; // practice mode retry
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

// Timer duration based on question level (seconds)
function getTimerDuration(level: number): number {
  switch (level) {
    case 1: return 30;
    case 2: return 25;
    case 3: return 20;
    case 4: return 15;
    default: return 30;
  }
}

// Bonus points based on remaining time
function calcTimerBonus(timeLeft: number, totalTime: number): number {
  const ratio = timeLeft / totalTime;
  if (ratio > 0.75) return 3; // super fast
  if (ratio > 0.5) return 2;  // fast
  if (ratio > 0.25) return 1; // decent
  return 0;
}

const initialState: GameState = {
  screen: "start",
  mode: "challenge",
  selectedLangs: [...LANGS],
  lives: 3,
  score: 0,
  level: 1,
  currentQ: null,
  answered: false,
  correct: null,
  chosen: null,
  typedAnswer: "",
  streak: 0,
  total: 0,
  correctTotal: 0,
  shuffledOptions: [],
  usedQIds: new Set(),
  levelUpBanner: false,
  lifeRecovered: false,
  timeLeft: 30,
  timerBonus: 0,
  retryAvailable: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (state.screen === "game" && !state.answered && state.currentQ && state.mode === "challenge") {
      timerRef.current = setInterval(() => {
        setState((s) => {
          if (s.answered || s.timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (s.timeLeft <= 0 && !s.answered) {
              // Time's up - auto fail
              const newLives = s.lives - 1;
              return {
                ...s,
                answered: true,
                correct: false,
                chosen: -1,
                streak: 0,
                lives: newLives,
                total: s.total + 1,
                timeLeft: 0,
                timerBonus: 0,
                lifeRecovered: false,
              };
            }
            return s;
          }
          return { ...s, timeLeft: s.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.screen, state.answered, state.currentQ, state.mode]);

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

  const setMode = useCallback((mode: GameMode) => {
    setState((s) => ({ ...s, mode }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => {
      if (!s.selectedLangs.length) return s;
      const usedQIds = new Set<string>();
      const q = pickQuestion(s.selectedLangs, 1, usedQIds);
      usedQIds.add(getQId(q));
      const timerDuration = getTimerDuration(1);
      return {
        ...s,
        screen: "game",
        lives: s.mode === "practice" ? Infinity : 3,
        score: 0,
        level: 1,
        streak: 0,
        total: 0,
        correctTotal: 0,
        answered: false,
        correct: null,
        chosen: null,
        typedAnswer: "",
        usedQIds,
        levelUpBanner: false,
        lifeRecovered: false,
        timeLeft: s.mode === "challenge" ? timerDuration : 9999,
        timerBonus: 0,
        retryAvailable: false,
        currentQ: q,
        shuffledOptions: (q.type === "typed" || q.type === "fill") ? [] : shuffle(q.options.map((o, i) => ({ o, i }))),
      };
    });
  }, []);

  const setTypedAnswer = useCallback((val: string) => {
    setState((s) => ({ ...s, typedAnswer: val }));
  }, []);

  const answerQuestion = useCallback((chosenIdx: number) => {
    setState((s) => {
      if (s.answered || !s.currentQ) return s;
      const correct = chosenIdx === s.currentQ.answer;
      let newLevel = s.level;
      let levelUpBanner = false;
      let newStreak = correct ? s.streak + 1 : 0;
      let newLives = correct ? s.lives : s.lives - 1;
      let lifeRecovered = false;

      // Life recovery: on last life, correct answer gives a life back
      if (correct && s.lives === 1 && s.mode === "challenge") {
        newLives = 2;
        lifeRecovered = true;
      }

      if (correct && newStreak > 0 && newStreak % 3 === 0 && s.level < 4) {
        newLevel = s.level + 1;
        levelUpBanner = true;
      }

      const totalTime = getTimerDuration(s.level);
      const bonus = correct && s.mode === "challenge" ? calcTimerBonus(s.timeLeft, totalTime) : 0;

      return {
        ...s,
        answered: true,
        chosen: chosenIdx,
        correct,
        score: correct ? s.score + 1 + bonus : s.score,
        streak: newStreak,
        lives: newLives,
        total: s.total + 1,
        correctTotal: correct ? s.correctTotal + 1 : s.correctTotal,
        level: newLevel,
        levelUpBanner,
        lifeRecovered,
        timerBonus: bonus,
        retryAvailable: !correct && s.mode === "practice",
      };
    });
  }, []);

  const answerTyped = useCallback(() => {
    setState((s) => {
      if (s.answered || !s.currentQ || !s.currentQ.accept) return s;
      const userAnswer = s.typedAnswer.trim().toLowerCase();
      const correct = s.currentQ.accept.some(
        (a) => a.trim().toLowerCase() === userAnswer
      );
      let newLevel = s.level;
      let levelUpBanner = false;
      let newStreak = correct ? s.streak + 1 : 0;
      let newLives = correct ? s.lives : s.lives - 1;
      let lifeRecovered = false;

      // Life recovery
      if (correct && s.lives === 1 && s.mode === "challenge") {
        newLives = 2;
        lifeRecovered = true;
      }

      if (correct && newStreak > 0 && newStreak % 3 === 0 && s.level < 4) {
        newLevel = s.level + 1;
        levelUpBanner = true;
      }

      const totalTime = getTimerDuration(s.level);
      const bonus = correct && s.mode === "challenge" ? calcTimerBonus(s.timeLeft, totalTime) : 0;

      return {
        ...s,
        answered: true,
        chosen: null,
        correct,
        score: correct ? s.score + 1 + bonus : s.score,
        streak: newStreak,
        lives: newLives,
        total: s.total + 1,
        correctTotal: correct ? s.correctTotal + 1 : s.correctTotal,
        level: newLevel,
        levelUpBanner,
        lifeRecovered,
        timerBonus: bonus,
        retryAvailable: !correct && s.mode === "practice",
      };
    });
  }, []);

  const retryQuestion = useCallback(() => {
    setState((s) => ({
      ...s,
      answered: false,
      correct: null,
      chosen: null,
      typedAnswer: "",
      retryAvailable: false,
      lifeRecovered: false,
      timerBonus: 0,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      if (s.lives <= 0 && s.mode === "challenge") {
        return { ...s, screen: "gameover" };
      }
      const q = pickQuestion(s.selectedLangs, s.level, s.usedQIds);
      s.usedQIds.add(getQId(q));
      const timerDuration = getTimerDuration(s.level);
      return {
        ...s,
        answered: false,
        correct: null,
        chosen: null,
        typedAnswer: "",
        levelUpBanner: false,
        lifeRecovered: false,
        timeLeft: s.mode === "challenge" ? timerDuration : 9999,
        timerBonus: 0,
        retryAvailable: false,
        currentQ: q,
        shuffledOptions: (q.type === "typed" || q.type === "fill") ? [] : shuffle(q.options.map((o, i) => ({ o, i }))),
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState((s) => ({
      ...initialState,
      selectedLangs: s.selectedLangs,
      mode: s.mode,
    }));
  }, []);

  return {
    state,
    toggleLang,
    selectAll,
    selectNone,
    setMode,
    startGame,
    answerQuestion,
    answerTyped,
    setTypedAnswer,
    nextQuestion,
    retryQuestion,
    restart,
  };
}
