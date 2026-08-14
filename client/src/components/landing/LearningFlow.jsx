import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Settings,
  Play,
  Eye,
  ArrowRight,
  CornerRightDown,
} from "lucide-react";

const steps = [
  {
    index: "01",
    title: "Select & Read Predefined Code",
    subtitle: "Preloaded C++ or Python source codes",
    icon: Code,
    color: "border-purple-300 bg-purple-50/40",
    description:
      "Explore highly optimized implementation codes of common algorithms. The code is read-only, ensuring you focus on studying structure and correctness.",
  },
  {
    index: "02",
    title: "Configure Your Test Cases",
    subtitle: "Predefined or temporary inputs",
    icon: Settings,
    color: "border-amber-300 bg-amber-50/40",
    description:
      "Choose from predefined standard test cases, or create temporary ones in-session. Feed custom parameters directly into the execution engine.",
  },
  {
    index: "03",
    title: "Step Through Execution",
    subtitle: "Controlled step-by-step debugger",
    icon: Play,
    color: "border-emerald-300 bg-emerald-50/40",
    description:
      "Use the playback console to go forward, backward, or auto-play. Watch the executing code-line highlight exactly as the engine resolves statements.",
  },
  {
    index: "04",
    title: "See Data Structure State Change",
    subtitle: "High-fidelity visual animations",
    icon: Eye,
    color: "border-rose-300 bg-rose-50/40",
    description:
      "Watch variables, arrays, nodes, pointers, or dynamic programming grids animate dynamically in response to the current code trace step.",
  },
];

