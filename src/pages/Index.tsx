import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { useAuth } from "@/hooks/useAuth";
import StartScreen from "@/components/game/StartScreen";
import GameScreen from "@/components/game/GameScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import StatsScreen from "@/components/game/StatsScreen";

const Index = () => {
  const { session, loading } = useAuth();
  const {
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
    revealAnswer,
    restart,
    goToStats,
    goToStart,
  } = useGameState();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA";

      if (e.key === "Escape") {
        if (state.screen === "game" || state.screen === "stats" || state.screen === "gameover") {
          e.preventDefault();
          state.screen === "gameover" ? restart() : goToStart();
        }
        return;
      }
      if (state.screen !== "game" || !state.currentQ) return;

      if (e.key === "Enter" && state.answered && !state.awaitingExplain) {
        e.preventDefault();
        nextQuestion();
        return;
      }
      // Number keys for multiple choice — only when not typing in a field
      if (!inField && !state.answered) {
        const t = state.currentQ.type;
        const isChoice = !t || t === "choice" || t === "bigO" || t === "tradeoff";
        if (isChoice && /^[1-4]$/.test(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < state.shuffledOptions.length) {
            e.preventDefault();
            answerQuestion(state.shuffledOptions[idx].i);
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.screen, state.answered, state.currentQ, state.shuffledOptions, state.awaitingExplain, nextQuestion, answerQuestion, restart, goToStart]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!session) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background flex justify-center items-start px-3 pt-16 pb-6 sm:p-6 md:p-8">
      <div className="w-full max-w-[680px] bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
        {state.screen === "start" && (
          <StartScreen
            selectedLangs={state.selectedLangs}
            mode={state.mode}
            onToggleLang={toggleLang}
            onSelectAll={selectAll}
            onSelectNone={selectNone}
            onSetMode={setMode}
            onStart={startGame}
            onStats={goToStats}
          />
        )}
        {state.screen === "game" && (
          <GameScreen
            state={state}
            onAnswer={answerQuestion}
            onAnswerTyped={answerTyped}
            onTypedChange={setTypedAnswer}
            onNext={nextQuestion}
            onRetry={retryQuestion}
            onReveal={revealAnswer}
            onUseHint={useHint}
            onSubmitExplain={submitExplain}
            onExplainChange={setExplainText}
            onSkipExplain={skipExplain}
          />
        )}
        {state.screen === "gameover" && (
          <GameOverScreen state={state} onRestart={restart} />
        )}
        {state.screen === "stats" && <StatsScreen onBack={goToStart} />}
      </div>
      {state.screen === "game" && (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground/60 hidden md:block">
          ⌨ 1-4 select · Enter next · Esc home
        </div>
      )}
    </div>
  );
};

export default Index;
