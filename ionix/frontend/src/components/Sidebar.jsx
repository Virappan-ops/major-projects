import React from "react";
import { NavLink } from "react-router-dom";
import { useThemeStore } from "../theme/themeEngine"; // NAYA IMPORT
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  StickyNote,
  Calendar,
  FileText,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import "./Sidebar.css";

const routes = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#3b82f6" },
  { path: "/chat", label: "AI Chat", icon: MessageSquare, color: "#8b5cf6" },
  { path: "/tasks", label: "Tasks", icon: CheckSquare, color: "#10b981" },
  { path: "/notes", label: "Notes", icon: StickyNote, color: "#f59e0b" },
  { path: "/planner", label: "Planner", icon: Calendar, color: "#06b6d4" },
  { path: "/pdf-tools", label: "PDF Tools", icon: FileText, color: "#f43f5e" },
  { path: "/analytics", label: "Analytics", icon: Activity, color: "#f97316" },
  { path: "/settings", label: "Settings", icon: Settings, color: "#64748b" },
];

// PROPS CLEANUP: 'theme' aur 'toggleTheme' ki zaroorat nahi, store use karenge
export default function Sidebar({ isOpen, setIsOpen, onLogout }) {
  
  // Connect to Global Theme Store
  const { mode, setMode } = useThemeStore();

  const handleToggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <aside className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      
      {/* Collapse Button */}
      <button 
        className="toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Area */}
      <div className="logo-container">
        <div className="logo-box">
          <Sparkles size={24} className="text-white" />
        </div>
        {isOpen && (
            <span className="app-name bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Ionix
            </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="nav-list custom-scrollbar">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : "inactive"}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="icon-box"
                  style={{
                    background: isActive ? `linear-gradient(135deg, ${route.color}, ${adjustColor(route.color, -20)})` : "",
                  }}
                >
                  <route.icon
                    size={20}
                    // Inactive state uses CSS variable for theme adaptability
                    color={isActive ? "white" : route.color} 
                    className={!isActive ? "opacity-80" : ""}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                
                <span className="label">{route.label}</span>
                
                {isActive && (
                  <div
                    className="active-glow-bar"
                    style={{ background: route.color, boxShadow: `-2px 0 10px ${route.color}` }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions (Theme + Logout) */}
      <div className="sidebar-footer">
        
        {/* Theme Toggle Button */}
        <button
          onClick={handleToggleTheme}
          className="sidebar-item inactive group w-full"
        >
          <div className="icon-box group-hover:bg-[var(--bg3)] transition-colors">
            {mode === "dark" ? (
              <Moon size={20} className="text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            ) : (
              <Sun size={20} className="text-yellow-500 group-hover:text-yellow-600 transition-colors" />
            )}
          </div>
          {isOpen && (
            <span className="label group-hover:text-[var(--text)] transition-colors">
              {mode === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="sidebar-item inactive group w-full"
        >
          <div className="icon-box group-hover:bg-red-500/10 transition-colors">
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          </div>
          {isOpen && (
            <span className="label group-hover:text-red-500 transition-colors">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}

// Helper for Gradient
function adjustColor(color, amount) {
  if (!color) return "#000";
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}