export default function LearningFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="learning-flow"
      className="py-20 px-6 md:px-12 bg-[#FCF9F3] border-t border-[#ebdcb9]/40 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span className="font-space font-bold text-xs tracking-widest text-zinc-500 uppercase">
              METHODOLOGY
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-zinc-950">
            How You Learn With Us
          </h2>
          <p className="font-sans font-medium text-sm md:text-base text-zinc-500 mt-4 leading-relaxed">
            By mapping static implementation structures directly to dynamic
            memory transitions, we build a spatial mental model of algorithm
            execution.
          </p>
        </div>

        {/* Dynamic Grid: Steps on Left, Live Mock Console on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Steps list */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={step.index}
                  onClick={() => setActiveStep(idx)}
                  className={`learning-step-card learning-tone-${idx + 1} ${isActive ? "is-active" : ""} cursor-pointer border-3 rounded-2xl p-5 md:p-6 transition-all duration-300 flex items-start gap-4 shadow-sm
                    ${
                      isActive
                        ? `${step.color} border-zinc-950 translate-x-2 shadow-[4px_4px_0px_rgba(18,18,20,1)]`
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border-2 border-zinc-950 font-bold shrink-0 transition-all duration-300
                    ${isActive ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"}`}
                  >
                    <StepIcon size={16} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-space font-black text-xs text-indigo-600">
                        [{step.index}]
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-zinc-900 leading-snug">
                        {step.title}
                      </h3>
                    </div>

                    <p className="font-space font-bold text-[10px] text-zinc-400 uppercase tracking-widest mb-2">
                      {step.subtitle}
                    </p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-sans font-medium text-xs md:text-sm text-zinc-600 leading-relaxed mt-2"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Mock Console Panel on Right */}
          <div className="lg:col-span-7 bg-zinc-950 rounded-3xl p-4 md:p-6 border-3 border-zinc-900 shadow-[8px_8px_0px_rgba(18,18,20,1)] text-white w-full select-none">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block animate-pulse" />
                <span className="font-bold tracking-wider text-[10px]">
                  DSA_SANDBOX_CONSOLE
                </span>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold">
                  LANGUAGE: C++
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 text-[9px] font-bold">
                  ACTIVE STEP: {activeStep + 1}/4
                </span>
              </div>
            </div>

            {/* Core view body based on activeStep */}
            <div className="min-h-[260px] bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 overflow-hidden relative flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="font-mono text-xs md:text-sm text-zinc-300 leading-relaxed w-full"
                  >
                    <div className="text-zinc-500 mb-2 border-b border-zinc-800 pb-1 flex items-center justify-between">
                      <span>bubbleSort.cpp</span>
                      <span className="text-[10px] text-zinc-600">
                        READ-ONLY
                      </span>
                    </div>
                    <pre className="text-zinc-400 text-[10px] md:text-xs">
                      <div>{`void bubbleSort(int arr[], int n) {`}</div>
                      <div className="bg-indigo-950/60 border-l-2 border-indigo-500 text-indigo-200 px-2 py-0.5">{`    for (int i = 0; i < n-1; i++) {`}</div>
                      <div>{`        for (int j = 0; j < n-i-1; j++) {`}</div>
                      <div>{`            if (arr[j] > arr[j+1])`}</div>
                      <div>{`                swap(arr[j], arr[j+1]);`}</div>
                      <div>{`        }`}</div>
                      <div>{`    }`}</div>
                      <div>{`}`}</div>
                    </pre>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full text-zinc-300"
                  >
                    <div className="font-mono text-xs text-zinc-500 mb-4 border-b border-zinc-800 pb-1">
                      test_case_selector.cfg
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                        <div className="text-xs font-bold text-indigo-400 font-space mb-1">
                          Predefined Cases
                        </div>
                        <div className="text-[11px] text-zinc-400 font-sans mb-3">
                          Quick pre-configured parameters.
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <div className="text-[10px] font-mono bg-zinc-800 p-1.5 rounded flex justify-between border border-zinc-700">
                            <span>Case 1 (Reversed)</span>
                            <span className="text-indigo-400 font-bold">
                              [5, 4, 3, 2, 1]
                            </span>
                          </div>
                          <div className="text-[10px] font-mono bg-zinc-800 p-1.5 rounded flex justify-between">
                            <span>Case 2 (Sorted)</span>
                            <span className="text-zinc-500">
                              [1, 2, 3, 4, 5]
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                        <div className="text-xs font-bold text-zinc-300 font-space mb-1">
                          Custom Parameters
                        </div>
                        <div className="text-[11px] text-zinc-500 font-sans mb-3">
                          Inject custom arrays temporarily.
                        </div>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            type="text"
                            value="4, 9, 2, 8"
                            className="bg-zinc-800 border border-zinc-700 text-xs px-2 py-1 rounded w-full font-mono text-amber-300"
                          />
                          <button className="bg-amber-500 text-zinc-950 font-space text-[10px] font-bold px-3 py-1 rounded-lg">
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex flex-col justify-center items-center py-6"
                  >
                    <div className="font-mono text-[10px] text-zinc-500 mb-6">
                      DEBUGGER_PLAYBACK_CONTROLLER
                    </div>
                    {/* Mock Controls */}
                    <div className="flex items-center gap-4 bg-zinc-800/80 px-6 py-4 rounded-full border-2 border-zinc-700 shadow-md">
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        ⏮
                      </button>
                      <button className="text-zinc-400 hover:text-white transition-colors">
                        ◀
                      </button>
                      <button className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center transition-all duration-300 scale-105 shadow-[0px_0px_10px_rgba(16,185,129,0.4)]">
                        <Play size={18} fill="#121214" />
                      </button>
                      <button className="text-zinc-400 hover:text-white transition-colors">
                        ▶
                      </button>
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        ⏭
                      </button>
                    </div>
                    <div className="font-mono text-[10px] text-emerald-400 mt-4 animate-pulse">
                      STATUS: STEP_MODE_ACTIVE (Line 3: i=0, j=0)
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex flex-col justify-center"
                  >
                    <div className="font-mono text-xs text-zinc-500 mb-4 border-b border-zinc-800 pb-1">
                      physical_state_animator.io
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                      {[
                        { val: 3, state: "sorted" },
                        { val: 5, state: "comparing" },
                        { val: 8, state: "comparing" },
                        { val: 2, state: "idle" },
                        { val: 4, state: "idle" },
                      ].map((cell, idx) => (
                        <div
                          key={idx}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-extrabold text-sm border-2
                            ${cell.state === "sorted" ? "bg-indigo-600 border-zinc-950 text-white" : ""}
                            ${cell.state === "comparing" ? "bg-rose-500 border-zinc-950 text-white animate-pulse" : ""}
                            ${cell.state === "idle" ? "bg-zinc-800 border-zinc-700 text-zinc-400" : ""}
                          `}
                        >
                          {cell.val}
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-400 text-center">
                      Memory variables:{" "}
                      <span className="text-amber-300">comparing = [1, 2]</span>{" "}
                      | <span className="text-emerald-400">swapped = true</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom dynamic tips */}
              <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-sans text-zinc-500">
                <span>ACTIVE STAGE: {steps[activeStep].title}</span>
                <span className="text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  Demo Sandbox <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
