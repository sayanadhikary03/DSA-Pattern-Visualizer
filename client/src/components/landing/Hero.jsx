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
    hidden: {
      opacity: 0,
      y: 30,
    },
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
    <section className="relative w-full bg-[#FCF9F3] overflow-hidden">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
          py-12
          sm:py-14
          md:py-16
          lg:py-14
          xl:py-16
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            items-center
            gap-12
            md:gap-14
            lg:gap-4
            xl:gap-8
          "
        >
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

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
            {/* =================================================
                TOP LABEL
            ================================================== */}

            <motion.div
              variants={itemVariants}
              className="
                flex
                items-center
                gap-2
                mb-6
              "
            >
              <div
                className="
                  w-5
                  h-5
                  shrink-0
                  rounded
                  bg-zinc-950
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <Terminal size={10} />
              </div>

              <span
                className="
                  font-space
                  font-bold
                  text-[9px]
                  sm:text-[10px]
                  md:text-xs
                  tracking-[0.16em]
                  sm:tracking-[0.2em]
                  text-zinc-500
                  uppercase
                "
              >
                EDUCATIONAL ALGORITHM PLAYGROUND
              </span>
            </motion.div>

            {/* =================================================
                HERO TITLE
            ================================================== */}

            <motion.div
              variants={itemVariants}
              className="
                relative
                font-display
                font-extrabold
                text-zinc-950
                flex
                flex-col
                mb-8
                select-none
                max-w-full
                leading-[0.86]
                tracking-tighter
              "
            >
              {/* DSA */}

              <span
                className="
                  block
                  text-[4rem]
                  sm:text-[4.8rem]
                  md:text-[5.5rem]
                  lg:text-[4.7rem]
                  xl:text-[5.6rem]
                  2xl:text-[6.2rem]
                "
              >
                DSA
              </span>

              {/* =================================================
                  PATTERN BADGE
              ================================================== */}

              <div
                className="
                  mt-5
                  mb-9
                  sm:mt-6
                  sm:mb-10
                  md:mb-11
                  inline-block
                  self-start
                  relative
                  max-w-full
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
                    text-[2.6rem]
                    sm:text-[3.3rem]
                    md:text-[4rem]
                    lg:text-[3.8rem]
                    xl:text-[4.6rem]
                    2xl:text-[5rem]

                    px-4
                    sm:px-5
                    md:px-7
                    lg:px-6
                    xl:px-8

                    py-1
                    sm:py-1.5
                    md:py-2

                    rounded-xl
                    sm:rounded-2xl
                    md:rounded-3xl

                    shadow-[5px_5px_0px_rgba(18,18,20,1)]
                    border-[3px]
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

                  {/* Left ticket cutout */}
                  <div
                    className="
                      absolute
                      left-[-7px]
                      top-1/2
                      -translate-y-1/2
                      w-3
                      sm:w-4
                      h-5
                      sm:h-6
                      bg-[#FCF9F3]
                      border-r-[3px]
                      border-zinc-950
                      rounded-r-full
                    "
                  />

                  {/* Right ticket cutout */}
                  <div
                    className="
                      absolute
                      right-[-7px]
                      top-1/2
                      -translate-y-1/2
                      w-3
                      sm:w-4
                      h-5
                      sm:h-6
                      bg-[#FCF9F3]
                      border-l-[3px]
                      border-zinc-950
                      rounded-l-full
                    "
                  />
                </motion.div>
              </div>

              {/* =================================================
                  VISUALIZER
              ================================================== */}

              <span
                className="
                  block
                  text-zinc-950
                  whitespace-nowrap
                  tracking-[-0.065em]
                  text-[3.5rem]
                  sm:text-[4.4rem]
                  md:text-[5.1rem]
                  lg:text-[4.4rem]
                  xl:text-[5.2rem]
                  2xl:text-[5.8rem]
                "
              >
                VISUALIZER
              </span>
            </motion.div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <motion.div
              variants={itemVariants}
              className="
                pl-4
                sm:pl-5
                md:pl-6
                border-l-[3px]
                border-zinc-950
                mb-8
                md:mb-10
                max-w-xl
              "
            >
              <p
                className="
                  font-sans
                  font-medium
                  text-sm
                  sm:text-[15px]
                  md:text-base
                  leading-relaxed
                  text-zinc-600
                "
              >
                Understand Data Structures & Algorithms visually. We connect
                every single line of code to every step of physical execution,
                making complex patterns instantly clear.
              </p>
            </motion.div>

            {/* =================================================
                CTA
            ================================================== */}

            <motion.div
              variants={itemVariants}
              className="
                flex
                flex-col
                sm:flex-row
                items-stretch
                sm:items-center
                gap-3
                sm:gap-4
                w-full
                sm:w-auto
              "
            >
              <Link
                to="/patterns"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-7
                  sm:px-8
                  py-4
                  sm:py-5
                  rounded-xl
                  sm:rounded-2xl
                  bg-zinc-900
                  hover:bg-zinc-800
                  text-white
                  font-space
                  font-bold
                  text-xs
                  sm:text-sm
                  tracking-widest
                  uppercase
                  shadow-[5px_5px_0px_rgba(99,102,241,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  group
                "
              >
                Explore Patterns

                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <a
                href="#categories"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-6
                  py-4
                  sm:py-5
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
                  rounded-xl
                  sm:rounded-2xl
                  transition-all
                "
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT SIDE VISUALIZATION
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="
              lg:col-start-8
              lg:col-span-5

              w-full

              flex
              items-center
              justify-center

              relative
              z-10

              mt-4
              sm:mt-6
              md:mt-8
              lg:mt-0

              min-w-0
            "
          >
            <div
              className="
                w-full
                max-w-[620px]
                lg:max-w-[600px]
                xl:max-w-[650px]
              "
            >
              <HeroVisualization />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}