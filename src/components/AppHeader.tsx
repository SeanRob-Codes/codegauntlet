import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/coderush-logo.png";

export default function AppHeader() {
  const { user, profile } = useAuth();
  if (!user) return null;
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 text-xs font-mono">
      <Link to="/" className="flex items-center" title="CodeRush home">
        <img
          src={logo}
          alt="CodeRush"
          className="h-10 w-10 rounded-md object-cover drop-shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
        />
      </Link>
      <Link to="/friends" className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground">
        👥 Friends
      </Link>
      {profile && (
        <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card border border-border hover:border-primary/50">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center">
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.username} />
              : <span className="text-[10px] font-bold text-primary">{profile.username[0]?.toUpperCase()}</span>}
          </div>
          <span className="text-foreground font-bold">@{profile.username}</span>
        </Link>
      )}
    </div>
  );
}
