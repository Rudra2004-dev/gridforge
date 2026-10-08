import {
  BarChart3,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Table2,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

const navItems = [
  { label: "Overview", to: "/overview", icon: LayoutDashboard },
  { label: "Data Grid", to: "/employees", icon: Table2 },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">
            <Table2 size={16} />
          </div>
          <div className="sidebar-brand-text">
            <strong>GridForge</strong>
            <span>Workspace</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={onToggle}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <p className="sidebar-section-label">Workspace</p>
      <nav className="sidebar-nav" aria-label="Workspace">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            // NavLink adds aria-current="page" and the isActive flag automatically
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-nav-item is-active" : "sidebar-nav-item"
              }
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-profile" title={collapsed ? "Rudra Prosad, Admin" : undefined}>
        <div className="sidebar-avatar" aria-hidden="true">
          RP
        </div>
        <div className="sidebar-profile-meta">
          <strong>Rudra Prosad</strong>
          <span>Admin</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;