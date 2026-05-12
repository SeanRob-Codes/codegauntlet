import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LANG_COLORS } from "@/data/questions";

interface ScoreRow { language: string; best_score: number; total_correct: number; total_attempts: number; }

export default function Profile() {
  const nav = useNavigate();
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) nav("/auth", { replace: true });
  }, [loading, user, nav]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from("language_scores").select("*").eq("user_id", user.id)
      .then(({ data }) => setScores((data as ScoreRow[]) || []));
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Profile saved");
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Max 2MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updErr } = await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", user.id);
    setUploading(false);
    if (updErr) return toast.error(updErr.message);
    await refreshProfile();
    toast.success("Avatar updated");
  };

  if (loading || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground font-mono">Loading…</div>;
  }

  const sortedScores = [...scores].sort((a, b) => b.best_score - a.best_score);

  return (
    <div className="min-h-screen bg-background px-3 pt-16 pb-6 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground">← Home</Link>
          <div className="flex gap-2">
            <Link to="/friends" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border hover:border-primary/50">👥 Friends</Link>
            <button onClick={signOut} className="text-xs font-mono px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10">Sign out</button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-secondary flex items-center justify-center">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                : <span className="text-2xl font-mono font-bold text-primary">{profile.username[0]?.toUpperCase()}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] font-mono rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {uploading ? "…" : "edit"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
          </div>
          <div>
            <div className="font-mono font-extrabold text-foreground text-xl">@{profile.username}</div>
            <div className="text-xs text-muted-foreground font-mono">{user?.email}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Field label="Display name" value={displayName} onChange={setDisplayName} />
          <Field label="Bio" value={bio} onChange={setBio} textarea />
          <button onClick={save} disabled={saving}
            className="self-start px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 disabled:opacity-50">
            {saving ? "…" : "Save profile"}
          </button>
        </div>

        <h2 className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-3">🏅 Proficiency by language</h2>
        {sortedScores.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">Play a few rounds — your per-language scores will appear here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sortedScores.map((s) => {
              const c = LANG_COLORS[s.language];
              const acc = s.total_attempts > 0 ? Math.round((s.total_correct / s.total_attempts) * 100) : 0;
              return (
                <div key={s.language} className="flex items-center justify-between p-3 rounded-lg border" style={{ background: c?.bg, borderColor: c?.border }}>
                  <span className="font-mono font-bold text-sm" style={{ color: c?.text }}>{s.language}</span>
                  <div className="text-right text-xs font-mono">
                    <div className="text-foreground font-bold">{s.best_score} pts</div>
                    <div className="text-muted-foreground">{acc}% · {s.total_correct}/{s.total_attempts}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{label}</span>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary" />
        : <input value={value} onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary" />}
    </label>
  );
}
