import { useState, useCallback, useRef, useEffect } from "react";
import { ALL_QUESTIONS, LANGS, type Question } from "@/data/questions";
import {
  recordWrong,
  recordCorrect,
  recordHintUsed,
  getDueQids,
  getFlaggedTopics,
} from "@/lib/srs";
import { saveScore } from "@/lib/leaderboard";
import { recordMasteryCorrect, isLocked } from "@/lib/prereqs";

export type Screen = "start" | "game" | "gameover" | "stats";
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
  retryAvailable: boolean;
  hintsUsed: number;        // hints used on the current question
  hintPenalty: number;      // total points deducted from this question
  awaitingExplain: boolean; // explain-back prompt active
  explainText: string;
  explainAccepted: boolean | null;
  srsResurfaced: boolean;   // current question came from SRS queue
  attemptsOnQuestion: number; // number of wrong attempts on current question (resets on next question)
  answerRevealed: boolean;    // user gave up and asked to see the answer
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQId(q: Question): string {
  return `${q.lang}::${q.q}`;
}

function pickQuestion(
  selectedLangs: string[],
  level: number,
  usedQIds: Set<string>,
  forceChain?: { chainId: string; nextStep: number },
): { q: Question; resurfaced: boolean } {
  if (forceChain) {
    const next = ALL_QUESTIONS.find(
      (q) => q.chainId === forceChain.chainId && q.chainStep === forceChain.nextStep,
    );
    if (next) return { q: next, resurfaced: false };
  }

  const allowed = selectedLangs.filter((l) => !isLocked(l).locked);
  const langs = allowed.length ? allowed : selectedLangs;

  const dueQids = getDueQids();
  const dueInPool = dueQids
    .map((id) => ALL_QUESTIONS.find((q) => getQId(q) === id))
    .filter((q): q is Question => !!q && langs.includes(q.lang) && !usedQIds.has(getQId(q)));
  if (dueInPool.length > 0 && Math.random() < 0.4) {
    return { q: dueInPool[0], resurfaced: true };
  }

  const flagged = getFlaggedTopics();
  const flaggedLangs = Object.keys(flagged).filter((l) => langs.includes(l));
  let pool: Question[] = [];
  if (flaggedLangs.length > 0 && Math.random() < 0.3) {
    pool = ALL_QUESTIONS.filter(
      (q) => flaggedLangs.includes(q.lang) && q.level <= Math.min(level, 4) && !usedQIds.has(getQId(q))
        && (!q.chainStep || q.chainStep === 1),
    );
  }
  if (!pool.length) {
    pool = ALL_QUESTIONS.filter(
      (q) => langs.includes(q.lang) && q.level <= Math.min(level, 4) && !usedQIds.has(getQId(q))
        && (!q.chainStep || q.chainStep === 1),
    );
  }
  if (!pool.length) {
    usedQIds.clear();
    pool = ALL_QUESTIONS.filter(
      (q) => langs.includes(q.lang) && q.level <= Math.min(level, 4) && (!q.chainStep || q.chainStep === 1),
    );
  }
  return { q: pool[Math.floor(Math.random() * pool.length)], resurfaced: false };
}

function getTimerDuration(level: number): number {
  switch (level) {
    case 1: return 30;
    case 2: return 25;
    case 3: return 20;
    case 4: return 15;
    default: return 30;
  }
}

function calcTimerBonus(timeLeft: number, totalTime: number): number {
  const ratio = timeLeft / totalTime;
  if (ratio > 0.75) return 3;
  if (ratio > 0.5) return 2;
  if (ratio > 0.25) return 1;
  return 0;
}

function validatePatterns(answer: string, mustMatch: string[] = [], mustNotMatch: string[] = []): boolean {
  for (const p of mustMatch) {
    try {
      if (!new RegExp(p, "im").test(answer)) return false;
    } catch { return false; }
  }
  for (const p of mustNotMatch) {
    try {
      if (new RegExp(p, "im").test(answer)) return false;
    } catch {}
  }
  return true;
}

function gradeKeywordGroups(answer: string, groups: string[][], threshold = 0.6): { ok: boolean; covered: number; total: number } {
  const text = answer.toLowerCase();
  let hits = 0;
  for (const group of groups) {
    if (group.some((kw) => text.includes(kw.toLowerCase()))) hits++;
  }
  return { ok: hits / groups.length >= threshold, covered: hits, total: groups.length };
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
  hintsUsed: 0,
  hintPenalty: 0,
  awaitingExplain: false,
  explainText: "",
  explainAccepted: null,
  srsResurfaced: false,
};

