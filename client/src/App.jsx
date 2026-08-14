import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("dsa-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("dsa-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home theme={theme} onToggleTheme={toggleTheme} />}
        />
        {/* Patterns page is intentionally deferred — the CTA links here
            so routing is ready when the visualizer itself is built. */}
        <Route
          path="/patterns"
          element={<Home theme={theme} onToggleTheme={toggleTheme} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
