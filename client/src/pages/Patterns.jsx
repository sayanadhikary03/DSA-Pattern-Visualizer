import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
} from "lucide-react";
import useVisualizer from "../hooks/useVisualizer";
import { algorithmCatalog } from "../algorithms/catalog";

const CPP_KEYWORDS = new Set([
  "if",
  "else",
  "for",
  "while",
  "return",
  "break",
  "continue",
  "const",
  "static",
  "using",
  "namespace",
  "class",
  "struct",
  "public",
  "private",
  "protected",
  "template",
  "typename",
  "switch",
  "case",
  "default",
  "new",
  "delete",
]);

const CPP_TYPES = new Set([
  "int",
  "long",
  "double",
  "float",
  "bool",
  "char",
  "void",
  "string",
  "vector",
  "size_t",
  "auto",
]);

const PY_KEYWORDS = new Set([
  "def",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "return",
  "in",
  "range",
  "True",
  "False",
  "None",
  "and",
  "or",
  "not",
  "class",
  "import",
  "from",
  "with",
  "as",
  "pass",
  "break",
  "continue",
]);

function renderHighlightedCodeLine(line, language) {
  const commentToken = language === "python" ? "#" : "//";
  const commentIndex = line.indexOf(commentToken);

  let codePart = line;
  let commentPart = "";

  if (commentIndex >= 0) {
    codePart = line.slice(0, commentIndex);
    commentPart = line.slice(commentIndex);
  }

  const tokens = codePart.match(
    /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|\b\d+(?:\.\d+)?\b|[A-Za-z_]\w*|\s+|.)/g,
  ) || [codePart];

  const rendered = tokens.map((token, i) => {
    let cls = "text-[#D4D4D4]";

    if (/^\s+$/.test(token)) {
      cls = "text-transparent";
    } else if (/^".*"$|^'.*'$/.test(token)) {
      cls = "text-[#CE9178]";
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      cls = "text-[#B5CEA8]";
    } else if (CPP_TYPES.has(token)) {
      cls = "text-[#4EC9B0]";
    } else if (CPP_KEYWORDS.has(token) || PY_KEYWORDS.has(token)) {
      cls = "text-[#569CD6]";
    } else if (/^[A-Za-z_]\w*$/.test(token)) {
      cls = "text-[#DCDCAA]";
    } else if (/^[{}()[\].,;:+\-*/%<>=!&|^~]+$/.test(token)) {
      cls = "text-[#C586C0]";
    }

    return (
      <span key={`${token}-${i}`} className={cls}>
        {token}
      </span>
    );
  });

  if (commentPart) {
    rendered.push(
      <span key="comment" className="text-[#6A9955]">
        {commentPart}
      </span>,
    );
  }

  return rendered;
}

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
  const [patternQuery, setPatternQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [customInputRaw, setCustomInputRaw] = useState("");
  const [customInputError, setCustomInputError] = useState("");
  const [customTestCase, setCustomTestCase] = useState(null);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

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

  const visibleAlgorithms = useMemo(() => {
    const q = patternQuery.trim().toLowerCase();
    if (!q) {
      return filteredAlgorithms;
    }
    return filteredAlgorithms.filter((algo) =>
      algo.name.toLowerCase().includes(q),
    );
  }, [filteredAlgorithms, patternQuery]);

  const groupedVisibleAlgorithms = useMemo(() => {
    return visibleAlgorithms.reduce((acc, algo) => {
      if (!acc[algo.category]) {
        acc[algo.category] = [];
      }
      acc[algo.category].push(algo);
      return acc;
    }, {});
  }, [visibleAlgorithms]);

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

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
    setCustomTestCase(null);
    setCustomInputRaw("");
    setCustomInputError("");
  }, [selectedAlgorithm?.id]);

  useEffect(() => {
    const firstTestCase = selectedAlgorithm?.testCases?.[0];
    if (!firstTestCase) {
      setSelectedTestCaseId("");
      return;
    }

    const exists = selectedAlgorithm.testCases.some(
      (t) => t.id === selectedTestCaseId,
    );
    const usingCustom =
      selectedTestCaseId === "__custom__" &&
      customTestCase &&
      customTestCase.algorithmId === selectedAlgorithm.id;

    if (!exists && !usingCustom) {
      setSelectedTestCaseId(firstTestCase.id);
    }
  }, [selectedAlgorithm, selectedTestCaseId, customTestCase]);

  const selectedTestCase = useMemo(() => {
    if (!selectedAlgorithm) {
      return null;
    }

    if (
      selectedTestCaseId === "__custom__" &&
      customTestCase &&
      customTestCase.algorithmId === selectedAlgorithm.id
    ) {
      return customTestCase;
    }

    return (
      selectedAlgorithm.testCases?.find((t) => t.id === selectedTestCaseId) ||
      selectedAlgorithm.testCases?.[0] ||
      null
    );
  }, [selectedAlgorithm, selectedTestCaseId, customTestCase]);

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

  const statusLabel = visualizer.isPlaying ? "Running" : "Paused";
  const activeCategory = selectedAlgorithm?.category || "Patterns";

  const handleCustomInputSelect = () => {
    if (!selectedAlgorithm) {
      return;
    }

    const raw = customInputRaw.trim();
    if (!raw) {
      setCustomInputError("Enter an input first.");
      return;
    }

    try {
      let parsed;
      if (raw.startsWith("[") || raw.startsWith("{")) {
        parsed = JSON.parse(raw);
      } else {
        parsed = raw
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => Number(v));
      }

      const nextCustomTestCase = {
        id: "__custom__",
        algorithmId: selectedAlgorithm.id,
        name: "Custom Input",
        input: parsed,
        expectedOutput: "Computed at runtime",
      };

      setCustomTestCase(nextCustomTestCase);
      setSelectedTestCaseId("__custom__");
      setCustomInputError("");
      visualizer.restart();
    } catch {
      setCustomInputError(
        "Invalid input. Use JSON array/object or comma numbers.",
      );
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCodeExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
            <aside className="lg:col-span-3 rounded-2xl border-3 border-zinc-900 bg-white p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-space font-extrabold text-[11px] tracking-widest text-zinc-700 uppercase">
                  Patterns
                </p>
                <ChevronDown size={14} className="text-zinc-500" />
              </div>

              <div className="relative mb-4">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  value={patternQuery}
                  onChange={(e) => setPatternQuery(e.target.value)}
                  placeholder="Search patterns..."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-9 pr-3 py-2 text-xs font-sans text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((name) => {
                  const isActive = selectedCategory === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedCategory(name)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-space font-bold tracking-wider uppercase border transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-800"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 max-h-[620px] overflow-auto pr-1">
                {Object.entries(groupedVisibleAlgorithms).map(
                  ([categoryName, algos]) => (
                    <div key={categoryName}>
                      <button
                        type="button"
                        onClick={() => toggleGroup(categoryName)}
                        className="w-full flex items-center justify-between mb-1.5"
                      >
                        <p className="font-space font-bold text-xs text-zinc-800">
                          {categoryName}
                        </p>
                        <ChevronDown
                          size={13}
                          className={`text-zinc-400 transition-transform ${collapsedGroups[categoryName] ? "-rotate-90" : "rotate-0"}`}
                        />
                      </button>

                      {!collapsedGroups[categoryName] ? (
                        <div className="space-y-1.5 pl-1 border-l border-zinc-200">
                          {algos.map((algo) => {
                            const isActive = selectedAlgorithm?.id === algo.id;
                            return (
                              <button
                                key={algo.id}
                                type="button"
                                onClick={() => {
                                  setSelectedAlgorithmId(algo.id);
                                  setSelectedCategory(algo.category);
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border text-xs transition-colors ${
                                  isActive
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-white border-zinc-300 hover:border-zinc-800"
                                }`}
                              >
                                <p
                                  className={`font-space font-bold ${isActive ? "text-white" : "text-zinc-900"}`}
                                >
                                  {algo.name}
                                </p>
                                <p
                                  className={`font-sans text-[11px] ${isActive ? "text-indigo-100" : "text-zinc-500"}`}
                                >
                                  {algo.complexity?.time || ""}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ),
                )}
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
                  <div className="flex items-center gap-3 text-[10px] font-space font-extrabold tracking-widest text-indigo-600 uppercase">
                    <span>{activeCategory}</span>
                    <span className="text-zinc-400">&gt;</span>
                    <span className="text-zinc-700">
                      {selectedAlgorithm.name}
                    </span>
                  </div>

                  <div className="rounded-2xl border-3 border-zinc-900 bg-white p-4 md:p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0 max-w-2xl">
                        <h2 className="font-display font-extrabold text-2xl text-zinc-950">
                          {selectedAlgorithm.name}
                        </h2>
                        <p className="font-sans text-sm text-zinc-600 mt-1">
                          {selectedAlgorithm.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 lg:pl-3">
                        <div className="flex items-start justify-end gap-4">
                          <div className="w-[128px] rounded-xl border-2 border-amber-300 bg-amber-200 px-3 py-2 text-center -rotate-2 shadow-[0_8px_16px_-10px_rgba(217,119,6,0.65)]">
                            <p className="font-display font-extrabold text-[1.45rem] leading-none text-zinc-950">
                              {selectedAlgorithm.complexity?.time || "N/A"}
                            </p>
                            <p className="mt-1 font-space font-bold text-[8px] leading-none tracking-[0.18em] uppercase text-zinc-700">
                              Time Complexity
                            </p>
                          </div>

                          <div className="w-[128px] rounded-xl border-2 border-emerald-300 bg-emerald-100 px-3 py-2 text-center rotate-2 shadow-[0_8px_16px_-10px_rgba(5,150,105,0.55)]">
                            <p className="font-display font-extrabold text-[1.45rem] leading-none text-zinc-950">
                              {selectedAlgorithm.complexity?.space || "N/A"}
                            </p>
                            <p className="mt-1 font-space font-bold text-[8px] leading-none tracking-[0.18em] uppercase text-zinc-700">
                              Space Complexity
                            </p>
                          </div>

                          <div className="min-w-[210px] rounded-xl border border-zinc-200 bg-white px-4 py-3">
                            <div className="flex items-center justify-between text-[10px] font-space font-bold tracking-widest uppercase text-zinc-500">
                              <span>Step</span>
                              <span>Status</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <p className="font-display font-extrabold text-2xl text-zinc-950">
                                {visualizer.currentStepIndex + 1} /{" "}
                                {visualizer.totalSteps || 1}
                              </p>
                              <p
                                className={`font-space font-bold text-[11px] uppercase ${visualizer.isPlaying ? "text-indigo-600" : "text-zinc-500"}`}
                              >
                                {statusLabel}
                              </p>
                            </div>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all"
                                style={{
                                  width: `${Math.max(
                                    6,
                                    ((visualizer.currentStepIndex + 1) /
                                      (visualizer.totalSteps || 1)) *
                                      100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="w-[210px] flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={visualizer.restart}
                            className="p-1.5 rounded-md border border-zinc-300 hover:border-zinc-900"
                            title="Restart"
                          >
                            <RotateCcw size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={visualizer.previous}
                            className="p-1.5 rounded-md border border-zinc-300 hover:border-zinc-900"
                            title="Previous"
                          >
                            <SkipBack size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={
                              visualizer.isPlaying
                                ? visualizer.pause
                                : visualizer.play
                            }
                            className="p-1.5 rounded-md border border-zinc-300 hover:border-zinc-900"
                            title={visualizer.isPlaying ? "Pause" : "Play"}
                          >
                            {visualizer.isPlaying ? (
                              <Pause size={13} />
                            ) : (
                              <Play size={13} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={visualizer.next}
                            className="p-1.5 rounded-md border border-zinc-300 hover:border-zinc-900"
                            title="Next"
                          >
                            <SkipForward size={13} />
                          </button>

                          <select
                            value={visualizer.speed}
                            onChange={(e) =>
                              visualizer.setSpeed(Number(e.target.value))
                            }
                            className="ml-auto px-1.5 py-1.5 rounded-md border border-zinc-300 text-[10px] font-space font-bold"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1.0x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2.0x</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
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
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="rounded-2xl border-3 border-zinc-900 bg-zinc-950 text-zinc-100 p-4 order-2 xl:order-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-400">
                          {language.toUpperCase()} Implementation
                        </h3>

                        <button
                          type="button"
                          onClick={() => setIsCodeExpanded((prev) => !prev)}
                          className="p-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                          title={
                            isCodeExpanded
                              ? "Collapse code panel"
                              : "Expand code panel"
                          }
                        >
                          {isCodeExpanded ? (
                            <Minimize2 size={14} />
                          ) : (
                            <Maximize2 size={14} />
                          )}
                        </button>
                      </div>

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
                                {renderHighlightedCodeLine(line, language)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border-3 border-zinc-900 bg-white p-4 order-1 xl:order-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-600">
                          Visualization
                        </h3>
                        <select
                          value={visualizer.isPlaying ? "auto" : "manual"}
                          onChange={(e) => {
                            if (e.target.value === "auto") {
                              visualizer.play();
                            } else {
                              visualizer.pause();
                            }
                          }}
                          className="px-2 py-1 rounded-md border border-zinc-300 text-[10px] font-space font-bold uppercase"
                        >
                          <option value="manual">Manual</option>
                          <option value="auto">Auto Play</option>
                        </select>
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
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 rounded-2xl border-3 border-zinc-900 bg-white p-4">
                      <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-600 mb-3">
                        Test Cases
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(selectedAlgorithm.testCases || [])
                          .slice(0, 2)
                          .map((testCase) => {
                            const isSelected =
                              testCase.id === selectedTestCaseId;
                            return (
                              <div
                                key={testCase.id}
                                className={`rounded-xl border p-3 ${
                                  isSelected
                                    ? "border-indigo-400 bg-indigo-50"
                                    : "border-zinc-200 bg-white"
                                }`}
                              >
                                <p className="font-space font-bold text-xs text-zinc-800">
                                  {testCase.name}
                                </p>
                                <p className="mt-2 font-mono text-[10px] text-zinc-500 break-all">
                                  {JSON.stringify(testCase.input)}
                                </p>
                                <p className="mt-2 font-space font-bold text-[10px] text-zinc-500 uppercase tracking-wider">
                                  Expected Output
                                </p>
                                <p className="mt-1 font-mono text-[10px] text-zinc-700 break-all">
                                  {JSON.stringify(testCase.expectedOutput)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTestCaseId(testCase.id);
                                    visualizer.restart();
                                  }}
                                  className="mt-3 w-full rounded-lg bg-indigo-600 text-white py-1.5 text-[10px] font-space font-bold tracking-widest uppercase hover:bg-indigo-700"
                                >
                                  Select
                                </button>
                              </div>
                            );
                          })}

                        <div
                          className={`rounded-xl border p-3 ${selectedTestCaseId === "__custom__" ? "border-indigo-400 bg-indigo-50" : "border-zinc-200 bg-zinc-50"}`}
                        >
                          <p className="font-space font-bold text-xs text-zinc-800">
                            Custom Input
                          </p>
                          <input
                            type="text"
                            value={customInputRaw}
                            onChange={(e) => setCustomInputRaw(e.target.value)}
                            placeholder="e.g. [4, 2, 9, 1]"
                            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-[10px] font-mono text-zinc-700"
                          />
                          <p className="mt-2 font-space font-bold text-[10px] text-zinc-500 uppercase tracking-wider">
                            Expected Output
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-zinc-700">
                            Computed at runtime
                          </p>
                          {customInputError ? (
                            <p className="mt-1 text-[10px] font-sans text-rose-600">
                              {customInputError}
                            </p>
                          ) : null}
                          <button
                            type="button"
                            onClick={handleCustomInputSelect}
                            className="mt-3 w-full rounded-lg bg-indigo-600 text-white py-1.5 text-[10px] font-space font-bold tracking-widest uppercase hover:bg-indigo-700"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border-3 border-zinc-900 bg-white p-4">
                      <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-600 mb-3">
                        Explanation
                      </h3>
                      <p className="font-sans text-sm text-zinc-700 leading-relaxed">
                        {currentStep?.explanation || "No step available."}
                      </p>
                      <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                        <p className="font-space font-bold text-[10px] tracking-widest uppercase text-indigo-700 mb-1">
                          Tip
                        </p>
                        <p className="font-sans text-xs text-indigo-900/90">
                          In Bubble Sort, the largest element bubbles toward the
                          end on each pass.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
                      <button
                        type="button"
                        onClick={visualizer.restart}
                        className="rounded-lg border border-zinc-300 bg-white py-2 text-[11px] font-space font-bold tracking-widest uppercase hover:border-zinc-900"
                      >
                        First
                      </button>
                      <button
                        type="button"
                        onClick={visualizer.previous}
                        className="rounded-lg border border-zinc-300 bg-white py-2 text-[11px] font-space font-bold tracking-widest uppercase hover:border-zinc-900"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={
                          visualizer.isPlaying
                            ? visualizer.pause
                            : visualizer.play
                        }
                        className="rounded-full h-11 w-11 justify-self-center border-2 border-indigo-600 bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
                        title={visualizer.isPlaying ? "Pause" : "Play"}
                      >
                        {visualizer.isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={visualizer.next}
                        className="rounded-lg border border-zinc-300 bg-white py-2 text-[11px] font-space font-bold tracking-widest uppercase hover:border-zinc-900"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          visualizer.goTo(
                            Math.max(0, visualizer.totalSteps - 1),
                          )
                        }
                        className="rounded-lg border border-zinc-300 bg-white py-2 text-[11px] font-space font-bold tracking-widest uppercase hover:border-zinc-900"
                      >
                        Last
                      </button>
                      <select
                        value={visualizer.speed}
                        onChange={(e) =>
                          visualizer.setSpeed(Number(e.target.value))
                        }
                        className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-[11px] font-space font-bold"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1.0x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2.0x</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {isCodeExpanded ? (
        <div className="fixed left-4 top-4 bottom-4 z-[140] w-[58vw] min-w-[520px] max-w-[980px] rounded-2xl border-3 border-zinc-900 bg-zinc-950 text-zinc-100 shadow-[16px_18px_0px_rgba(18,18,20,0.7)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-400">
              {language.toUpperCase()} Implementation (Expanded)
            </h3>

            <button
              type="button"
              onClick={() => setIsCodeExpanded(false)}
              className="p-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
              title="Collapse code panel"
            >
              <Minimize2 size={14} />
            </button>
          </div>

          <div
            onWheel={(event) => {
              event.stopPropagation();
            }}
            className="h-[calc(100%-34px)] overflow-auto overscroll-contain rounded-xl border border-zinc-800"
          >
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const active = lineNumber === activeLine;
              return (
                <div
                  key={`expanded-${lineNumber}`}
                  className={`grid grid-cols-[54px_1fr] text-[13px] font-mono ${
                    active ? "bg-indigo-900/60" : "bg-transparent"
                  }`}
                >
                  <span className="px-2 py-1.5 text-right text-zinc-500 border-r border-zinc-800 select-none">
                    {lineNumber}
                  </span>
                  <span className="px-3 py-1.5 whitespace-pre">
                    {renderHighlightedCodeLine(line, language)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