function isLongForm(q: Question | null): boolean {
  return !!q && (q.type === "design" || q.type === "mock");
}

function isFreeform(q: Question | null): boolean {
  return !!q && (q.type === "typed" || q.type === "fill" || q.type === "scratch" || q.type === "bugfix" || q.type === "predict" || isLongForm(q));
}

function isChoiceLike(q: Question | null): boolean {
  if (!q) return false;
  return !isFreeform(q); // choice, bigO, tradeoff
}

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    // No timer for code editors and long-form prompts
    const t = state.currentQ?.type;
    const noTimerType = t === "scratch" || t === "bugfix" || t === "design" || t === "mock";

    if (state.screen === "game" && !state.answered && state.currentQ && state.mode === "challenge" && !noTimerType && !state.awaitingExplain) {
      timerRef.current = setInterval(() => {
        setState((s) => {
          if (s.answered || s.timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (s.timeLeft <= 0 && !s.answered && s.currentQ) {
              const newLives = s.lives - 1;
              recordWrong(getQId(s.currentQ), s.currentQ.lang, s.currentQ.q, "(timeout)", s.currentQ.accept?.[0] || s.currentQ.solution || "");
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

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.screen, state.answered, state.currentQ, state.mode, state.awaitingExplain]);

  const toggleLang = useCallback((lang: string) => {
    setState((s) => {
      if (s.selectedLangs.includes(lang)) {
        if (s.selectedLangs.length <= 1) return s;
        return { ...s, selectedLangs: s.selectedLangs.filter((l) => l !== lang) };
      }
      return { ...s, selectedLangs: [...s.selectedLangs, lang] };
    });
  }, []);

  const selectAll = useCallback(() => setState((s) => ({ ...s, selectedLangs: [...LANGS] })), []);
  const selectNone = useCallback(() => setState((s) => ({ ...s, selectedLangs: [] })), []);
  const setMode = useCallback((mode: GameMode) => setState((s) => ({ ...s, mode })), []);

  const startGame = useCallback(() => {
    setState((s) => {
      if (!s.selectedLangs.length) return s;
      const usedQIds = new Set<string>();
      const { q, resurfaced } = pickQuestion(s.selectedLangs, 1, usedQIds);
      usedQIds.add(getQId(q));
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
        timeLeft: s.mode === "challenge" ? getTimerDuration(1) : 9999,
        timerBonus: 0,
        retryAvailable: false,
        hintsUsed: 0,
        hintPenalty: 0,
        awaitingExplain: false,
        explainText: "",
        explainAccepted: null,
        srsResurfaced: resurfaced,
        currentQ: q,
        shuffledOptions: isFreeform(q) ? [] : shuffle(q.options.map((o, i) => ({ o, i }))),
      };
    });
  }, []);

  const setTypedAnswer = useCallback((val: string) => setState((s) => ({ ...s, typedAnswer: val })), []);

  const useHint = useCallback(() => {
    setState((s) => {
      if (!s.currentQ || s.answered) return s;
      recordHintUsed(getQId(s.currentQ), s.currentQ.lang);
      return { ...s, hintsUsed: s.hintsUsed + 1, hintPenalty: s.hintPenalty + 1 };
    });
  }, []);

  const finalizeAnswer = (s: GameState, correct: boolean, userAnswerStr: string): GameState => {
    if (!s.currentQ) return s;
    let newLevel = s.level;
    let levelUpBanner = false;
    let newStreak = correct ? s.streak + 1 : 0;
    let newLives = correct ? s.lives : s.lives - 1;
    let lifeRecovered = false;

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
    const earned = correct ? Math.max(0, 1 + bonus - s.hintPenalty) : 0;

    // SRS + mastery
    if (correct) {
      recordCorrect(getQId(s.currentQ), s.currentQ.lang);
      recordMasteryCorrect(s.currentQ.lang);
    } else {
      recordWrong(
        getQId(s.currentQ),
        s.currentQ.lang,
        s.currentQ.q,
        userAnswerStr,
        s.currentQ.accept?.[0] || s.currentQ.solution || (s.currentQ.options[s.currentQ.answer] ?? ""),
      );
    }

    // Explain-back: 30% of correct answers, only if keywords defined
    const askExplain = correct && !!s.currentQ.explainKeywords?.length && Math.random() < 0.3;

    return {
      ...s,
      answered: true,
      correct,
      score: s.score + earned,
      streak: newStreak,
      lives: newLives,
      total: s.total + 1,
      correctTotal: correct ? s.correctTotal + 1 : s.correctTotal,
      level: newLevel,
      levelUpBanner,
      lifeRecovered,
      timerBonus: bonus,
      retryAvailable: !correct && s.mode === "practice",
      awaitingExplain: askExplain,
      explainText: "",
      explainAccepted: null,
    };
  };

  const answerQuestion = useCallback((chosenIdx: number) => {
    setState((s) => {
      if (s.answered || !s.currentQ) return s;
      const correct = chosenIdx === s.currentQ.answer;
      return { ...finalizeAnswer(s, correct, s.currentQ.options[chosenIdx] || ""), chosen: chosenIdx };
    });
  }, []);

  const answerTyped = useCallback(() => {
    setState((s) => {
      if (s.answered || !s.currentQ) return s;
      const q = s.currentQ;
      const userAnswer = s.typedAnswer;

      let correct = false;
      if (q.type === "scratch" || q.type === "bugfix") {
        correct = validatePatterns(userAnswer, q.mustMatch, q.mustNotMatch);
      } else if (q.type === "design" || q.type === "mock") {
        const groups = q.keywordGroups || [];
        if (groups.length) correct = gradeKeywordGroups(userAnswer, groups, q.passThreshold ?? 0.6).ok;
      } else if (q.accept) {
        const norm = userAnswer.trim().toLowerCase().replace(/\s+/g, " ");
        correct = q.accept.some((a) => a.trim().toLowerCase().replace(/\s+/g, " ") === norm);
      }
      return { ...finalizeAnswer(s, correct, userAnswer), chosen: null };
    });
  }, []);

  const submitExplain = useCallback(() => {
    setState((s) => {
      if (!s.awaitingExplain || !s.currentQ?.explainKeywords) return s;
      const text = s.explainText.toLowerCase();
      const ok = s.currentQ.explainKeywords.some((k) => text.includes(k.toLowerCase()));
      // Bonus +1 if accepted, -1 from score if rejected (but not below earned points)
      return {
        ...s,
        explainAccepted: ok,
        score: ok ? s.score + 1 : s.score,
        awaitingExplain: false,
      };
    });
  }, []);

  const setExplainText = useCallback((val: string) => setState((s) => ({ ...s, explainText: val })), []);

  const skipExplain = useCallback(() => setState((s) => ({ ...s, awaitingExplain: false })), []);

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
      hintsUsed: 0,
      hintPenalty: 0,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      if (s.lives <= 0 && s.mode === "challenge") {
        // Save score to leaderboard
        const acc = s.total > 0 ? Math.round((s.correctTotal / s.total) * 100) : 0;
        saveScore({
          date: Date.now(),
          score: s.score,
          level: s.level,
          accuracy: acc,
          total: s.total,
          mode: s.mode,
          langs: s.selectedLangs,
        });
        return { ...s, screen: "gameover" };
      }
      // Continue chain if last question was a chain step and was correct
      let forceChain: { chainId: string; nextStep: number } | undefined;
      if (s.correct && s.currentQ?.chainId && s.currentQ.chainStep) {
        forceChain = { chainId: s.currentQ.chainId, nextStep: s.currentQ.chainStep + 1 };
      }
      const { q, resurfaced } = pickQuestion(s.selectedLangs, s.level, s.usedQIds, forceChain);
      s.usedQIds.add(getQId(q));
      return {
        ...s,
        answered: false,
        correct: null,
        chosen: null,
        typedAnswer: "",
        levelUpBanner: false,
        lifeRecovered: false,
        timeLeft: s.mode === "challenge" ? getTimerDuration(s.level) : 9999,
        timerBonus: 0,
        retryAvailable: false,
        hintsUsed: 0,
        hintPenalty: 0,
        awaitingExplain: false,
        explainText: "",
        explainAccepted: null,
        srsResurfaced: resurfaced,
        currentQ: q,
        shuffledOptions: isFreeform(q) ? [] : shuffle(q.options.map((o, i) => ({ o, i }))),
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

  const goToStats = useCallback(() => setState((s) => ({ ...s, screen: "stats" })), []);
  const goToStart = useCallback(() => setState((s) => ({ ...s, screen: "start" })), []);

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
    useHint,
    submitExplain,
    setExplainText,
    skipExplain,
    nextQuestion,
    retryQuestion,
    restart,
    goToStats,
    goToStart,
  };
}
