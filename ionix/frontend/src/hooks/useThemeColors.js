import { useEffect } from "react";
import { useThemeStore, themePresets } from "../theme/themeEngine";

export const useThemeColors = () => {
  const { themeName, mode } = useThemeStore();

  useEffect(() => {
    const currentTheme = themePresets[themeName];
    if (!currentTheme) return;

    const colors = currentTheme[mode];

    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [themeName, mode]);
};
