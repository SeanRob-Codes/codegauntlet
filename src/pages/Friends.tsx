import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LANG_COLORS } from "@/data/questions";

interface ProfileLite { id: string; username: string; display_name: string | null; avatar_url: string | null; }
interface ScoreRow { user_id: string; language: string; best_score: number; total_correct: number; total_attempts: number; }
interface Friendship { id: string; requester_id: string; addressee_id: string; status: "pending" | "accepted" | "blocked"; }

export default function Friends() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ProfileLite[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, ProfileLite>>({});
  const [scoresByUser, setScoresByUser] = useState<Record<string, ScoreRow[]>>({});
  const [compareWith, setCompareWith] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) nav("/auth", { replace: true }); }, [loading, user, nav]);

  const loadFriendships = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("friendships").select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    const fs = (data as Friendship[]) || [];
    setFriendships(fs);
    const ids = Array.from(new Set(fs.flatMap((f) => [f.requester_id, f.addressee_id]).filter((id) => id !== user.id)));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id,username,display_name,avatar_url").in("id", ids);
      const map: Record<string, ProfileLite> = {};
      (profs as ProfileLite[] | null)?.forEach((p) => { map[p.id] = p; });
      setProfilesById(map);
      const { data: scores } = await supabase.from("language_scores").select("*").in("user_id", ids);
      const grouped: Record<string, ScoreRow[]> = {};
      (scores as ScoreRow[] | null)?.forEach((s) => { (grouped[s.user_id] ||= []).push(s); });
      setScoresByUser(grouped);
    }
  }, [user]);

  useEffect(() => { loadFriendships(); }, [loadFriendships]);

  // Load my own scores for comparison
  const [myScores, setMyScores] = useState<ScoreRow[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("language_scores").select("*").eq("user_id", user.id)
      .then(({ data }) => setMyScores((data as ScoreRow[]) || []));
  }, [user]);

  const doSearch = async (q: string) => {
    setSearch(q);
    if (q.trim().length < 2) { setResults([]); return; }
    const { data } = await supabase.from("profiles")
      .select("id,username,display_name,avatar_url")
      .ilike("username", `%${q.trim()}%`)
      .neq("id", user!.id)
      .limit(15);
    setResults((data as ProfileLite[]) || []);
  };

  const sendRequest = async (addressee: string) => {
    if (!user) return;
    const { error } = await supabase.from("friendships").insert({ requester_id: user.id, addressee_id: addressee, status: "pending" });
    if (error) return toast.error(error.message);
    toast.success("Request sent");
    loadFriendships();
  };

  const respond = async (fid: string, status: "accepted" | "blocked") => {
    const { error } = await supabase.from("friendships").update({ status }).eq("id", fid);
    if (error) return toast.error(error.message);
    loadFriendships();
  };

  const remove = async (fid: string) => {
    await supabase.from("friendships").delete().eq("id", fid);
    loadFriendships();
  };

  const friendshipFor = (uid: string) =>
    friendships.find((f) => (f.requester_id === uid || f.addressee_id === uid));

  const accepted = friendships.filter((f) => f.status === "accepted");
  const incoming = friendships.filter((f) => f.status === "pending" && f.addressee_id === user?.id);
  const outgoing = friendships.filter((f) => f.status === "pending" && f.requester_id === user?.id);

  const compareUser = compareWith ? profilesById[compareWith] : null;
  const compareScores = compareWith ? (scoresByUser[compareWith] || []) : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background px-3 pt-16 pb-6 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground">← Home</Link>
          <Link to="/profile" className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border hover:border-primary/50">👤 Profile</Link>
        </div>

        <h1 className="text-2xl font-mono font-extrabold text-foreground text-glow-primary mb-1">👥 Friends</h1>
        <p className="text-xs text-muted-foreground font-mono mb-6">Search by username, send requests, and compare proficiency.</p>

        <input
          value={search}
          onChange={(e) => doSearch(e.target.value)}
          placeholder="🔍 Search username (min 2 chars)..."
          className="w-full mb-3 px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary"
        />

        {results.length > 0 && (
          <div className="mb-6 flex flex-col gap-1.5">
            {results.map((p) => {
              const fs = friendshipFor(p.id);
              const label = !fs ? "Add" : fs.status === "accepted" ? "✓ Friends" : fs.status === "pending" ? (fs.requester_id === user!.id ? "Pending…" : "Respond") : "Blocked";
              return (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border">
                  <UserChip p={p} />
                  <button
                    disabled={!!fs && fs.status !== "pending"}
                    onClick={() => fs ? null : sendRequest(p.id)}
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {incoming.length > 0 && (
          <Section title="📨 Incoming requests">
            {incoming.map((f) => {
              const p = profilesById[f.requester_id];
              if (!p) return null;
              return (
                <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg bg-warning/10 border border-warning/30">
                  <UserChip p={p} />
                  <div className="flex gap-2">
                    <button onClick={() => respond(f.id, "accepted")} className="text-xs font-mono px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Accept</button>
                    <button onClick={() => remove(f.id)} className="text-xs font-mono px-3 py-1.5 rounded-md border border-border hover:border-destructive/50 text-muted-foreground">Decline</button>
                  </div>
                </div>
              );
            })}
          </Section>
        )}

        {outgoing.length > 0 && (
          <Section title="⏳ Sent">
            {outgoing.map((f) => {
              const p = profilesById[f.addressee_id];
              if (!p) return null;
              return (
                <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border">
                  <UserChip p={p} />
                  <button onClick={() => remove(f.id)} className="text-xs font-mono px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground">Cancel</button>
                </div>
              );
            })}
          </Section>
        )}

        <Section title={`✨ Friends (${accepted.length})`}>
          {accepted.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono">No friends yet — search above to find people.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {accepted.map((f) => {
                const otherId = f.requester_id === user!.id ? f.addressee_id : f.requester_id;
                const p = profilesById[otherId];
                if (!p) return null;
                return (
                  <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border">
                    <UserChip p={p} />
                    <div className="flex gap-2">
                      <button onClick={() => setCompareWith(otherId === compareWith ? null : otherId)}
                        className="text-xs font-mono px-3 py-1.5 rounded-md bg-primary/10 border border-primary text-primary hover:bg-primary/20">
                        {compareWith === otherId ? "Hide" : "📊 Compare"}
                      </button>
                      <button onClick={() => remove(f.id)} className="text-xs font-mono px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {compareUser && (
          <Section title={`⚔ You vs @${compareUser.username}`}>
            <CompareTable mine={myScores} theirs={compareScores} myName="You" theirName={`@${compareUser.username}`} />
          </Section>
        )}
      </div>
    </div>
  );
}

function UserChip({ p }: { p: ProfileLite }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center">
        {p.avatar_url
          ? <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.username} />
          : <span className="text-xs font-mono font-bold text-primary">{p.username[0]?.toUpperCase()}</span>}
      </div>
      <div>
        <div className="text-sm font-mono font-bold text-foreground">@{p.username}</div>
        {p.display_name && <div className="text-[10px] font-mono text-muted-foreground">{p.display_name}</div>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}

function CompareTable({ mine, theirs, myName, theirName }: { mine: ScoreRow[]; theirs: ScoreRow[]; myName: string; theirName: string }) {
  const langs = Array.from(new Set([...mine.map((s) => s.language), ...theirs.map((s) => s.language)])).sort();
  if (langs.length === 0) return <p className="text-xs text-muted-foreground font-mono">Neither of you have scores yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2">Language</th>
            <th className="text-right py-2">{myName}</th>
            <th className="text-right py-2">{theirName}</th>
            <th className="text-right py-2">Lead</th>
          </tr>
        </thead>
        <tbody>
          {langs.map((lang) => {
            const m = mine.find((s) => s.language === lang);
            const t = theirs.find((s) => s.language === lang);
            const ms = m?.best_score || 0;
            const ts = t?.best_score || 0;
            const diff = ms - ts;
            const c = LANG_COLORS[lang];
            return (
              <tr key={lang} className="border-b border-border/50">
                <td className="py-2"><span className="px-2 py-0.5 rounded font-bold" style={{ background: c?.bg, color: c?.text }}>{lang}</span></td>
                <td className={`text-right ${diff > 0 ? "text-primary font-bold" : "text-foreground"}`}>{ms}</td>
                <td className={`text-right ${diff < 0 ? "text-primary font-bold" : "text-foreground"}`}>{ts}</td>
                <td className={`text-right ${diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {diff > 0 ? `+${diff}` : diff}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
