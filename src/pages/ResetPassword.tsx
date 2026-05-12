import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col gap-3">
        <h1 className="text-2xl font-mono font-extrabold text-foreground text-glow-primary">Set a new password</h1>
        <p className="text-xs text-muted-foreground font-mono mb-3">Enter your new password below.</p>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password (8+ chars)"
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:border-primary" />
        <button type="submit" disabled={busy}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
          {busy ? "..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
