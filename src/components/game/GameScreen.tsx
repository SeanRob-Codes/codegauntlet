import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANG_COLORS } from "@/data/questions";
import type { GameState } from "@/hooks/useGameState";
import TimerBar from "./TimerBar";

interface GameScreenProps {
  state: GameState;
  onAnswer: (idx: number) => void;
  onAnswerTyped: () => void;
  onTypedChange: (val: string) => void;
  onNext: () => void;
  onRetry: () => void;
  onReveal: () => void;
  onUseHint: () => void;
  onSubmitExplain: () => void;
  onExplainChange: (val: string) => void;
  onSkipExplain: () => void;
}

const LEVEL_LABELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

function getTimerDuration(level: number): number {
  switch (level) {
    case 1: return 30;
    case 2: return 25;
    case 3: return 20;
    case 4: return 15;
    default: return 30;
  }
}

export default function GameScreen({
  state, onAnswer, onAnswerTyped, onTypedChange, onNext, onRetry, onReveal,
  onUseHint, onSubmitExplain, onExplainChange, onSkipExplain,
}: GameScreenProps) {
  const q = state.currentQ;
  const inputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const isShortTyped = q?.type === "typed" || q?.type === "fill" || q?.type === "predict";
  const isLongForm = q?.type === "design" || q?.type === "mock";
  const isCodeEditor = q?.type === "scratch" || q?.type === "bugfix" || isLongForm;
  const isTyped = isShortTyped || isCodeEditor;
  const isFill = q?.type === "fill";
  const isScratch = q?.type === "scratch";
  const isBugFix = q?.type === "bugfix";
  const isPredict = q?.type === "predict";
  const isBigO = q?.type === "bigO";
  const isTradeoff = q?.type === "tradeoff";
  const isPractice = state.mode === "practice";
  const noTimer = isCodeEditor;

  useEffect(() => {
    if (isShortTyped && !state.answered && inputRef.current) inputRef.current.focus();
    if (isCodeEditor && !state.answered && taRef.current) taRef.current.focus();
  }, [q, isShortTyped, isCodeEditor, state.answered]);

  // Pre-fill bug-fix editor with the buggy code on first render of question
  useEffect(() => {
    if (isBugFix && !state.answered && q?.buggyCode && !state.typedAnswer) {
      onTypedChange(q.buggyCode);
    }
  }, [q, isBugFix, state.answered]);

  if (!q) return null;

  const lc = LANG_COLORS[q.lang] || LANG_COLORS["Git"];
  const pct = Math.min((state.score / 20) * 100, 98);
  const totalTime = getTimerDuration(q.level);

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.answered && state.typedAnswer.trim()) onAnswerTyped();
  };

  const getHintContent = () => {
    if (!q) return null;
    const hints: string[] = [];
    if (state.hintsUsed >= 1) {
      if (q.hint) hints.push(`💡 ${q.hint}`);
      else if (q.accept?.[0]) hints.push(`💡 Answer starts with "${q.accept[0].charAt(0).toUpperCase()}"`);
      else if (q.requirements?.length) hints.push(`💡 Required: ${q.requirements[0]}`);
    }
    if (state.hintsUsed >= 2) {
      if (q.requirements && q.requirements.length > 1) {
        hints.push(`📋 Also: ${q.requirements.slice(1).join(" · ")}`);
      } else if (q.accept?.[0]) {
        const a = q.accept[0];
        hints.push(`🔤 Starts with: "${a.slice(0, Math.ceil(a.length * 0.4))}..."`);
      }
    }
    if (state.hintsUsed >= 3) {
      if (q.accept?.[0]) hints.push(`📏 Answer is ${q.accept[0].length} chars`);
      else if (q.solution) hints.push(`🧩 Solution preview: ${q.solution.slice(0, 40)}...`);
    }
    return hints;
  };

  const renderFillCode = (code: string) => {
    const parts = code.split("____");
    if (parts.length < 2) return <span>{code}</span>;
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="inline-block min-w-[60px] border-b-2 border-dashed border-primary mx-1 text-primary font-bold">
                {state.answered ? (
                  <span className={state.correct ? "text-primary" : "text-destructive"}>
                    {state.correct ? q.accept?.[0] || "" : state.typedAnswer || "???"}
                  </span>
                ) : (
                  <span className="text-muted-foreground/40 text-xs">????</span>
                )}
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-base font-mono font-bold text-foreground">
          {isPractice ? "📖 Practice" : "Dev Skills Gauntlet"}
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <StatChip label="Score" value={state.score} />
          <StatChip label="Lvl" value={`${q.level}/4`} />
          {state.streak >= 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono">
              <span className="text-glow-warning">🔥</span>
              <span className="font-bold text-warning">{state.streak}</span>
            </motion.div>
          )}
          {!isPractice && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary border border-border">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`text-sm ${i < state.lives ? "text-destructive text-glow-destructive" : "text-muted-foreground/30"}`}>
                  {i < state.lives ? "♥" : "♡"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!noTimer && <TimerBar timeLeft={state.timeLeft} totalTime={totalTime} isPractice={isPractice} />}

      <div className="h-1 bg-secondary rounded-full mb-5 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-progress)" }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>

      <AnimatePresence>
        {state.srsResurfaced && !state.answered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center text-xs font-mono py-2 px-4 mb-4 rounded-lg bg-warning/10 border border-warning/30 text-warning">
            🔁 Review: you got this one wrong before. Make it stick.
          </motion.div>
        )}
        {state.levelUpBanner && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="text-center text-xs font-mono font-semibold py-2 px-4 mb-4 rounded-lg bg-primary/10 border border-primary/30 text-primary box-glow-primary">
            ⬆ Level up! Questions are harder now.
          </motion.div>
        )}
        {state.lifeRecovered && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="text-center text-xs font-mono font-semibold py-2 px-4 mb-4 rounded-lg bg-accent/10 border border-accent/30 text-accent-foreground">
            💚 Life recovered!
          </motion.div>
        )}
      </AnimatePresence>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-1"
        style={{ background: lc.bg, border: `1px solid ${lc.border}`, color: lc.text, boxShadow: `0 0 8px ${lc.border}30` }}>
        {q.lang}
      </span>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <p className="text-xs text-muted-foreground font-mono">
          {LEVEL_LABELS[q.level]} · Difficulty {q.level}/4
        </p>
        {isFill && <Tag color="warning">🧩 Fill the blank</Tag>}
        {q.type === "typed" && <Tag color="accent">⌨ Type answer</Tag>}
        {isPredict && <Tag color="accent">🔮 Predict output</Tag>}
        {isBigO && <Tag color="primary">📈 Big-O</Tag>}
        {isTradeoff && <Tag color="primary">⚖ Trade-off</Tag>}
        {isScratch && <Tag color="primary">✍ Write from scratch</Tag>}
        {isBugFix && <Tag color="destructive">🐛 Bug fix</Tag>}
        {q.type === "design" && <Tag color="primary">🏗 System design</Tag>}
        {q.type === "mock" && <Tag color="accent">🎤 Mock interview</Tag>}
        {q.chainId && <Tag color="warning">🔗 Chain {q.chainStep}</Tag>}
        {state.hintPenalty > 0 && <Tag color="warning">−{state.hintPenalty} hint penalty</Tag>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.q + (state.retryAvailable ? "" : String(state.answered))}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <p className="text-sm text-foreground leading-relaxed mb-4">{q.q}</p>

          {isScratch && q.requirements && (
            <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground mb-2">Requirements</p>
              <ul className="text-xs font-mono text-foreground space-y-1">
                {q.requirements.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          )}

          {q.code && !isFill && (
            <pre className="bg-background border border-border rounded-lg p-4 font-mono text-xs text-primary leading-relaxed mb-4 overflow-x-auto">{q.code}</pre>
          )}
          {q.code && isFill && (
            <pre className="bg-background border border-border rounded-lg p-4 font-mono text-xs text-primary leading-relaxed mb-4 overflow-x-auto whitespace-pre-wrap">
              {renderFillCode(q.code)}
            </pre>
          )}

          {/* Multiple choice */}
          {!isTyped && (
            <div className="flex flex-col gap-2">
              {state.shuffledOptions.map(({ o, i }, displayIdx) => {
                let btnClass = "flex items-stretch text-left rounded-lg text-sm font-medium border transition-all duration-150 overflow-hidden min-h-[64px]";
                let letterClass = "flex items-center justify-center w-10 shrink-0 font-mono font-bold text-xs border-r";
                if (state.answered) {
                  if (i === q.answer) {
                    btnClass += " bg-primary/10 border-primary/50 text-primary box-glow-primary";
                    letterClass += " bg-primary/15 border-primary/40 text-primary";
                  } else if (i === state.chosen && !state.correct) {
                    btnClass += " bg-destructive/10 border-destructive/50 text-destructive box-glow-destructive";
                    letterClass += " bg-destructive/15 border-destructive/40 text-destructive";
                  } else {
                    btnClass += " bg-secondary border-border text-muted-foreground opacity-50";
                    letterClass += " bg-muted/30 border-border text-muted-foreground";
                  }
                } else {
                  btnClass += " bg-secondary border-border text-secondary-foreground hover:bg-muted hover:border-muted-foreground/30 hover:text-foreground cursor-pointer";
                  letterClass += " bg-muted/40 border-border text-muted-foreground";
                }
                return (
                  <motion.button key={i} whileTap={!state.answered ? { scale: 0.98 } : undefined}
                    onClick={() => !state.answered && onAnswer(i)} disabled={state.answered} className={btnClass}>
                    <span className={letterClass}>{OPTION_LETTERS[displayIdx]}</span>
                    <span className="flex-1 px-4 py-3 leading-relaxed self-center">{o}</span>
                  </motion.button>
                );
              })}
              {/* Give-up button for MC in practice mode after 2+ wrong attempts */}
              {!state.answered && isPractice && state.attemptsOnQuestion >= 2 && (
                <button type="button" onClick={onReveal}
                  className="self-start mt-1 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground border border-border hover:text-warning hover:border-warning/30 transition-all">
                  🏳 Show me the answer
                </button>
              )}
            </div>
          )}

          {/* Short typed input (typed/fill) */}
          {isShortTyped && !state.answered && (
            <form onSubmit={handleTypedSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none">
                  {isFill ? "___" : "›"}
                </span>
                <input ref={inputRef} type="text" value={state.typedAnswer}
                  onChange={(e) => onTypedChange(e.target.value)}
                  placeholder={isFill ? "Type the missing code..." : "Type your answer..."}
                  maxLength={200}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm font-mono bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  autoComplete="off" spellCheck={false} />
              </div>
              <HintBlock state={state} onUseHint={onUseHint} onReveal={onReveal} isPractice={isPractice} hints={getHintContent()} />
              <SubmitBtn disabled={!state.typedAnswer.trim()} />
            </form>
          )}

          {/* Code editor (scratch/bugfix) */}
          {isCodeEditor && !state.answered && (
            <form onSubmit={handleTypedSubmit} className="flex flex-col gap-3">
              <textarea
                ref={taRef}
                value={state.typedAnswer}
                onChange={(e) => onTypedChange(e.target.value)}
                placeholder={
                  isScratch ? "Write your code here..." :
                  isBugFix ? "Edit the code to fix it..." :
                  q.type === "design" ? "Outline your design — data flow, storage, scaling, trade-offs..." :
                  "Walk through your thought process step by step..."
                }
                rows={isLongForm ? 10 : isBugFix ? 8 : 10}
                spellCheck={false}
                className="w-full p-3 rounded-lg text-xs font-mono bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all leading-relaxed resize-y"
              />
              <p className="text-[10px] text-muted-foreground font-mono">
                💡 {isLongForm
                  ? `Graded on coverage of key concepts (need ≥${Math.round((q.passThreshold ?? 0.6) * 100)}% of topic groups).`
                  : "Validated by pattern matching — write idiomatic code, no shortcuts."}
              </p>
              <HintBlock state={state} onUseHint={onUseHint} onReveal={onReveal} isPractice={isPractice} hints={getHintContent()} />
              <SubmitBtn disabled={!state.typedAnswer.trim()} label={isBugFix ? "Submit fix →" : isLongForm ? "Submit answer →" : "Submit code →"} />
            </form>
          )}

          {/* Typed/code feedback */}
          {isTyped && state.answered && (
            <div className="flex flex-col gap-2">
              <div className={`px-4 py-3 rounded-lg text-xs font-mono border whitespace-pre-wrap ${
                state.correct ? "bg-primary/10 border-primary/50 text-primary"
                              : "bg-destructive/10 border-destructive/50 text-destructive"
              }`}>
                <span className="text-muted-foreground text-[10px] block mb-1 uppercase tracking-wider">Your answer</span>
                {state.typedAnswer || "(empty)"}
              </div>
              {!state.correct && (q.solution || q.accept) && (
                <div className="px-4 py-3 rounded-lg text-xs font-mono border bg-primary/10 border-primary/50 text-primary whitespace-pre-wrap">
                  <span className="text-muted-foreground text-[10px] block mb-1 uppercase tracking-wider">
                    {q.solution ? "Reference solution" : "Accepted answers"}
                  </span>
                  {q.solution || q.accept!.join(" · ")}
                </div>
              )}
            </div>
          )}

          {/* Explanation + bonus + actions */}
          <AnimatePresence>
            {state.answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`mt-4 p-4 rounded-lg text-sm leading-relaxed border ${
                  state.correct ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}>
                  {state.correct ? "✓ Correct! " : state.timeLeft <= 0 && state.chosen === -1 ? "⏰ Time's up! " : "✗ Not quite. "}
                  {q.explain}
                  {state.correct && state.timerBonus > 0 && (
                    <span className="ml-2 text-xs font-bold text-warning">⚡ +{state.timerBonus} speed bonus</span>
                  )}
                  {state.hintPenalty > 0 && (
                    <span className="ml-2 text-xs font-bold text-warning">−{state.hintPenalty} hints</span>
                  )}
                </div>

                {/* Explain-back prompt */}
                {state.awaitingExplain && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg border border-accent/40 bg-accent/5">
                    <p className="text-xs font-mono font-bold text-accent-foreground mb-2">
                      🧠 In one sentence — why is this the answer?
                    </p>
                    <textarea
                      value={state.explainText}
                      onChange={(e) => onExplainChange(e.target.value)}
                      rows={2}
                      placeholder="If you can't explain it, you don't know it..."
                      className="w-full p-2 rounded text-xs font-mono bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={onSubmitExplain} disabled={!state.explainText.trim()}
                        className="px-4 py-1.5 rounded text-xs font-mono font-semibold border border-accent/50 bg-accent/10 text-accent-foreground hover:bg-accent/20 disabled:opacity-30">
                        Submit (+1 if correct)
                      </button>
                      <button onClick={onSkipExplain}
                        className="px-4 py-1.5 rounded text-xs font-mono text-muted-foreground hover:text-foreground">
                        Skip
                      </button>
                    </div>
                  </motion.div>
                )}
                {state.explainAccepted === true && (
                  <div className="mt-3 px-3 py-2 rounded text-xs font-mono bg-primary/10 border border-primary/30 text-primary">
                    ✓ Solid explanation. +1 bonus.
                  </div>
                )}
                {state.explainAccepted === false && (
                  <div className="mt-3 px-3 py-2 rounded text-xs font-mono bg-warning/10 border border-warning/30 text-warning">
                    ⚠ Vague — review the concept. We'll resurface this one.
                  </div>
                )}

                {!state.awaitingExplain && (
                  <div className="flex gap-2 mt-4">
                    {state.retryAvailable && (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRetry}
                        className="px-6 py-2.5 rounded-lg text-sm font-mono font-semibold border border-accent/50 bg-accent/10 text-accent-foreground hover:bg-accent/20">
                        🔄 Retry
                      </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext}
                      className="px-6 py-2.5 rounded-lg text-sm font-mono font-semibold border border-border bg-secondary text-foreground hover:bg-muted hover:border-muted-foreground/30">
                      {!isPractice && state.lives <= 0 ? "See results" : "Next question →"}
                    </motion.button>
                  </div>
                )}
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

function Tag({ children, color }: { children: React.ReactNode; color: "primary" | "warning" | "accent" | "destructive" }) {
  const styles: Record<string, string> = {
    primary: "bg-primary/15 border-primary/30 text-primary",
    warning: "bg-warning/15 border-warning/30 text-warning",
    accent: "bg-accent/20 border-accent/30 text-accent-foreground",
    destructive: "bg-destructive/15 border-destructive/30 text-destructive",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${styles[color]}`}>
      {children}
    </span>
  );
}

function HintBlock({ state, onUseHint, hints }: { state: GameState; onUseHint: () => void; hints: string[] | null }) {
  return (
    <div className="flex flex-col gap-2">
      {hints && hints.map((h, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg text-xs font-mono bg-warning/10 border border-warning/20 text-warning">
          {h}
        </motion.div>
      ))}
      {state.hintsUsed < 3 && (
        <button type="button" onClick={onUseHint}
          className="self-start px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground border border-border hover:text-warning hover:border-warning/30 transition-all">
          {state.hintsUsed === 0 ? "🤔 Hint (−1 pt, flags topic for review)" : `💡 Another hint (${3 - state.hintsUsed} left, −1 pt each)`}
        </button>
      )}
    </div>
  );
}

function SubmitBtn({ disabled, label = "Submit →" }: { disabled: boolean; label?: string }) {
  return (
    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={disabled}
      className="self-start px-6 py-2.5 rounded-lg text-sm font-mono font-semibold border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
      {label}
    </motion.button>
  );
}
