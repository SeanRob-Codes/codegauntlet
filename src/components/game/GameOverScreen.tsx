import { motion } from "framer-motion";
import type { GameState } from "@/hooks/useGameState";

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function GameOverScreen({ state, onRestart }: GameOverScreenProps) {
  const acc = state.total > 0 ? Math.round((state.correctTotal / state.total) * 100) : 0;
  const grade =
    state.score >= 25
      ? "Exceptional!"
      : state.score >= 18
      ? "Strong work!"
      : state.score >= 12
      ? "Good effort!"
      : state.score >= 6
      ? "Keep practicing!"
      : "Just getting started!";

  const reason = state.lives === 0 ? "3 Strikes — Game Over" : "Challenge Complete!";

  const stats = [
    { num: state.total, label: "Questions" },
    { num: `${acc}%`, label: "Accuracy" },
    { num: state.level, label: "Max Level" },
    { num: state.correctTotal, label: "Correct" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-8"
    >
      <p className="text-lg font-mono font-bold text-foreground">{reason}</p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="text-7xl font-mono font-extrabold text-foreground my-4 text-glow-primary"
      >
        {state.score}
      </motion.div>

      <p className="text-xl font-mono font-bold text-primary text-glow-primary mb-2">
        {grade}
      </p>

      <div className="grid grid-cols-2 gap-3 my-6">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="bg-secondary border border-border rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-mono font-extrabold text-foreground">
              {s.num}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mt-1">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
        Tip: Struggling with a topic? Isolate it on the start screen to focus practice.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRestart}
        className="px-8 py-3 rounded-lg font-mono font-bold text-sm border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all box-glow-primary"
      >
        Play again
      </motion.button>
    </motion.div>
  );
}
