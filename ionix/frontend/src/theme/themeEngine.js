// src/theme/themeEngine.js
import { create } from "zustand";

export const themePresets = {
  // --- 1. AURORA (UPDATED: Matches Landing Page) ---
  aurora: {
    name: "Aurora",
    light: {
      bg1: "#F5F5F7",         // Exact Landing Page Light BG
      nav: "rgba(255, 255, 255, 0.7)", // Glassy Sidebar
      bg2: "#ffffff",         // Cards
      bg3: "#e2e8f0",         // Hover
      card: "rgba(255, 255, 255, 0.6)", // Glassy Cards
      border: "rgba(0, 0, 0, 0.06)",
      text: "#0f172a",        // Slate 900
      subtext: "#64748b",
    },
    dark: {
      bg1: "#030014",         // Exact Landing Page Dark BG (Deep Space)
      nav: "rgba(3, 0, 20, 0.5)",      // Glassy Sidebar Dark
      bg2: "#0f0f1a",         // Component BG
      bg3: "#1a1a2e",         // Hover
      card: "rgba(255, 255, 255, 0.03)", // Glassy Cards
      border: "rgba(255, 255, 255, 0.08)",
      text: "#ffffff",
      subtext: "#94a3b8",
    },
  },

  // --- 2. OCEANIC (Premium - Unchanged) ---
  oceanic: {
    name: "Oceanic",
    light: {
      bg1: "#ecfeff",
      nav: "#cffafe",
      bg2: "#cffafe",
      bg3: "#e0f2fe",
      card: "rgba(255, 255, 255, 0.9)",
      border: "rgba(14, 165, 233, 0.15)",
      text: "#0c4a6e",
      subtext: "#0369a1",
    },
    dark: {
      bg1: "#082f49",
      nav: "#021829",
      bg2: "#0c4a6e",
      bg3: "#075985",
      card: "rgba(255, 255, 255, 0.08)",
      border: "rgba(56, 189, 248, 0.15)",
      text: "#f0f9ff",
      subtext: "rgba(186, 230, 253, 0.7)",
    },
  },

  // --- 3. NEBULA (Deep Cosmic / Fluid) ---
  nebula: {
    name: "Nebula",
    light: {
      bg1: "#F0F4FF",         // Cool Alice Blue
      nav: "rgba(255, 255, 255, 0.6)",
      bg2: "#FFFFFF",
      bg3: "#E0E7FF",
      card: "rgba(255, 255, 255, 0.7)",
      border: "rgba(99, 102, 241, 0.15)",
      text: "#1e1b4b",
      subtext: "#4338ca",
    },
    dark: {
      bg1: "#0B0014",
      nav: "rgba(20, 0, 40, 0.5)",
      bg2: "#170f2b",
      bg3: "#2e1065",
      card: "rgba(255, 255, 255, 0.04)",
      border: "rgba(139, 92, 246, 0.2)",
      text: "#ede9fe",
      subtext: "#a78bfa",
    },
  },

  // --- 4. MIDNIGHT (Premium - Unchanged) ---
  midnight: {
    name: "Midnight",
    light: {
      bg1: "#e9eef9",
      nav: "#dbeafe",
      bg2: "#e7eefb",
      bg3: "#f7fbff",
      card: "rgba(255,255,255,0.92)",
      border: "rgba(0,0,0,0.06)",
      text: "#0b0b12",
      subtext: "#4b4b63",
    },
    dark: {
      bg1: "#0a0f1f",
      nav: "#000000",
      bg2: "#00172d",
      bg3: "#001f3f",
      card: "rgba(0,0,0,0.45)",
      border: "rgba(255,255,255,0.08)",
      text: "#ffffff",
      subtext: "rgba(220,220,220,0.6)",
    },
  },

  // --- 5. COSMOS (Premium - Unchanged) ---
  cosmos: {
    name: "Cosmos",
    light: {
      bg1: "#eff6ff",
      nav: "#dbeafe",
      bg2: "#dbeafe",
      bg3: "#bfdbfe",
      card: "rgba(255, 255, 255, 0.9)",
      border: "rgba(59, 130, 246, 0.15)",
      text: "#172554",
      subtext: "#1e3a8a",
    },
    dark: {
      bg1: "#020617",
      nav: "#000000",
      bg2: "#0f172a",
      bg3: "#172554",
      card: "rgba(255, 255, 255, 0.05)",
      border: "rgba(96, 165, 250, 0.1)",
      text: "#f8fafc",
      subtext: "rgba(148, 163, 184, 0.7)",
    },
  },
};

const KEY_THEME_NAME = "ionix-theme-name";
const KEY_THEME_MODE = "ionix-theme-mode";

const savedTheme = localStorage.getItem(KEY_THEME_NAME) || "aurora";
const savedMode = localStorage.getItem(KEY_THEME_MODE) || "dark";

export const useThemeStore = create((set) => ({
  themeName: savedTheme,
  mode: savedMode,

  setThemeName: (t) => {
    localStorage.setItem(KEY_THEME_NAME, t);
    set({ themeName: t });
  },

  setMode: (m) => {
    localStorage.setItem(KEY_THEME_MODE, m);
    set({ mode: m });
  },
}));
