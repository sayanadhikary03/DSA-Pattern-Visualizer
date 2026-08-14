import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-6 md:px-12 border-b border-[#ebdcb9]/40 bg-[#FCF9F3]">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12">
          <Code size={18} />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-sm md:text-base tracking-wider uppercase text-zinc-900">
            DSA PATTERN
          </span>
          <span className="font-space font-medium text-[10px] tracking-[0.25em] text-zinc-500 uppercase -mt-1">
            VISUALIZER
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        <Link
          to="/patterns"
          className="font-space font-semibold text-xs tracking-widest text-zinc-600 hover:text-zinc-900 uppercase transition-colors"
        >
          Patterns
        </Link>
        <a
          href="#categories"
          className="font-space font-semibold text-xs tracking-widest text-zinc-600 hover:text-zinc-900 uppercase transition-colors"
        >
          Categories
        </a>
        <a
          href="#learning-flow"
          className="font-space font-semibold text-xs tracking-widest text-zinc-600 hover:text-zinc-900 uppercase transition-colors"
        >
          How it works
        </a>
      </div>

      {/* Action CTA */}
      <div>
        <Link
          to="/patterns"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-space font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
        >
          Explore Patterns
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </nav>
  );
}
