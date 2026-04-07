import { useGameState } from "@/hooks/useGameState";
import StartScreen from "@/components/game/StartScreen";
import GameScreen from "@/components/game/GameScreen";
import GameOverScreen from "@/components/game/GameOverScreen";

const Index = () => {
  const {
    state,
    toggleLang,
    selectAll,
    selectNone,
    startGame,
    answerQuestion,
    answerTyped,
    setTypedAnswer,
    nextQuestion,
    restart,
  } = useGameState();

  return (
    <div className="min-h-screen bg-background flex justify-center items-start p-4 md:p-8">
      <div className="w-full max-w-[680px] bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
        {state.screen === "start" && (
          <StartScreen
            selectedLangs={state.selectedLangs}
            onToggleLang={toggleLang}
            onSelectAll={selectAll}
            onSelectNone={selectNone}
            onStart={startGame}
          />
        )}
        {state.screen === "game" && (
          <GameScreen
            state={state}
            onAnswer={answerQuestion}
            onAnswerTyped={answerTyped}
            onTypedChange={setTypedAnswer}
            onNext={nextQuestion}
          />
        )}
        {state.screen === "gameover" && (
          <GameOverScreen state={state} onRestart={restart} />
        )}
      </div>
    </div>
  );
};

export default Index;
