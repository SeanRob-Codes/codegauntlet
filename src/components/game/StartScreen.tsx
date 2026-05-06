import { motion } from "framer-motion";
import { LANGS, LANG_COLORS } from "@/data/questions";
import type { GameMode } from "@/hooks/useGameState";
import { isLocked } from "@/lib/prereqs";
import { getTopScore } from "@/lib/leaderboard";

interface StartScreenProps {
  selectedLangs: string[];
  mode: GameMode;
  onToggleLang: (lang: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onSetMode: (mode: GameMode) => void;
  onStart: () => void;
  onStats: () => void;
}

export default function StartScreen({
  selectedLangs,
  mode,
  onToggleLang,
  onSelectAll,
  onSelectNone,
  onSetMode,
  onStart,
  onStats,
}: StartScreenProps) {
  const topScore = getTopScore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <h1 className="text-3xl md:text-4xl font-mono font-extrabold text-foreground tracking-tight text-glow-primary">
        Dev Skills Gauntlet
      </h1>
      <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto leading-relaxed">
        Adaptive coding challenges across 40+ topics.
        <br />
        Answer correctly → harder questions. Beat the timer for bonus points.
      </p>

      {/* Mode selector */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => onSetMode("challenge")}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
            mode === "challenge"
              ? "bg-primary/15 border-primary/50 text-primary box-glow-primary"
              : "bg-secondary border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          ⚔ Challenge Mode
        </button>
        <button
          onClick={() => onSetMode("practice")}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
            mode === "practice"
              ? "bg-accent/15 border-accent/50 text-accent-foreground box-glow-accent"
              : "bg-secondary border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          📖 Practice Mode
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 font-mono">
        {mode === "challenge"
          ? "3 lives · Timer · Bonus points for speed · Earn lives back"
          : "No lives · No timer · Retry wrong answers · Focus on learning"}
      </p>

      <div className="text-left mt-8">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-3">
          Select topics
        </p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={onSelectAll}
            className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1 hover:text-foreground hover:border-primary/50 transition-colors font-mono"
          >
            All
          </button>
          <button
            onClick={onSelectNone}
            className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1 hover:text-foreground hover:border-destructive/50 transition-colors font-mono"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((lang) => {
            const active = selectedLangs.includes(lang);
            const colors = LANG_COLORS[lang];
            const lock = isLocked(lang);
            return (
              <motion.button
                key={lang}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleLang(lang)}
                title={lock.locked ? `🔒 Unlocks after 3 correct in: ${lock.missing.map(m => `${m.topic} (${m.have}/${m.need})`).join(", ")}` : undefined}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all duration-150 select-none"
                style={{
                  background: active ? colors.bg : "hsl(var(--secondary))",
                  borderColor: active ? colors.border : "hsl(var(--border))",
                  color: active ? colors.text : "hsl(var(--muted-foreground))",
                  boxShadow: active ? `0 0 12px ${colors.border}40` : "none",
                  opacity: lock.locked ? 0.55 : 1,
                }}
              >
                {lock.locked && "🔒 "}{lang}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 items-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          disabled={selectedLangs.length === 0}
          className="px-8 py-3 rounded-lg font-mono font-bold text-sm border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed box-glow-primary"
        >
          {mode === "challenge" ? "Start challenge →" : "Start practice →"}
        </motion.button>
        <button onClick={onStats}
          className="px-4 py-3 rounded-lg font-mono font-bold text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
          📊 Stats
        </button>
      </div>
      {topScore > 0 && (
        <p className="text-[10px] font-mono text-muted-foreground mt-3">🏆 Top score: <span className="text-warning font-bold">{topScore}</span></p>
      )}
    </motion.div>
  );
}
