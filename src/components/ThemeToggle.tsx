
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-blue-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
