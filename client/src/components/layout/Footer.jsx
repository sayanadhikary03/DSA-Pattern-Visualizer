import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 md:px-12 border-t border-[#ebdcb9]/40 bg-[#FCF9F3] text-[10px] md:text-xs font-space font-semibold tracking-wider text-zinc-500 uppercase flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left side */}
      <div className="flex gap-4 md:gap-6 order-2 md:order-1">
        <a href="#privacy" className="hover:text-zinc-950 transition-colors">Legals</a>
        <a href="#privacy" className="hover:text-zinc-950 transition-colors">Privacy</a>
        <a href="#privacy" className="hover:text-zinc-950 transition-colors">Cookies</a>
      </div>

      {/* Middle side */}
      <div className="hidden lg:flex items-center gap-3 text-[10px] tracking-widest text-zinc-400 order-2">
        <span className="hover:text-zinc-700 transition-colors">Arrays</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">Sorting</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">Linked List</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">Stack</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">Trees</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">Graph</span>
        <span>|</span>
        <span className="hover:text-zinc-700 transition-colors">DP</span>
      </div>

      {/* Right side */}
      <div className="order-1 md:order-3">
        <span>© {new Date().getFullYear()} DSA PATTERN VISUALIZER</span>
      </div>
    </footer>
  );
}
