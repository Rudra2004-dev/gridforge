import { Menu } from "lucide-react";
import { useMatches } from "react-router-dom";
import { getRouteHeading } from "../../lib/routeHandle";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  // The last match is the deepest active route (the page)
  const matches = useMatches();
  const heading = getRouteHeading(matches.at(-1)?.handle);

  return (
    <header className="header">
      <button
        type="button"
        className="header-menu"
        aria-label="Open navigation"
        onClick={onMenuClick}
      >
        <Menu size={16} />
      </button>

      {heading && <p className="header-heading">{heading}</p>}

      <div className="header-actions">
        <div className="header-user">
          <div className="user-avatar" aria-hidden="true">
            RP
          </div>
          <div className="header-user-meta">
            <strong>Rudra Prosad</strong>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;