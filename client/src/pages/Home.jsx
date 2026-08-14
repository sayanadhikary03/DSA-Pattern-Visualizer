import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import CategoryPreview from "../components/landing/CategoryPreview";
import LearningFlow from "../components/landing/LearningFlow";

/**
 * Home
 *
 * Reproduces the editorial "poster" composition from the reference:
 * a saturated indigo outer canvas that frames a large, cream-colored,
 * heavily-rounded central surface holding the entire landing experience.
 */
export default function Home({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${
        isDark ? "theme-dark bg-[#0d0a2c]" : "theme-light bg-[#3d2df5]"
      }`}
    >
      {/* Ambient decorative blobs on the outer purple canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-indigo-500/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/25 blur-3xl"
      />

      {/* Floating outer-canvas glyphs (algorithmic notation) */}
      <OuterCanvasGlyphs />

      {/* The framed cream "poster" that holds the whole landing */}
      <div className="relative z-10 mx-auto max-w-[1480px] px-4 sm:px-8 lg:px-14 py-6 sm:py-10 lg:py-14">
        <div className="poster-shell relative rounded-[28px] sm:rounded-[40px] lg:rounded-[52px] bg-[#FCF9F3] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden border border-black/5">
          <Navbar theme={theme} onToggleTheme={onToggleTheme} />
          <Hero />
          <CategoryPreview />
          <LearningFlow />
          <Footer />
        </div>
      </div>
    </div>
  );
}

/**
 * Subtle floating notation on the outer purple canvas — evokes DSA context
 * without competing with the central composition.
 */
function OuterCanvasGlyphs() {
  const glyphs = [
    {
      text: "O(n²)",
      className: "top-[8%] left-[3%] text-white/25 text-sm tracking-widest",
    },
    {
      text: "{ }",
      className: "top-[22%] right-[4%] text-white/20 text-2xl font-mono",
    },
    {
      text: "BFS",
      className:
        "bottom-[14%] left-[2.5%] text-white/25 text-xs font-space tracking-[0.4em]",
    },
    {
      text: "DFS",
      className:
        "bottom-[9%] left-[2.5%] text-white/20 text-xs font-space tracking-[0.4em]",
    },
    { text: "→", className: "top-[45%] left-[1.5%] text-white/30 text-xl" },
    {
      text: "[ i ]",
      className: "bottom-[28%] right-[3%] text-white/25 text-xs font-mono",
    },
    { text: "✦", className: "top-[12%] right-[10%] text-amber-300/70 text-lg" },
    {
      text: "✦",
      className: "bottom-[6%] right-[14%] text-amber-300/60 text-sm",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {glyphs.map((g, i) => (
        <span key={i} className={`absolute font-bold ${g.className}`}>
          {g.text}
        </span>
      ))}
    </div>
  );
}
