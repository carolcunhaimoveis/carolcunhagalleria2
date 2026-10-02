import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const h = document.documentElement;
  h.dataset.theme = theme;
  if (theme === "dark") {
    h.classList.add("dark");
  } else {
    h.classList.remove("dark");
  }
  try {
    localStorage.setItem("galleria-theme", theme);
  } catch (_) {}
}

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem("galleria-theme");
    if (v === "light") return "light";
  } catch (_) {}
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync with whatever the anti-flash script already applied
  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className="theme-toggle"
    >
      {isDark ? (
        <Sun aria-hidden="true" strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden="true" strokeWidth={1.8} />
      )}
    </button>
  );
}
