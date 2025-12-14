import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useThemeStore } from "../theme/themeEngine";
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  StickyNote,
  Calendar,
  FileText,
  Activity,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

const routeMeta = {
  "/dashboard": { label: "Dashboard", icon: LayoutDashboard, color: "#3b82f6" },
  "/chat": { label: "AI Chat", icon: MessageSquare, color: "#8b5cf6" },
  "/tasks": { label: "Tasks", icon: CheckSquare, color: "#10b981" },
  "/notes": { label: "Notes", icon: StickyNote, color: "#f59e0b" },
  "/planner": { label: "Planner", icon: Calendar, color: "#06b6d4" },
  "/pdf-tools": { label: "PDF Tools", icon: FileText, color: "#f43f5e" },
  "/analytics": { label: "Analytics", icon: Activity, color: "#f97316" },
  "/settings": { label: "Settings", icon: SettingsIcon, color: "#64748b" },
};

export default function AppLayout({ children, onLogout }) {
  const location = useLocation();
  const { themeName } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const path =
    Object.keys(routeMeta).find((p) =>
      location.pathname.startsWith(p)
    ) || "/dashboard";

  const meta = routeMeta[path] || {
    label: "Dashboard",
    icon: Sparkles,
    color: "#6366f1",
  };

  const Icon = meta.icon;

  const raw = localStorage.getItem("userInfo");
  const user = raw ? JSON.parse(raw) : null;

  return (
    <div className="relative z-10 flex h-screen w-full overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <div
          className="h-20 px-6 flex items-center justify-between border-b"
          style={{
            background: "var(--nav)",
            borderColor: "var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${meta.color}, ${meta.color}55)`,
              }}
            >
              <Icon size={20} color="white" />
            </div>

            <div>
              <div className="font-semibold">{meta.label}</div>
              <div className="text-xs text-[var(--subtext)]">
                {themeName} theme
              </div>
            </div>
          </div>

          {user && (
            <img
              src={user.pic}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>

        {/* CONTENT */}
        <main className="relative z-10 flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
