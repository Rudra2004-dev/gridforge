import {
  BarChart3,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Table2,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: false },
  { label: "Data Grid", icon: Table2, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const;

function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
            <button
              key={item.label}
              type="button"
              className={item.active ? "sidebar-nav-item is-active" : "sidebar-nav-item"}
              aria-current={item.active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
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
