import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Moon, Sun, Menu, X } from "lucide-react";
import brandIcon from "../../assets/websute icon.jpeg";

export default function Navbar({ theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // =========================================================
  // MOBILE MENU ANIMATION
  // =========================================================

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },

    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },

    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      y: -12,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-[100]

        w-full

        py-5
        md:py-6

        px-5
        md:px-12

        border-b
        border-[#ebdcb9]/40

        /* KEEP NAVBAR CREAM IN BOTH THEMES */
        bg-[#FCF9F3]

        transition-shadow
        duration-300
      "
    >
      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <div className="md:hidden">
        {/* ---------------------------------------------------
            MOBILE TOP BAR
        ---------------------------------------------------- */}

        <div className="w-full flex items-center justify-between gap-3">
          {/* Brand */}

          <Link
            to="/"
            onClick={closeMenu}
            className="
              flex
              items-center
              gap-2
              group
              min-w-0
            "
          >
            {/* Logo Icon */}

            <div
              className="
                w-9
                h-9
                shrink-0
                overflow-hidden

                rounded-lg

                border
                border-zinc-200

                bg-zinc-900

                transition-all
                duration-300

                group-hover:rotate-6
              "
            >
              <img
                src={brandIcon}
                alt="AlgoTrace icon"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Logo Text */}

            <div className="flex flex-col min-w-0">
              <span
                className="
                  font-display
                  font-extrabold

                  text-base

                  tracking-normal

                  text-zinc-900

                  leading-none
                "
              >
                <span className="text-zinc-900">Algo</span>
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Trace
                </span>
              </span>

              <span
                className="
                  font-space
                  font-semibold

                  text-[10px]

                  tracking-[0.08em]

                  text-zinc-500

                  mt-0.5

                  leading-none
                "
              >
                DSA Pattern Visualizer
              </span>
            </div>
          </Link>

          {/* Right-side controls */}

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}

            <button
              type="button"
              onClick={onToggleTheme}
              className="
                theme-toggle

                w-10
                h-10

                rounded-full

                border
                border-zinc-200

                bg-white

                flex
                items-center
                justify-center

                transition-all
                duration-300

                hover:-translate-y-0.5
              "
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <Sun size={16} className="text-amber-300" />
              ) : (
                <Moon size={16} className="text-indigo-700" />
              )}
            </button>

            {/* Hamburger */}

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="
                w-10
                h-10

                rounded-xl

                bg-zinc-900

                text-white

                flex
                items-center
                justify-center

                transition-all
                duration-300

                hover:-translate-y-0.5
              "
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.span
                    key="close-icon"
                    initial={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.7,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <X size={19} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu-icon"
                    initial={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.7,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <Menu size={19} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ===================================================
            MOBILE MENU
        ==================================================== */}

        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                overflow-hidden

                border-t
                border-[#ebdcb9]/40

                mt-4
                pt-2

                bg-[#FCF9F3]
              "
            >
              <div className="w-full flex flex-col">
                {/* PATTERNS */}

                <motion.div variants={menuItemVariants}>
                  <Link
                    to="/patterns"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-between

                      py-4

                      border-b
                      border-[#ebdcb9]/40

                      font-space
                      font-bold

                      text-sm

                      tracking-[0.12em]

                      uppercase

                      text-zinc-800

                      transition-colors
                      duration-300

                      hover:text-indigo-600
                    "
                  >
                    <span>Patterns</span>

                    <ArrowRight size={16} />
                  </Link>
                </motion.div>

                {/* CATEGORIES */}

                <motion.div variants={menuItemVariants}>
                  <a
                    href="#categories"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-between

                      py-4

                      border-b
                      border-[#ebdcb9]/40

                      font-space
                      font-bold

                      text-sm

                      tracking-[0.12em]

                      uppercase

                      text-zinc-800

                      transition-colors
                      duration-300

                      hover:text-indigo-600
                    "
                  >
                    <span>Categories</span>

                    <ArrowRight size={16} />
                  </a>
                </motion.div>

                {/* HOW IT WORKS */}

                <motion.div variants={menuItemVariants}>
                  <a
                    href="#learning-flow"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-between

                      py-4

                      border-b
                      border-[#ebdcb9]/40

                      font-space
                      font-bold

                      text-sm

                      tracking-[0.12em]

                      uppercase

                      text-zinc-800

                      transition-colors
                      duration-300

                      hover:text-indigo-600
                    "
                  >
                    <span>How It Works</span>

                    <ArrowRight size={16} />
                  </a>
                </motion.div>

                {/* EXPLORE */}

                <motion.div variants={menuItemVariants} className="pt-5 pb-2">
                  <Link
                    to="/patterns"
                    onClick={closeMenu}
                    className="
                      w-full

                      inline-flex
                      items-center
                      justify-center
                      gap-3

                      px-6
                      py-4

                      rounded-xl

                      bg-zinc-900

                      text-white

                      font-space
                      font-bold

                      text-xs

                      tracking-widest

                      uppercase

                      shadow-[4px_4px_0px_rgba(99,102,241,0.4)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                    "
                  >
                    Explore Patterns
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}

      <div
        className="
          hidden
          md:flex

          w-full

          items-center
          justify-between
        "
      >
        {/* Brand */}

        <Link
          to="/"
          className="
            flex
            items-center
            gap-2.5
            group
          "
        >
          <div
            className="
              w-9
              h-9
              overflow-hidden

              rounded-lg

              border
              border-zinc-200

              bg-zinc-900

              transition-transform
              duration-300

              group-hover:rotate-12
            "
          >
            <img
              src={brandIcon}
              alt="AlgoTrace icon"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col">
            <span
              className="
                font-display
                font-extrabold

                text-base
                md:text-lg

                tracking-normal

                text-zinc-900
              "
            >
              <span className="text-zinc-900">Algo</span>
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Trace
              </span>
            </span>

            <span
              className="
                font-space
                font-semibold

                text-[11px]

                tracking-[0.08em]

                text-zinc-500

                -mt-1
              "
            >
              DSA Pattern Visualizer
            </span>
          </div>
        </Link>

        {/* Navigation Links */}

        <div className="flex items-center gap-10">
          <Link
            to="/patterns"
            className="
              font-space
              font-semibold

              text-xs

              tracking-widest

              text-zinc-600

              hover:text-zinc-900

              uppercase

              transition-colors
            "
          >
            Patterns
          </Link>

          <a
            href="#categories"
            className="
              font-space
              font-semibold

              text-xs

              tracking-widest

              text-zinc-600

              hover:text-zinc-900

              uppercase

              transition-colors
            "
          >
            Categories
          </a>

          <a
            href="#learning-flow"
            className="
              font-space
              font-semibold

              text-xs

              tracking-widest

              text-zinc-600

              hover:text-zinc-900

              uppercase

              transition-colors
            "
          >
            How it works
          </a>
        </div>

        {/* Action CTA + Theme Toggle */}

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}

          <button
            type="button"
            onClick={onToggleTheme}
            className="
              theme-toggle

              w-11
              h-11

              rounded-full

              border
              border-zinc-200

              bg-white

              transition-all
              duration-300

              flex
              items-center
              justify-center

              hover:-translate-y-0.5

              group
            "
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <Sun
                size={17}
                className="
                  text-amber-300

                  transition-transform
                  duration-300

                  group-hover:rotate-12
                "
              />
            ) : (
              <Moon
                size={17}
                className="
                  text-indigo-700

                  transition-transform
                  duration-300

                  group-hover:-rotate-12
                "
              />
            )}
          </button>

          {/* Explore Patterns */}

          <Link
            to="/patterns"
            className="
              inline-flex
              items-center
              gap-2

              px-5
              py-2.5

              rounded-full

              bg-zinc-900

              text-white

              font-space
              font-bold

              text-xs

              tracking-widest

              uppercase

              transition-all
              duration-300

              hover:shadow-lg
              hover:-translate-y-0.5

              group
            "
          >
            Explore Patterns
            <ArrowRight
              size={13}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
