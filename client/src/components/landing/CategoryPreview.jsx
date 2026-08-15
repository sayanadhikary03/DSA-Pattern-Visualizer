import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Layers,
  RefreshCw,
  GitCommit,
  Database,
  GitMerge,
  Share2,
  Award,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: "01",
    name: "Arrays",
    span: "md:col-span-5",
    color: "bg-amber-100 hover:bg-amber-200/80 border-amber-300",
    icon: Database,
    description:
      "Master sliding window, two pointers, and prefix sum patterns on linear blocks of memory.",
    preview: (
      <div className="flex gap-1.5 justify-center my-4">
        {[1, 2, 3, 4].map((v, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-mono text-xs font-bold"
          >
            {v}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "02",
    name: "Sorting",
    span: "md:col-span-7",
    color: "bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200",
    icon: RefreshCw,
    description:
      "Visualize Bubble, Quick, Merge, and Heap sorts in real-time, watching items find their positions.",
    preview: (
      <div className="flex items-end justify-center gap-2 h-14 my-2">
        {[30, 60, 45, 90, 75, 50].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 10 }}
            animate={{ height: `${h}%` }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
              delay: i * 0.15,
            }}
            className="w-4 bg-indigo-600 rounded-t"
          />
        ))}
      </div>
    ),
  },
  {
    id: "03",
    name: "Linked List",
    span: "md:col-span-6",
    color: "bg-rose-50 hover:bg-rose-100/80 border-rose-200",
    icon: GitCommit,
    description:
      "Understand node linkages, recursive pointers, fast & slow pointers, and cycle detection.",
    preview: (
      <div className="flex items-center justify-center gap-2 my-4">
        {[1, 2, 3].map((v, i) => (
          <React.Fragment key={i}>
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white font-mono text-xs font-bold">
              {v}
            </div>
            {i < 2 && (
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                className="text-rose-500 font-bold"
              >
                ➔
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>
    ),
  },
  {
    id: "04",
    name: "Stack & Queue",
    span: "md:col-span-6",
    color: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200",
    icon: Layers,
    description:
      "Track Last-In-First-Out (LIFO) and First-In-First-Out (FIFO) push/pop operations visually.",
    preview: (
      <div className="flex flex-col-reverse items-center justify-center h-16 gap-1 my-1">
        {[1, 2, 3].map((v, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
            className="w-20 py-0.5 rounded bg-emerald-600 border border-emerald-700 flex items-center justify-center text-white font-mono text-[9px] font-bold"
          >
            Item {v}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: "05",
    name: "Trees",
    span: "md:col-span-4",
    color: "bg-sky-50 hover:bg-sky-100/80 border-sky-200",
    icon: GitMerge,
    description:
      "Binary trees, BFS/DFS traversal order, and AVL balancing step-by-step.",
    preview: (
      <div className="relative w-full h-12 flex items-center justify-center my-3">
        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-[9px] z-10">
          R
        </div>
        <div className="absolute top-7 left-12 w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-white text-[9px] z-10">
          L
        </div>
        <div className="absolute top-7 right-12 w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center text-white text-[9px] z-10">
          R
        </div>
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="50%"
            y1="12"
            x2="35%"
            y2="40%"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <line
            x1="50%"
            y1="12"
            x2="65%"
            y2="40%"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "06",
    name: "Graph",
    span: "md:col-span-4",
    color: "bg-purple-50 hover:bg-purple-100/80 border-purple-200",
    icon: Share2,
    description:
      "Navigate nodes and edges via Dijkstra, BFS, DFS, and topological sorts.",
    preview: (
      <div className="relative w-full h-12 flex items-center justify-center gap-6 my-3">
        {[1, 2, 3].map((v, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.4 }}
            className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[9px] z-10 border border-zinc-950 font-bold"
          >
            {v}
          </motion.div>
        ))}
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="30%"
            y1="24"
            x2="50%"
            y2="24"
            stroke="#c084fc"
            strokeWidth="2"
          />
          <line
            x1="50%"
            y1="24"
            x2="70%"
            y2="24"
            stroke="#c084fc"
            strokeWidth="2"
          />
        </svg>
      </div>
    ),
  },
  {
    id: "07",
    name: "Dynamic Programming",
    span: "md:col-span-4",
    color: "bg-orange-50 hover:bg-orange-100/80 border-orange-200",
    icon: Award,
    description:
      "Deconstruct subproblems, build memoization tables, and watch DP matrices fill.",
    preview: (
      <div className="grid grid-cols-3 gap-0.5 max-w-[90px] mx-auto my-3 border border-zinc-300 rounded p-0.5 bg-white">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ bg: "white" }}
            animate={{
              backgroundColor: i % 4 === 0 ? "#f97316" : "#ffffff",
              color: i % 4 === 0 ? "#ffffff" : "#121214",
            }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
            className="w-6 h-6 border border-zinc-200 text-[8px] flex items-center justify-center font-bold"
          >
            {i % 4 === 0 ? "✓" : "0"}
          </motion.div>
        ))}
      </div>
    ),
  },
];

function toCategoryQuery(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryPreview() {
  return (
    <section
      id="categories"
      className="scroll-mt-32 md:scroll-mt-36 py-20 px-6 md:px-12 bg-[#FCF9F3] border-t border-[#ebdcb9]/40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span className="font-space font-bold text-xs tracking-widest text-zinc-500 uppercase">
                ALGORITHM CLASSIFICATION
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-zinc-950">
              Interactive Library
            </h2>
          </div>
          <p className="font-sans font-medium text-sm md:text-base text-zinc-500 max-w-md">
            Click into any category to explore structured code execution
            visualizers tailored for core interview pattern schemas.
          </p>
        </div>

        {/* Asymmetrical Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`${cat.span}`}
              >
                <Link
                  to={`/patterns?category=${toCategoryQuery(cat.name)}`}
                  className={`category-card dark-tone-${idx + 1} group h-full p-6 md:p-8 rounded-3xl border-3 border-zinc-900 shadow-[6px_6px_0px_rgba(18,18,20,1)] hover:shadow-[10px_10px_0px_rgba(18,18,20,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between ${cat.color}`}
                >
                  <div>
                    {/* Header: ID + Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-space font-extrabold text-xs tracking-wider text-zinc-500 bg-zinc-900/5 px-3 py-1 rounded-full">
                        [{cat.id}]
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-12 shadow">
                        <Icon size={18} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-extrabold text-2xl text-zinc-950 mb-3 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="font-sans font-medium text-xs md:text-sm text-zinc-600 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  {/* Custom Graphic Area + Footer */}
                  <div>
                    {cat.preview}

                    <div className="flex items-center gap-2 text-xs font-space font-bold tracking-wider text-zinc-900 uppercase mt-4 pt-4 border-t border-zinc-900/10">
                      Explore patterns
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-1 text-indigo-600"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
