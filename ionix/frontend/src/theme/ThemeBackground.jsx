import React, { useMemo } from "react";
import { useThemeStore } from "./themeEngine";
import "./ThemeBackground.css";

const ThemeBackground = () => {
  const { themeName, mode } = useThemeStore();
  const isDark = mode === "dark";

  // --- 1. COSMOS: Stars (Opacity Reduced) ---
  const cosmosStars = useMemo(() => {
    if (themeName !== "cosmos") return [];
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1 + "px",
      delay: Math.random() * 5 + "s",
      opacity: isDark ? 0.2 : 0.12,
    }));
  }, [themeName, isDark]);

  // --- 2. MIDNIGHT: Shooting Stars ---
  const shootingStars = useMemo(() => {
    if (themeName !== "midnight") return [];
    return [...Array(5)].map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      top: Math.random() * 50 + "%",
      delay: Math.random() * 15 + "s",
    }));
  }, [themeName]);

  // --- 3. OCEANIC: Rays ---
  const lightRays = useMemo(() => {
    if (themeName !== "oceanic") return [];
    return [...Array(4)].map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 5 + 8 + "s",
    }));
  }, [themeName]);

  // === 1. AURORA (Landing-style) ===
  if (themeName === "aurora") {
    return (
      <div
        className={`theme-bg-container animate-fadeBg ${
          isDark ? "bg-[#030014]" : "bg-[#F5F5F7]"
        }`}
      >
        <div className="absolute inset-0 w-full h-full">
          {isDark ? (
            <>
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
              <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </>
          ) : (
            <>
              <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-200/40 blur-[120px] rounded-full mix-blend-multiply" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-200/40 blur-[120px] rounded-full mix-blend-multiply" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </>
          )}
        </div>
      </div>
    );
  }

  // === PREMIUM THEMES (Updated with Background Color) ===

  if (themeName === "cosmos") {
    return (
      <div 
        className="theme-bg-container"
        style={{ backgroundColor: "var(--bg1)" }} // <--- ADD THIS
      >
        {cosmosStars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              "--max-opacity": s.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  if (themeName === "midnight") {
    return (
      <div 
        className="theme-bg-container"
        style={{ backgroundColor: "var(--bg1)" }} // <--- ADD THIS
      >
        {shootingStars.map((s) => (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    );
  }

  if (themeName === "oceanic") {
    return (
      <div 
        className="theme-bg-container"
        style={{ backgroundColor: "var(--bg1)" }} // <--- ADD THIS
      >
        {lightRays.map((r) => (
          <div
            key={r.id}
            className="light-ray"
            style={{
              left: r.left,
              animationDelay: r.delay,
              animationDuration: r.duration,
            }}
          />
        ))}
      </div>
    );
  }

  if (themeName === "nebula") {
    return (
      <div
        className={`theme-bg-container animate-fadeBg ${
          isDark ? "bg-[#0B0014]" : "bg-[#F0F4FF]"
        }`}
      >
        <div
          className={`absolute inset-0 opacity-40 ${
            isDark
              ? "bg-[radial-gradient(circle_at_50%_50%,#2e1065,transparent_70%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,#e0e7ff,transparent_70%)]"
          }`}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="nebula-blob w-[500px] h-[500px] top-[-100px] left-[-100px]"
            style={{
              backgroundColor: isDark ? "#7c3aed" : "#a5b4fc",
              opacity: isDark ? 0.25 : 0.55,
              animationDuration: "42s",
              animationDelay: "0s",
            }}
          />
          <div
            className="nebula-blob w-[600px] h-[600px] bottom-[-120px] right-[-120px]"
            style={{
              backgroundColor: isDark ? "#2563eb" : "#bae6fd",
              opacity: isDark ? 0.22 : 0.55,
              animationDuration: "48s",
              animationDelay: "-6s",
            }}
          />
          <div
            className="nebula-blob w-[420px] h-[420px] top-[38%] left-[38%]"
            style={{
              backgroundColor: isDark ? "#db2777" : "#fbcfe8",
              opacity: isDark ? 0.18 : 0.45,
              animationDuration: "52s",
              animationDelay: "-10s",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
    );
  }

  return null;
};

export default ThemeBackground;