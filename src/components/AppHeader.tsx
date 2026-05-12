import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/coderush-logo.png";

export default function AppHeader() {
  const { user, profile } = useAuth();
  if (!user) return null;
  return (
    <div className="fixed top-2 right-2 sm:top-3 sm:right-3 z-50 flex items-center gap-1.5 sm:gap-2 text-xs font-mono max-w-[calc(100vw-1rem)]">
      <Link to="/" className="flex items-center shrink-0" title="CodeRush home">
        <img
          src={logo}
          alt="CodeRush"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover drop-shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
        />
      </Link>
      <Link
        to="/friends"
        title="Friends"
        className="px-2 py-1.5 sm:px-3 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
      >
        <span className="sm:hidden">👥</span>
        <span className="hidden sm:inline">👥 Friends</span>
      </Link>
      {profile && (
        <Link
          to="/profile"
          title={`@${profile.username}`}
          className="flex items-center gap-2 px-1.5 py-1 sm:px-2 rounded-lg bg-card border border-border hover:border-primary/50 min-w-0"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.username} />
              : <span className="text-[10px] font-bold text-primary">{profile.username[0]?.toUpperCase()}</span>}
          </div>
          <span className="hidden sm:inline text-foreground font-bold truncate max-w-[120px]">@{profile.username}</span>
        </Link>
      )}
    </div>
  );
}
