import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ComingSoonPage from "./pages/ComingSoonPage";
import EmployeesPage from "./pages/EmployeesPage";
import NotFoundPage from "./pages/NotFoundPage";
import OverviewPage from "./pages/OverviewPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout route: sidebar + header, children render in <Outlet />
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "employees", element: <EmployeesPage /> },
      {
        path: "analytics",
        element: <AnalyticsPage /> },
      {
        path: "settings",
        element: (
          <ComingSoonPage title="Settings" description="Dataset size and display preferences." />
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);