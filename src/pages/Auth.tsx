import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/coderush-logo.png";

type Tab = "signin" | "signup" | "forgot";

export default function Auth() {
  const nav = useNavigate();
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) nav("/", { replace: true });
  }, [session, loading, nav]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav("/", { replace: true });
  };

  const signUp = async () => {
    if (username.trim().length < 3) return toast.error("Username must be at least 3 characters");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're signed in!");
    nav("/", { replace: true });
  };

  const forgot = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Reset link sent — check your email.");
    setTab("signin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 gap-5 sm:gap-6">
      <img
        src={logo}
        alt="CodeRush — Think fast. Code faster."
        className="w-48 sm:w-64 md:w-80 h-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)] select-none"
        draggable={false}
      />
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-mono font-extrabold text-foreground text-glow-primary mb-1">
          {tab === "signin" ? "Sign in" : tab === "signup" ? "Create account" : "Reset password"}
        </h1>
        <p className="text-xs text-muted-foreground font-mono mb-6">
          Track scores, find friends, compare proficiency.
        </p>

        <div className="flex gap-2 mb-6 text-xs font-mono">
          <TabBtn active={tab === "signin"} onClick={() => setTab("signin")}>Sign in</TabBtn>
          <TabBtn active={tab === "signup"} onClick={() => setTab("signup")}>Sign up</TabBtn>
          <TabBtn active={tab === "forgot"} onClick={() => setTab("forgot")}>Forgot</TabBtn>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); tab === "signin" ? signIn() : tab === "signup" ? signUp() : forgot(); }}
          className="flex flex-col gap-3">
          {tab === "signup" && (
            <Field label="Username" type="text" value={username} onChange={setUsername} placeholder="e.g. sr28" />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          {tab !== "forgot" && (
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          )}
          <button type="submit" disabled={busy}
            className="mt-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
            {busy ? "..." : tab === "signin" ? "Sign in" : tab === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 px-3 py-1.5 rounded-md border ${active ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary" />
    </label>
  );
}
