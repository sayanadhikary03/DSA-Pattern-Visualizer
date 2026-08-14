import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import HeroVisualization from "./HeroVisualization";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative w-full py-10 lg:py-14 px-6 md:px-12 bg-[#FCF9F3] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-4">
        {/* =========================
            LEFT SIDE - HERO CONTENT
        ========================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            lg:col-span-7
            flex
            flex-col
            items-start
            text-left
            relative
            z-20
            min-w-0
          "
        >
          {/* =========================
              TOP LABEL
          ========================== */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-5 h-5 rounded bg-zinc-950 flex items-center justify-center text-[10px] text-white">
              <Terminal size={10} />
            </div>

            <span className="font-space font-bold text-[10px] md:text-xs tracking-[0.2em] text-zinc-500 uppercase">
              EDUCATIONAL ALGORITHM PLAYGROUND
            </span>
          </motion.div>

          {/* =========================
              HERO TITLE
          ========================== */}
          <motion.div
            variants={itemVariants}
            className="
              relative
              font-display
              font-extrabold
              text-[3.8rem]
              xs:text-[4.3rem]
              sm:text-[5rem]
              md:text-[5.4rem]
              lg:text-[4.7rem]
              xl:text-[5.1rem]
              leading-[0.88]
              tracking-tighter
              text-zinc-950
              flex
              flex-col
              mb-8
              select-none
              max-w-full
            "
          >
            {/* =========================
                DSA
            ========================== */}
            <span className="block">DSA</span>

            {/* =========================
                PATTERN BADGE
            ========================== */}
            <div
              className="
                mt-5
                mb-9
                md:mt-6
                md:mb-11
                inline-block
                self-start
                relative
              "
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                  rotate: "-2deg",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
                className="
                  bg-indigo-600
                  text-white
                  font-display
                  font-extrabold
                  text-[2.8rem]
                  xs:text-[3.2rem]
                  sm:text-[4rem]
                  md:text-[4.4rem]
                  lg:text-[4rem]
                  xl:text-[4.3rem]
                  px-5
                  md:px-7
                  py-1
                  md:py-2
                  rounded-2xl
                  md:rounded-3xl
                  shadow-[6px_6px_0px_rgba(18,18,20,1)]
                  border-3
                  border-zinc-950
                  -rotate-[4deg]
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  select-none
                  whitespace-nowrap
                "
              >
                PATTERN
                {/* Ticket cutouts */}
                <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-6 bg-[#FCF9F3] border-r-3 border-zinc-950 rounded-r-full" />
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-6 bg-[#FCF9F3] border-l-3 border-zinc-950 rounded-l-full" />
              </motion.div>
            </div>

            {/* =========================
                VISUALIZER
            ========================== */}
            <span
              className="
                block
                text-zinc-950
                text-[2.78rem]
                xs:text-[3.22rem]
                sm:text-[3.79rem]
                md:text-[4.37rem]
                lg:text-[4.25rem]
                xl:text-[4.6rem]
                whitespace-nowrap
                tracking-[-0.055em]
              "
            >
              VISUALIZER
            </span>
          </motion.div>

          {/* =========================
              DESCRIPTION
          ========================== */}
          <motion.div
            variants={itemVariants}
            className="
              pl-6
              border-l-3
              border-zinc-950
              mb-10
              max-w-lg
            "
          >
            <p className="font-sans font-medium text-sm md:text-base leading-relaxed text-zinc-600">
              Understand Data Structures & Algorithms visually. We connect every
              single line of code to every step of physical execution, making
              complex patterns instantly clear.
            </p>
          </motion.div>

          {/* =========================
              CTA ACTION SECTION
          ========================== */}
          <motion.div
            variants={itemVariants}
            className="
              flex
              flex-col
              sm:flex-row
              items-stretch
              sm:items-center
              gap-4
              w-full
              sm:w-auto
            "
          >
            {/* Primary CTA */}
            <Link
              to="/patterns"
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                px-8
                py-5
                rounded-2xl
                bg-zinc-900
                hover:bg-zinc-800
                text-white
                font-space
                font-bold
                text-sm
                tracking-widest
                uppercase
                shadow-[6px_6px_0px_rgba(99,102,241,0.4)]
                transition-all
                duration-300
                hover:shadow-lg
                hover:-translate-y-0.5
                group
              "
            >
              Explore Patterns
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Secondary CTA */}
            <a
              href="#categories"
              className="
                inline-flex
                items-center
                justify-center
                px-6
                py-5
                font-space
                font-bold
                text-xs
                tracking-widest
                text-zinc-700
                hover:text-zinc-950
                uppercase
                border-2
                border-transparent
                hover:border-zinc-300
                rounded-2xl
                transition-all
              "
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* =========================
            RIGHT SIDE - VISUALIZATION
        ========================== */}
        <div
          className="
            lg:col-start-8
            lg:col-span-5
            w-full
            flex
            items-center
            justify-center
            lg:justify-end
            relative
            z-10

            /* Larger visualization on desktop */
            lg:scale-[0.90]
            xl:scale-[0.95]

            /* Keep artwork slightly lower */
            lg:translate-y-8
            xl:translate-y-6

            /* Scale from the center */
            origin-center
          "
        >
          <div className="w-full max-w-[590px]">
            <HeroVisualization />
          </div>
        </div>
      </div>
    </section>
  );
}
