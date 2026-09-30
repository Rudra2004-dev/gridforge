import { useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface PageContainerProps {
  children: ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const layoutClassName = [
    "app-layout",
    sidebarCollapsed ? "app-layout--sidebar-collapsed" : "",
    mobileNavOpen ? "app-layout--nav-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClassName}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />

      {mobileNavOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="content-area">
        <Header onMenuClick={() => setMobileNavOpen((open) => !open)} />

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default PageContainer;
