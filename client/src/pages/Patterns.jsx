import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import useVisualizer from "../hooks/useVisualizer";
import { algorithmCatalog } from "../algorithms/catalog";

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Patterns() {
  const [searchParams] = useSearchParams();
  const requestedCategory = slugify(searchParams.get("category") || "");

  const categories = useMemo(() => {
    const unique = [...new Set(algorithmCatalog.map((item) => item.category))];
    return ["All", ...unique];
  }, []);

  const initialCategory = useMemo(() => {
    const found = categories.find(
      (name) => slugify(name) === requestedCategory,
    );
    return found || "All";
  }, [categories, requestedCategory]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredAlgorithms = useMemo(() => {
    if (selectedCategory === "All") {
      return algorithmCatalog;
    }
    return algorithmCatalog.filter(
      (item) => item.category === selectedCategory,
    );
  }, [selectedCategory]);

  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(
    filteredAlgorithms[0]?.id || "",
  );

  useEffect(() => {
    if (!filteredAlgorithms.length) {
      setSelectedAlgorithmId("");
      return;
    }

    const exists = filteredAlgorithms.some(
      (item) => item.id === selectedAlgorithmId,
    );
    if (!exists) {
      setSelectedAlgorithmId(filteredAlgorithms[0].id);
    }
  }, [filteredAlgorithms, selectedAlgorithmId]);

  const selectedAlgorithm =
    filteredAlgorithms.find((item) => item.id === selectedAlgorithmId) ||
    filteredAlgorithms[0] ||
    null;

  const availableLanguages = selectedAlgorithm
    ? Object.keys(selectedAlgorithm.languages || {})
    : [];
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    if (!availableLanguages.length) {
      return;
    }
    if (!availableLanguages.includes(language)) {
      setLanguage(availableLanguages[0]);
    }
  }, [availableLanguages, language]);

  const [selectedTestCaseId, setSelectedTestCaseId] = useState(
    selectedAlgorithm?.testCases?.[0]?.id || "",
  );

  useEffect(() => {
    const firstTestCase = selectedAlgorithm?.testCases?.[0];
    if (!firstTestCase) {
      setSelectedTestCaseId("");
      return;
    }

    const exists = selectedAlgorithm.testCases.some(
      (t) => t.id === selectedTestCaseId,
    );
    if (!exists) {
      setSelectedTestCaseId(firstTestCase.id);
    }
  }, [selectedAlgorithm, selectedTestCaseId]);

  const selectedTestCase =
    selectedAlgorithm?.testCases?.find((t) => t.id === selectedTestCaseId) ||
    selectedAlgorithm?.testCases?.[0] ||
    null;

  const steps = useMemo(() => {
    if (!selectedAlgorithm || !selectedTestCase) {
      return [];
    }
    return selectedAlgorithm.generateSteps(selectedTestCase.input);
  }, [selectedAlgorithm, selectedTestCase]);

  const visualizer = useVisualizer(steps);
  const currentStep = visualizer.currentStep;
  const activeLine = currentStep?.line?.[language] || null;
  const code = selectedAlgorithm?.languages?.[language]?.code || "";
  const codeLines = code.split("\n");
  const stateArray = Array.isArray(currentStep?.state?.array)
    ? currentStep.state.array
    : null;

  const highlightIndexes = new Set([
    ...(currentStep?.affected || []),
    ...(currentStep?.state?.comparing || []),
    ...(currentStep?.state?.swapping || []),
  ]);

  return (
    <div className="min-h-screen w-full bg-[#FCF9F3]">
      <section className="w-full px-6 md:px-10 lg:px-12 py-8 md:py-10 bg-[#FCF9F3]">
        <div className="w-full max-w-[1680px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-space font-bold text-xs tracking-widest text-zinc-500 uppercase">
                Implementation + Visualization
              </p>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-zinc-950">
                Explore Patterns
              </h1>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-zinc-900 text-zinc-900 font-space font-bold text-xs tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 rounded-2xl border-3 border-zinc-900 bg-white/80 p-4">
              <p className="font-space font-bold text-[10px] tracking-widest text-zinc-500 uppercase mb-3">
                Categories
              </p>
              <div className="flex flex-wrap lg:flex-col gap-2 mb-5">
                {categories.map((name) => {
                  const isActive = selectedCategory === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedCategory(name)}
                      className={`px-3 py-2 rounded-lg text-xs font-space font-bold tracking-wider uppercase border transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              <p className="font-space font-bold text-[10px] tracking-widest text-zinc-500 uppercase mb-3">
                Algorithms
              </p>
              <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
                {filteredAlgorithms.map((algo) => {
                  const isActive = selectedAlgorithm?.id === algo.id;
                  return (
                    <button
                      key={algo.id}
                      type="button"
                      onClick={() => setSelectedAlgorithmId(algo.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors ${
                        isActive
                          ? "bg-indigo-50 border-indigo-500"
                          : "bg-white border-zinc-300 hover:border-zinc-900"
                      }`}
                    >
                      <p className="font-space font-bold tracking-wide text-zinc-900">
                        {algo.name}
                      </p>
                      <p className="font-sans text-[11px] text-zinc-500">
                        {algo.complexity?.time || ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="lg:col-span-9 space-y-4">
              {!selectedAlgorithm ? (
                <div className="rounded-2xl border-3 border-zinc-900 bg-white p-6">
                  <p className="font-sans text-sm text-zinc-600">
                    No implementation is available for this category yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border-3 border-zinc-900 bg-white p-4 md:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display font-extrabold text-2xl text-zinc-950">
                          {selectedAlgorithm.name}
                        </h2>
                        <p className="font-sans text-sm text-zinc-600 mt-1">
                          {selectedAlgorithm.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="min-w-[118px] rounded-xl border-2 border-amber-300 bg-amber-200 px-3 py-2 text-center rotate-[-2deg] shadow-[0_8px_16px_-10px_rgba(217,119,6,0.65)]">
                          <p className="font-display font-extrabold text-lg leading-none text-zinc-950">
                            {selectedAlgorithm.complexity?.time || "N/A"}
                          </p>
                          <p className="mt-1 font-space font-bold text-[9px] leading-none tracking-[0.16em] uppercase text-zinc-700">
                            Time Complexity
                          </p>
                        </div>

                        <div className="min-w-[118px] rounded-xl border-2 border-emerald-300 bg-emerald-100 px-3 py-2 text-center rotate-[1.5deg] shadow-[0_8px_16px_-10px_rgba(5,150,105,0.55)]">
                          <p className="font-display font-extrabold text-lg leading-none text-zinc-950">
                            {selectedAlgorithm.complexity?.space || "N/A"}
                          </p>
                          <p className="mt-1 font-space font-bold text-[9px] leading-none tracking-[0.16em] uppercase text-zinc-700">
                            Space Complexity
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <select
                        value={selectedTestCaseId}
                        onChange={(e) => setSelectedTestCaseId(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-zinc-300 text-xs font-space font-bold"
                      >
                        {(selectedAlgorithm.testCases || []).map((testCase) => (
                          <option key={testCase.id} value={testCase.id}>
                            {testCase.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex rounded-lg border border-zinc-300 overflow-hidden">
                        {availableLanguages.map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-2 text-xs font-space font-bold uppercase ${
                              language === lang
                                ? "bg-zinc-900 text-white"
                                : "bg-white text-zinc-700"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={visualizer.restart}
                          className="p-2 rounded-lg border border-zinc-300 hover:border-zinc-900"
                          title="Restart"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={visualizer.previous}
                          className="p-2 rounded-lg border border-zinc-300 hover:border-zinc-900"
                          title="Previous"
                        >
                          <SkipBack size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={
                            visualizer.isPlaying
                              ? visualizer.pause
                              : visualizer.play
                          }
                          className="p-2 rounded-lg border border-zinc-300 hover:border-zinc-900"
                          title={visualizer.isPlaying ? "Pause" : "Play"}
                        >
                          {visualizer.isPlaying ? (
                            <Pause size={15} />
                          ) : (
                            <Play size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={visualizer.next}
                          className="p-2 rounded-lg border border-zinc-300 hover:border-zinc-900"
                          title="Next"
                        >
                          <SkipForward size={15} />
                        </button>

                        <select
                          value={visualizer.speed}
                          onChange={(e) =>
                            visualizer.setSpeed(Number(e.target.value))
                          }
                          className="px-2 py-2 rounded-lg border border-zinc-300 text-xs font-space font-bold"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="rounded-2xl border-3 border-zinc-900 bg-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-600">
                          Visualization
                        </h3>
                        <p className="font-space font-bold text-[10px] text-zinc-500 tracking-widest uppercase">
                          Step {visualizer.currentStepIndex + 1}/
                          {visualizer.totalSteps || 1}
                        </p>
                      </div>

                      {stateArray ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {stateArray.map((value, idx) => {
                            const highlighted = highlightIndexes.has(idx);
                            return (
                              <div
                                key={`${idx}-${value}`}
                                className={`rounded-xl border px-3 py-4 text-center ${
                                  highlighted
                                    ? "bg-indigo-100 border-indigo-500"
                                    : "bg-zinc-50 border-zinc-300"
                                }`}
                              >
                                <p className="font-mono text-xs text-zinc-500">
                                  [{idx}]
                                </p>
                                <p className="font-space font-black text-lg text-zinc-900">
                                  {value}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <pre className="text-xs bg-zinc-950 text-zinc-100 rounded-xl p-3 overflow-auto">
                          {JSON.stringify(currentStep?.state || {}, null, 2)}
                        </pre>
                      )}

                      <div className="mt-4 rounded-xl bg-zinc-950 text-zinc-100 p-3">
                        <p className="font-space font-bold text-[10px] tracking-widest uppercase text-zinc-400 mb-2">
                          Explanation
                        </p>
                        <p className="font-sans text-xs leading-relaxed">
                          {currentStep?.explanation || "No step available."}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border-3 border-zinc-900 bg-zinc-950 text-zinc-100 p-4">
                      <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-400 mb-3">
                        {language.toUpperCase()} Implementation
                      </h3>
                      <div className="max-h-[440px] overflow-auto rounded-xl border border-zinc-800">
                        {codeLines.map((line, index) => {
                          const lineNumber = index + 1;
                          const active = lineNumber === activeLine;
                          return (
                            <div
                              key={lineNumber}
                              className={`grid grid-cols-[48px_1fr] text-xs font-mono ${
                                active ? "bg-indigo-900/60" : "bg-transparent"
                              }`}
                            >
                              <span className="px-2 py-1.5 text-right text-zinc-500 border-r border-zinc-800 select-none">
                                {lineNumber}
                              </span>
                              <span className="px-3 py-1.5 whitespace-pre">
                                {line}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
