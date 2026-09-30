import { Bell, Menu, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
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

      <label className="header-search">
        <Search size={15} />
        <input type="search" placeholder="Search workspace" />
      </label>

      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={16} />
        </button>

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
