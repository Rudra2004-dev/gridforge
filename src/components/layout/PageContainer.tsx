import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function PageContainer() {
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
        onNavigate={() => setMobileNavOpen(false)} // close the mobile drawer after choosing a page
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

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <ScrollRestoration />
    </div>
  );
}

export default PageContainer;