import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANG_COLORS } from "@/data/questions";
import type { GameState } from "@/hooks/useGameState";

interface GameScreenProps {
  state: GameState;
  onAnswer: (idx: number) => void;
  onAnswerTyped: () => void;
  onTypedChange: (val: string) => void;
  onNext: () => void;
}

const LEVEL_LABELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

export default function GameScreen({ state, onAnswer, onAnswerTyped, onTypedChange, onNext }: GameScreenProps) {
  const q = state.currentQ;
  const inputRef = useRef<HTMLInputElement>(null);
  const isTyped = q?.type === "typed";

  useEffect(() => {
    if (isTyped && !state.answered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyped, state.answered, q]);

  if (!q) return null;

  const lc = LANG_COLORS[q.lang] || LANG_COLORS["Git"];
  const pct = Math.min((state.score / 20) * 100, 98);

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.answered && state.typedAnswer.trim()) {
      onAnswerTyped();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-base font-mono font-bold text-foreground">
          Dev Skills Gauntlet
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <StatChip label="Score" value={state.score} />
          <StatChip label="Lvl" value={`${q.level}/4`} />
          {state.streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono"
            >
              <span className="text-glow-warning">🔥</span>
              <span className="font-bold text-warning">{state.streak}</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < state.lives ? "text-destructive text-glow-destructive" : "text-muted-foreground/30"
                }`}
              >
                {i < state.lives ? "♥" : "♡"}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-secondary rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--gradient-progress)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Level up banner */}
      <AnimatePresence>
        {state.levelUpBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-xs font-mono font-semibold py-2 px-4 mb-4 rounded-lg bg-primary/10 border border-primary/30 text-primary box-glow-primary"
          >
            ⬆ Level up! Questions are harder now.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language badge */}
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-1"
        style={{
          background: lc.bg,
          border: `1px solid ${lc.border}`,
          color: lc.text,
          boxShadow: `0 0 8px ${lc.border}30`,
        }}
      >
        {q.lang}
      </span>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs text-muted-foreground font-mono">
          {LEVEL_LABELS[q.level]} · Difficulty {q.level}/4
        </p>
        {isTyped && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/20 border border-accent/30 text-accent-foreground">
            ⌨ Type answer
          </span>
        )}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.q}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <p className="text-sm text-foreground leading-relaxed mb-4">{q.q}</p>

          {q.code && (
            <pre className="bg-background border border-border rounded-lg p-4 font-mono text-xs text-primary leading-relaxed mb-4 overflow-x-auto">
              {q.code}
            </pre>
          )}

          {/* Multiple choice answers */}
          {!isTyped && (
            <div className="flex flex-col gap-2">
              {state.shuffledOptions.map(({ o, i }) => {
                let btnClass =
                  "text-left px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-150";

                if (state.answered) {
                  if (i === q.answer) {
                    btnClass +=
                      " bg-primary/10 border-primary/50 text-primary box-glow-primary";
                  } else if (i === state.chosen && !state.correct) {
                    btnClass +=
                      " bg-destructive/10 border-destructive/50 text-destructive box-glow-destructive";
                  } else {
                    btnClass += " bg-secondary border-border text-muted-foreground opacity-50";
                  }
                } else {
                  btnClass +=
                    " bg-secondary border-border text-secondary-foreground hover:bg-muted hover:border-muted-foreground/30 hover:text-foreground cursor-pointer";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={!state.answered ? { scale: 0.98 } : undefined}
                    onClick={() => !state.answered && onAnswer(i)}
                    disabled={state.answered}
                    className={btnClass}
                  >
                    {o}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Typed answer input */}
          {isTyped && !state.answered && (
            <form onSubmit={handleTypedSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none">›</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={state.typedAnswer}
                  onChange={(e) => onTypedChange(e.target.value)}
                  placeholder="Type your answer..."
                  maxLength={200}
                  className="w-full pl-7 pr-4 py-3 rounded-lg text-sm font-mono bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!state.typedAnswer.trim()}
                className="self-start px-6 py-2.5 rounded-lg text-sm font-mono font-semibold border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit →
              </motion.button>
            </form>
          )}

          {/* Show correct answer for typed after answering */}
          {isTyped && state.answered && (
            <div className="flex flex-col gap-2">
              <div
                className={`px-4 py-3 rounded-lg text-sm font-mono border ${
                  state.correct
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-destructive/10 border-destructive/50 text-destructive"
                }`}
              >
                <span className="text-muted-foreground text-xs block mb-1">Your answer:</span>
                {state.typedAnswer || "(empty)"}
              </div>
              {!state.correct && q.accept && (
                <div className="px-4 py-3 rounded-lg text-sm font-mono border bg-primary/10 border-primary/50 text-primary">
                  <span className="text-muted-foreground text-xs block mb-1">Accepted answers:</span>
                  {q.accept.join(" · ")}
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {state.answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`mt-4 p-4 rounded-lg text-sm leading-relaxed border ${
                    state.correct
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  {state.correct ? "✓ Correct! " : "✗ Not quite. "}
                  {q.explain}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="mt-4 px-6 py-2.5 rounded-lg text-sm font-mono font-semibold border border-border bg-secondary text-foreground hover:bg-muted hover:border-muted-foreground/30 transition-all"
                >
                  {state.lives > 0 ? "Next question →" : "See results"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono text-muted-foreground">
      {label} <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}
