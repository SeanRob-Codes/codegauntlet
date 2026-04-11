import { motion } from "framer-motion";

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  isPractice: boolean;
}

export default function TimerBar({ timeLeft, totalTime, isPractice }: TimerBarProps) {
  if (isPractice) return null;

  const pct = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && !isUrgent;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-colors duration-300"
          style={{
            background: isUrgent
              ? "hsl(var(--destructive))"
              : isWarning
              ? "hsl(var(--warning))"
              : "hsl(var(--primary))",
          }}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span
        className={`text-xs font-mono font-bold min-w-[2.5rem] text-right ${
          isUrgent
            ? "text-destructive animate-pulse"
            : isWarning
            ? "text-warning"
            : "text-muted-foreground"
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
