import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import EmployeesPage from "./pages/EmployeesPage";
import NotFoundPage from "./pages/NotFoundPage";
import OverviewPage from "./pages/OverviewPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout route: sidebar + header, children render in <Outlet />
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element:  <SettingsPage />   
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);