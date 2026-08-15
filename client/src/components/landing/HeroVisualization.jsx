import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  GitMerge,
  Award,
  Info,
  Hash,
} from "lucide-react";

export default function HeroVisualization() {
  const containerRef = useRef(null);

  // =========================================================
  // ARRAY / BUBBLE SORT STATE
  // =========================================================

  const [array, setArray] = useState([5, 3, 8, 2, 4]);
  const [jIndex, setJIndex] = useState(0);
  const [phase, setPhase] = useState("compare");

  const [stepText, setStepText] = useState("Compare 5 and 3. No swap needed.");

  const [isPlaying, setIsPlaying] = useState(true);
  const [isInView, setIsInView] = useState(true);

  // =========================================================
  // BINARY TREE STATE
  // =========================================================

  const [activeNode, setActiveNode] = useState("A");

  const treeNodes = {
    A: {
      x: 50,
      y: 20,
    },
    B: {
      x: 28,
      y: 65,
    },
    C: {
      x: 72,
      y: 65,
    },
    D: {
      x: 15,
      y: 110,
    },
    E: {
      x: 41,
      y: 110,
    },
  };

  const traversalOrder = ["A", "B", "D", "B", "E", "B", "A", "C", "A"];

  // =========================================================
  // VISIBILITY STATE
  // =========================================================

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // =========================================================
  // BUBBLE SORT ANIMATION
  // =========================================================

  useEffect(() => {
    if (!isPlaying || !isInView) return;

    const timer = setInterval(() => {
      setArray((currentArray) => {
        const nextArray = [...currentArray];

        const currentValue = nextArray[jIndex];
        const nextValue = nextArray[jIndex + 1];

        if (currentValue > nextValue) {
          nextArray[jIndex] = nextValue;
          nextArray[jIndex + 1] = currentValue;

          setPhase("swap");
          setStepText(`Swap ${currentValue} and ${nextValue}.`);

          return nextArray;
        }

        setPhase("compare");

        setStepText(
          `Compare ${currentValue} and ${nextValue}. No swap needed.`,
        );

        return nextArray;
      });

      setJIndex((currentIndex) => {
        if (currentIndex >= 3) {
          return 0;
        }

        return currentIndex + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isInView, isPlaying, jIndex]);

  // =========================================================
  // TREE ANIMATION
  // =========================================================

  useEffect(() => {
    if (!isInView) return;

    let index = 0;

    const timer = setInterval(() => {
      index = (index + 1) % traversalOrder.length;

      setActiveNode(traversalOrder[index]);
    }, 1500);

    return () => clearInterval(timer);
  }, [isInView]);

  // =========================================================
  // RESET ARRAY
  // =========================================================

  const resetArray = () => {
    setArray([5, 3, 8, 2, 4]);
    setJIndex(0);
    setPhase("compare");
    setStepText("Compare 5 and 3. No swap needed.");
  };

  // =========================================================
  // SHARED DRAG SETTINGS
  // =========================================================

  const dragSettings = {
    drag: true,
    dragMomentum: false,
    dragElastic: 0.12,
    dragConstraints: {
      top: -24,
      bottom: 24,
      left: -24,
      right: 24,
    },
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      ref={containerRef}
      className="
        relative
        w-full
        aspect-[14/15]
        max-w-[650px]
        mx-auto
        overflow-visible
        select-none
      "
    >
      {/* =====================================================
          BACKGROUND GRID
      ====================================================== */}

      <div
        className="
          absolute
          inset-[5%]
          grid
          grid-cols-6
          grid-rows-6
          opacity-[0.055]
          pointer-events-none
        "
      >
        {Array.from({ length: 36 }).map((_, index) => (
          <div key={index} className="border border-zinc-950" />
        ))}
      </div>

      {/* =====================================================
          DECORATIVE STARS
      ====================================================== */}

      <div
        className="
          absolute
          top-[8%]
          left-[12%]
          text-indigo-500
          text-[clamp(14px,2vw,22px)]
          pointer-events-none
        "
      >
        ✦
      </div>

      <div
        className="
          absolute
          top-[25%]
          right-[4%]
          text-indigo-500
          text-[clamp(16px,2.5vw,26px)]
          pointer-events-none
        "
      >
        ✦
      </div>

      <div
        className="
          absolute
          bottom-[20%]
          left-[4%]
          text-rose-400
          text-[clamp(14px,2vw,22px)]
          pointer-events-none
        "
      >
        ✦
      </div>

      <div
        className="
          absolute
          bottom-[10%]
          right-[6%]
          text-amber-500
          text-[clamp(16px,2.5vw,26px)]
          pointer-events-none
        "
      >
        ✦
      </div>

      {/* =====================================================
          ARTWORK 1
          CODE CARD
      ====================================================== */}

      <motion.div
        {...dragSettings}
        whileDrag={{
          scale: 1.02,
          rotate: 5,
          cursor: "grabbing",
        }}
        initial={{
          opacity: 0,
          y: -20,
          rotate: 4,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: 4,
        }}
        transition={{
          duration: 0.6,
          delay: 0.15,
        }}
        className="
          absolute
          top-[4%]
          right-[3%]
          z-30

          w-[46%]

          bg-zinc-900
          border-[3px]
          border-zinc-950
          rounded-[clamp(10px,2vw,18px)]

          p-[clamp(8px,1.5vw,16px)]

          shadow-[7px_7px_0px_rgba(99,102,241,0.25)]

          cursor-grab
          active:cursor-grabbing
        "
      >
        {/* Window header */}

        <div
          className="
            flex
            items-center
            gap-1.5
            mb-[clamp(6px,1vw,12px)]
            pb-[clamp(5px,1vw,9px)]
            border-b
            border-zinc-700
          "
        >
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />

          <span
            className="
              font-mono
              text-[clamp(6px,0.8vw,10px)]
              text-zinc-500
              ml-1.5
              truncate
            "
          >
            bubble_sort.js
          </span>
        </div>

        {/* Code */}

        <div
          className="
            font-mono
            text-[clamp(6px,0.85vw,10px)]
            leading-relaxed
            text-zinc-400
          "
        >
          <div
            className={`
              px-1.5
              py-0.5
              rounded
              transition-all
              duration-300

              ${phase === "compare" ? "bg-indigo-600 text-white" : ""}
            `}
          >
            1&nbsp;&nbsp;if (arr[j] &gt; arr[j+1]) {"{"}
          </div>

          <div className="px-1.5 py-0.5">
            2&nbsp;&nbsp;&nbsp;&nbsp;let temp = arr[j];
          </div>

          <div
            className={`
              px-1.5
              py-0.5
              rounded
              transition-all
              duration-300

              ${phase === "swap" ? "bg-amber-500 text-zinc-950" : ""}
            `}
          >
            3&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[j+1];
          </div>

          <div
            className={`
              px-1.5
              py-0.5
              rounded
              transition-all
              duration-300

              ${phase === "swap" ? "bg-amber-500 text-zinc-950" : ""}
            `}
          >
            4&nbsp;&nbsp;&nbsp;&nbsp;arr[j+1] = temp;
          </div>

          <div className="px-1.5 py-0.5">5&nbsp;&nbsp;{"}"}</div>
        </div>
      </motion.div>

      {/* =====================================================
          ARTWORK 2
          COMPLEXITY CARD
      ====================================================== */}

      <motion.div
        {...dragSettings}
        whileDrag={{
          scale: 1.04,
          rotate: -5,
          cursor: "grabbing",
        }}
        initial={{
          opacity: 0,
          x: -20,
          rotate: -12,
        }}
        animate={{
          opacity: 1,
          x: 0,
          rotate: -8,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="
          absolute
          top-[25%]
          left-[4%]
          z-40

          w-[23%]
          min-w-[95px]

          bg-amber-400
          border-[3px]
          border-zinc-950
          rounded-[clamp(8px,1.5vw,14px)]

          px-2
          sm:px-3
          py-2
          sm:py-3

          text-center

          shadow-[5px_5px_0px_rgba(18,18,20,1)]

          cursor-grab
          active:cursor-grabbing
        "
      >
        <div className="flex justify-center mb-1">
          <Award size={14} className="text-zinc-950" />
        </div>

        <div
          className="
            font-display
            font-extrabold
            text-[clamp(12px,1.6vw,20px)]
            text-zinc-950
            leading-none
          "
        >
          O(N²)
        </div>

        <div
          className="
            font-space
            font-bold
            text-[clamp(6px,0.75vw,9px)]
            tracking-wider
            text-zinc-700
            uppercase
            mt-1
          "
        >
          COMPLEXITY
        </div>
      </motion.div>

      {/* =====================================================
          ARTWORK 3
          MAIN ARRAY VISUALIZER
      ====================================================== */}

      <motion.div
        {...dragSettings}
        whileDrag={{
          scale: 1.015,
          rotate: 0,
          cursor: "grabbing",
        }}
        initial={{
          opacity: 0,
          y: 25,
          rotate: -1,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: -1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.25,
          type: "spring",
          stiffness: 100,
        }}
        className="
          absolute

          top-[36%]
          left-[12%]

          z-20

          w-[68%]

          bg-[#FCF9F3]

          border-[3px]
          border-zinc-900

          rounded-[clamp(14px,2.5vw,26px)]

          p-[clamp(10px,2vw,20px)]

          shadow-[8px_8px_0px_rgba(18,18,20,1)]

          cursor-grab
          active:cursor-grabbing
        "
      >
        {/* Array header */}

        <div className="flex items-center justify-between mb-[clamp(10px,2vw,20px)]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-indigo-600" />

            <span
              className="
                font-space
                font-bold
                text-[clamp(7px,0.85vw,11px)]
                uppercase
                tracking-widest
                text-zinc-500
              "
            >
              ARRAY STATE
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
              bg-zinc-100
              px-2
              py-1.5
              rounded-full
              border
              border-zinc-200
              shrink-0
            "
          >
            <button
              type="button"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                setIsPlaying((value) => !value);
              }}
              className="text-zinc-600 hover:text-zinc-950"
              aria-label={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>

            <button
              type="button"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                resetArray();
              }}
              className="text-zinc-600 hover:text-zinc-950"
              aria-label="Reset animation"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* Array values */}

        <div
          className="
            flex
            justify-center
            gap-[clamp(5px,1.2vw,12px)]
            my-[clamp(18px,3vw,30px)]
          "
        >
          {array.map((value, index) => {
            const isCurrent = index === jIndex || index === jIndex + 1;

            const isSwapping = isCurrent && phase === "swap";

            return (
              <motion.div
                key={`${value}-${index}`}
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className={`
                  relative

                  w-[clamp(28px,6vw,52px)]
                  h-[clamp(28px,6vw,52px)]

                  flex
                  items-center
                  justify-center

                  rounded-[clamp(7px,1vw,12px)]

                  border-[3px]

                  font-display
                  font-extrabold

                  text-[clamp(11px,1.6vw,19px)]

                  ${
                    isSwapping
                      ? "bg-amber-400 text-zinc-950 border-zinc-950"
                      : isCurrent
                        ? "bg-indigo-600 text-white border-zinc-950"
                        : "bg-white text-zinc-800 border-zinc-300"
                  }
                `}
              >
                {value}

                {index === jIndex && (
                  <span
                    className="
                      absolute
                      -bottom-5
                      text-[clamp(6px,0.7vw,9px)]
                      font-mono
                      font-bold
                      text-zinc-900
                    "
                  >
                    j
                  </span>
                )}

                {index === jIndex + 1 && (
                  <span
                    className="
                      absolute
                      -bottom-5
                      text-[clamp(6px,0.7vw,9px)]
                      font-mono
                      font-bold
                      text-zinc-900
                    "
                  >
                    j+1
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Explanation */}

        <div
          className="
            bg-zinc-900
            text-zinc-300
            rounded-xl
            p-[clamp(7px,1.2vw,12px)]
            font-mono
            text-[clamp(7px,0.8vw,10px)]
            flex
            items-start
            gap-2
          "
        >
          <Info size={14} className="text-indigo-400 mt-0.5 shrink-0" />

          <div className="min-w-0">
            <span className="text-zinc-500">explain &gt;</span> {stepText}
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          ARTWORK 4
          BINARY TREE
      ====================================================== */}

      <motion.div
        {...dragSettings}
        whileDrag={{
          scale: 1.02,
          rotate: -1,
          cursor: "grabbing",
        }}
        initial={{
          opacity: 0,
          y: 25,
          rotate: -4,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: -3,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
        className="
          absolute

          bottom-[3%]
          left-[18%]

          z-10

          w-[39%]

          bg-[#FCF9F3]

          border-[3px]
          border-zinc-900

          rounded-[clamp(10px,2vw,18px)]

          p-[clamp(8px,1.5vw,15px)]

          shadow-[6px_6px_0px_rgba(18,18,20,1)]

          cursor-grab
          active:cursor-grabbing
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            mb-[clamp(6px,1vw,10px)]
          "
        >
          <GitMerge size={13} className="text-zinc-600" />

          <span
            className="
              font-space
              font-bold
              text-[clamp(6px,0.8vw,10px)]
              uppercase
              tracking-widest
              text-zinc-500
            "
          >
            BINARY TREE
          </span>
        </div>

        {/* Tree canvas */}

        <div
          className="
            relative
            aspect-[200/145]
            bg-zinc-50
            border
            border-zinc-200
            rounded-xl
            overflow-hidden
          "
        >
          <svg viewBox="0 0 200 145" className="absolute inset-0 w-full h-full">
            <line
              x1="100"
              y1="25"
              x2="56"
              y2="70"
              stroke="#d4d4d8"
              strokeWidth="2"
            />

            <line
              x1="100"
              y1="25"
              x2="144"
              y2="70"
              stroke="#d4d4d8"
              strokeWidth="2"
            />

            <line
              x1="56"
              y1="70"
              x2="30"
              y2="115"
              stroke="#d4d4d8"
              strokeWidth="2"
            />

            <line
              x1="56"
              y1="70"
              x2="82"
              y2="115"
              stroke="#d4d4d8"
              strokeWidth="2"
            />
          </svg>

          {Object.entries(treeNodes).map(([nodeName, node]) => {
            const isActive = activeNode === nodeName;

            return (
              <motion.div
                key={nodeName}
                animate={{
                  scale: isActive ? 1.12 : 1,
                }}
                style={{
                  left: `${node.x}%`,
                  top: `${(node.y / 145) * 100}%`,
                }}
                className={`
                    absolute

                    -translate-x-1/2
                    -translate-y-1/2

                    w-[clamp(22px,4vw,34px)]
                    h-[clamp(22px,4vw,34px)]

                    rounded-full

                    flex
                    items-center
                    justify-center

                    border-2

                    text-[clamp(7px,1vw,11px)]
                    font-bold

                    ${
                      isActive
                        ? "bg-indigo-600 text-white border-zinc-950 shadow-md"
                        : "bg-white text-zinc-700 border-zinc-300"
                    }
                  `}
              >
                {nodeName}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* =====================================================
          ARTWORK 5
          MEMOIZE / DP CACHE
      ====================================================== */}

      <motion.div
        {...dragSettings}
        whileDrag={{
          scale: 1.04,
          rotate: 5,
          cursor: "grabbing",
        }}
        initial={{
          opacity: 0,
          x: 25,
          y: 25,
          rotate: 8,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 8,
        }}
        transition={{
          duration: 0.7,
          delay: 0.5,
        }}
        className="
          absolute

          bottom-[8%]
          right-[2%]

          z-40

          w-[25%]
          min-w-[95px]

          aspect-[140/92]

          bg-purple-400

          border-[3px]
          border-zinc-950

          rounded-[clamp(8px,1.5vw,14px)]

          px-2
          py-2

          text-center

          shadow-[5px_5px_0px_rgba(18,18,20,1)]

          cursor-grab
          active:cursor-grabbing

          overflow-hidden

          flex
          flex-col
          items-center
          justify-center
        "
      >
        {/* Hash icon */}

        <div className="flex justify-center mb-1">
          <Hash size={13} strokeWidth={2.5} className="text-zinc-950" />
        </div>

        {/* Main text */}

        <div
          className="
            font-display
            font-extrabold
            text-[clamp(8px,1.2vw,14px)]
            leading-none
            tracking-tight
            text-zinc-950
            whitespace-nowrap
          "
        >
          MEMOIZE
        </div>

        {/* Subtitle */}

        <div
          className="
            font-space
            font-bold
            text-[clamp(5px,0.7vw,8px)]
            tracking-[0.12em]
            text-zinc-800
            uppercase
            mt-1
            whitespace-nowrap
          "
        >
          DP CACHE
        </div>
      </motion.div>
    </div>
  );
}
