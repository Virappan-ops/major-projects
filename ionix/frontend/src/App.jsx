import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useThemeColors } from "./hooks/useThemeColors";

// Background
import ThemeBackground from "./theme/ThemeBackground";

// Layout
import AppLayout from "./layouts/AppLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardHome from "./pages/DashboardHome";
import AiChat from "./pages/AiChat";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Planner from "./pages/Planner";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PdfTools from "./pages/PdfTools";
import Subscription from "./pages/Subscription";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  useThemeColors();

  // restore login
  /* useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) setUser(JSON.parse(saved));
  }, []);
  */
  // PUBLIC
  if (!user) {
    return (
      <>
        <ThemeBackground />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              <AuthPage
                onLogin={() =>
                  setUser(JSON.parse(localStorage.getItem("userInfo")))
                }
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );
  }

  // PROTECTED
  return (
    <>
      <ThemeBackground />

      <AppLayout
        onLogout={() => {
          localStorage.removeItem("userInfo");
          setUser(null);
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/chat" element={<AiChat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/pdf-tools" element={<PdfTools />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AppLayout>
    </>
  );
}
