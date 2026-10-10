import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import type { RouteHandle } from "./lib/routeHandle";
import AnalyticsPage from "./pages/AnalyticsPage";
import EmployeesPage from "./pages/EmployeesPage";
import NotFoundPage from "./pages/NotFoundPage";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      {
        path: "overview",
        element: <OverviewPage />,
        handle: { heading: "Welcome to the Overview" } satisfies RouteHandle,
      },
      {
        path: "employees",
        element: <EmployeesPage />,
        handle: { heading: "Welcome to the Data Grid" } satisfies RouteHandle,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        handle: { heading: "Welcome to Analytics" } satisfies RouteHandle,
      },
      {
        path: "settings",
        element: <SettingsPage />,
        handle: { heading: "Welcome to Settings" } satisfies RouteHandle,
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: { heading: "Page not found" } satisfies RouteHandle,
      },
    ],
  },
]);