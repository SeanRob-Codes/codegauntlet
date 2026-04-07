import { motion } from "framer-motion";
import { LANGS, LANG_COLORS } from "@/data/questions";

interface StartScreenProps {
  selectedLangs: string[];
  onToggleLang: (lang: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onStart: () => void;
}

export default function StartScreen({
  selectedLangs,
  onToggleLang,
  onSelectAll,
  onSelectNone,
  onStart,
}: StartScreenProps) {
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
        Adaptive coding challenges across 10 topics.
        <br />
        Answer correctly → harder questions. 3 wrong → game over.
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
            return (
              <motion.button
                key={lang}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleLang(lang)}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all duration-150 select-none"
                style={{
                  background: active ? colors.bg : "hsl(var(--secondary))",
                  borderColor: active ? colors.border : "hsl(var(--border))",
                  color: active ? colors.text : "hsl(var(--muted-foreground))",
                  boxShadow: active ? `0 0 12px ${colors.border}40` : "none",
                }}
              >
                {lang}
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        disabled={selectedLangs.length === 0}
        className="mt-8 px-8 py-3 rounded-lg font-mono font-bold text-sm border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed box-glow-primary"
      >
        Start challenge →
      </motion.button>
    </motion.div>
  );
}
