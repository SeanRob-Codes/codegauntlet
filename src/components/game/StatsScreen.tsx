import { motion } from "framer-motion";
import { useMemo } from "react";
import { getStore, clearAll, type FailureLogItem } from "@/lib/srs";
import { loadScores, clearScores } from "@/lib/leaderboard";
import { getMastery, clearMastery, TOPIC_PREREQS } from "@/lib/prereqs";
import { LANG_COLORS } from "@/data/questions";

interface Props {
  onBack: () => void;
}

export default function StatsScreen({ onBack }: Props) {
  const srs = useMemo(() => getStore(), []);
  const scores = useMemo(() => loadScores(), []);
  const mastery = useMemo(() => getMastery(), []);

  const dueNow = Object.values(srs.entries).filter((e) => e.dueAt <= Date.now()).length;
  const tracked = Object.keys(srs.entries).length;
  const topByLang: Record<string, number> = {};
  for (const f of srs.failureLog) topByLang[f.lang] = (topByLang[f.lang] || 0) + 1;
  const weakTopics = Object.entries(topByLang).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const wipeAll = () => {
    if (!confirm("Wipe all progress (SRS, scores, mastery)? This cannot be undone.")) return;
    clearAll(); clearScores(); clearMastery();
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono font-extrabold text-foreground text-glow-primary">📊 Your Stats</h2>
        <button onClick={onBack}
          className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border text-muted-foreground hover:text-foreground hover:border-primary/50">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card label="In review" value={tracked} />
        <Card label="Due now" value={dueNow} accent />
        <Card label="High score" value={scores[0]?.score ?? 0} />
      </div>

      <Section title="🏆 Leaderboard">
        {scores.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">No scores yet. Finish a Challenge run to record one.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {scores.slice(0, 10).map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono py-1.5 px-2 rounded bg-secondary/40 border border-border">
                <span className="text-muted-foreground">#{i + 1}</span>
                <span className="font-bold text-foreground">{s.score} pts</span>
                <span className="text-muted-foreground">{s.accuracy}% · L{s.level}</span>
                <span className="text-muted-foreground text-[10px]">{new Date(s.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="🔥 Weakest topics">
        {weakTopics.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">No mistakes recorded yet. Get some wrong to see this populate.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {weakTopics.map(([lang, count]) => {
              const c = LANG_COLORS[lang];
              return (
                <span key={lang} className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                  style={{ background: c?.bg, borderColor: c?.border, color: c?.text }}>
                  {lang} <span className="opacity-70">×{count}</span>
                </span>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="🔓 Mastery">
        {Object.keys(mastery).length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">Answer correctly to build mastery and unlock advanced topics.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(mastery).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([lang, n]) => (
              <div key={lang} className="flex justify-between text-xs font-mono py-1 px-2 rounded bg-secondary/40 border border-border">
                <span className="text-foreground">{lang}</span>
                <span className="text-primary font-bold">{n}</span>
              </div>
            ))}
          </div>
        )}
        <details className="mt-3">
          <summary className="text-[10px] font-mono text-muted-foreground cursor-pointer hover:text-foreground">Show topic prerequisites</summary>
          <div className="mt-2 text-[10px] font-mono text-muted-foreground space-y-1">
            {Object.entries(TOPIC_PREREQS).map(([t, p]) => (
              <div key={t}>{t} ← needs 3 correct in: {p.join(", ")}</div>
            ))}
          </div>
        </details>
      </Section>

      <Section title="📓 Failure journal (recent)">
        {srs.failureLog.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">Empty — no wrong answers yet.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
            {srs.failureLog.slice(0, 15).map((f) => <FailureItem key={f.qid + f.date} item={f} />)}
          </div>
        )}
      </Section>

      <button onClick={wipeAll}
        className="mt-6 px-4 py-2 rounded-lg text-xs font-mono text-destructive border border-destructive/30 hover:bg-destructive/10">
        ⚠ Wipe all progress
      </button>
    </motion.div>
  );
}

function Card({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border text-center ${accent ? "bg-warning/10 border-warning/30" : "bg-secondary border-border"}`}>
      <div className={`text-2xl font-mono font-extrabold ${accent ? "text-warning" : "text-foreground"}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

function FailureItem({ item }: { item: FailureLogItem }) {
  return (
    <div className="text-[11px] font-mono p-2 rounded bg-secondary/40 border border-border">
      <div className="flex justify-between mb-1">
        <span className="text-primary font-bold">{item.lang}</span>
        <span className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
      </div>
      <div className="text-foreground mb-1 line-clamp-2">{item.question}</div>
      <div className="text-destructive">✗ {item.userAnswer || "(empty)"}</div>
      <div className="text-primary">✓ {item.correctAnswer}</div>
    </div>
  );
}
