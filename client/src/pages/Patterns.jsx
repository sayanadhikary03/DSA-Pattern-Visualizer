import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Maximize2,
  Minimize2,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  RotateCcw,
  Search,
  SkipBack,
  SkipForward,
  Sun,
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

export default function Patterns({ theme, onToggleTheme }) {
  const isDark = theme === "dark";
  const [searchParams] = useSearchParams();
  const requestedCategory = slugify(searchParams.get("category") || "");
  const [patternQuery, setPatternQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [customInputRaw, setCustomInputRaw] = useState("");
  const [customInputError, setCustomInputError] = useState("");
  const [customTestCase, setCustomTestCase] = useState(null);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
  const isSortingVisualization =
    selectedAlgorithm?.category?.toLowerCase() === "sorting";
  const hasNumericStateArray =
    Array.isArray(stateArray) &&
    stateArray.length > 0 &&
    stateArray.every(
      (value) => typeof value === "number" && Number.isFinite(value),
    );
  const maxBarValue = hasNumericStateArray
    ? Math.max(...stateArray.map((value) => Math.abs(value)), 1)
    : 1;
  const visualizationType = selectedAlgorithm?.visualizationType || "array";

  const renderVisualizationContent = () => {
    const state = currentStep?.state || {};

    if (
      visualizationType === "linked-list" &&
      Array.isArray(state.nodes) &&
      state.nodes.length
    ) {
      const isCircular = state.listType === "circular";
      const isDoubly = state.listType === "doubly";
      const pointers = state.pointers || {};
      const newNodeValue = state.newNodeValue;

      // Extract pointers per node index
      const topBadges = {};
      const bottomBadges = {};

      const addBadge = (idx, label, type, position) => {
        if (idx === undefined || idx === null || idx < 0) return;
        const target = position === "top" ? topBadges : bottomBadges;
        if (!target[idx]) target[idx] = [];
        target[idx].push({ label, type });
      };

      if (pointers.head !== undefined) addBadge(pointers.head, "head", "cyan", "top");
      if (pointers.next !== undefined && pointers.next >= 0) addBadge(pointers.next, "next", "amber", "top");
      if (pointers.newNode !== undefined && typeof pointers.newNode === "number") addBadge(pointers.newNode, "newNode", "rose", "top");

      if (pointers.curr !== undefined && pointers.curr >= 0) addBadge(pointers.curr, "curr", "sky", "bottom");
      if (pointers.current !== undefined && pointers.current >= 0) addBadge(pointers.current, "curr", "sky", "bottom");
      if (pointers.prev !== undefined && pointers.prev >= 0) addBadge(pointers.prev, "prev", "emerald", "bottom");
      if (pointers.temp !== undefined && pointers.temp >= 0) addBadge(pointers.temp, "temp", "purple", "bottom");
      if (pointers.last !== undefined && pointers.last >= 0) addBadge(pointers.last, "last", "purple", "bottom");

      const badgeStyles = {
        cyan: "bg-cyan-400 text-zinc-950 shadow-cyan-400/40",
        amber: "bg-amber-400 text-zinc-950 shadow-amber-400/40",
        rose: "bg-rose-500 text-white shadow-rose-500/40",
        sky: "bg-sky-400 text-zinc-950 shadow-sky-400/40",
        emerald: "bg-emerald-400 text-zinc-950 shadow-emerald-400/40",
        purple: "bg-purple-400 text-zinc-950 shadow-purple-400/40",
      };

      return (
        <div className={`rounded-2xl border-3 p-4 overflow-auto ${isDark ? "border-zinc-800 bg-zinc-950/90 text-zinc-100" : "border-zinc-900 bg-zinc-950 text-zinc-100"}`}>
          {newNodeValue !== undefined && newNodeValue !== null ? (
            <div className="mb-4 flex items-center gap-2">
              <span className="font-space font-bold text-xs uppercase tracking-wider text-rose-400">
                Created New Node:
              </span>
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white border-2 border-rose-300 font-space font-black flex items-center justify-center text-sm shadow-lg shadow-rose-500/30 animate-pulse">
                {newNodeValue}
              </div>
            </div>
          ) : null}

          {/* Node Visualization Diagram with Floating Pointer Badges */}
          <div className="py-6 flex items-center justify-center gap-3 min-w-max">
            {state.nodes.map((nodeValue, idx) => {
              const active =
                idx === state.current ||
                idx === pointers.curr ||
                idx === pointers.newNode ||
                highlightIndexes.has(idx);

              const topList = topBadges[idx] || [];
              const bottomList = bottomBadges[idx] || [];

              return (
                <React.Fragment key={`${idx}-${nodeValue}`}>
                  <div className="flex flex-col items-center relative min-w-[70px]">
                    {/* Top Pointer Badges */}
                    <div className="h-7 flex flex-wrap items-center justify-center gap-1 mb-1">
                      {topList.map((b, bIdx) => (
                        <span
                          key={`top-${bIdx}`}
                          className={`px-2 py-0.5 rounded-md font-space font-extrabold text-[10px] uppercase tracking-wider shadow-sm ${badgeStyles[b.type]}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>

                    {/* Node Core Circle / Box */}
                    <div
                      className={`w-14 h-14 rounded-full border-3 flex items-center justify-center font-space font-black text-lg shadow-md transition-all duration-300 ${
                        active
                          ? "bg-indigo-600 border-indigo-300 text-white shadow-indigo-500/50 scale-110 ring-4 ring-indigo-500/30"
                          : (isDark ? "bg-zinc-900 border-zinc-700 text-zinc-100" : "bg-zinc-900 border-zinc-700 text-white")
                      }`}
                    >
                      {nodeValue}
                    </div>

                    {/* Memory index tag */}
                    <span className="mt-1 font-mono text-[10px] text-zinc-500 font-semibold">
                      #{idx}
                    </span>

                    {/* Bottom Pointer Badges */}
                    <div className="h-7 flex flex-wrap items-center justify-center gap-1 mt-1">
                      {bottomList.map((b, bIdx) => (
                        <span
                          key={`bot-${bIdx}`}
                          className={`px-2 py-0.5 rounded-md font-space font-extrabold text-[10px] uppercase tracking-wider shadow-sm ${badgeStyles[b.type]}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connectors between nodes */}
                  {idx < state.nodes.length - 1 ? (
                    <div className="flex flex-col items-center justify-center px-1">
                      <span className="font-mono text-xs font-bold text-cyan-400 tracking-tighter">
                        {isDoubly ? "NEXT ⇄" : "NEXT →"}
                      </span>
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}

            {/* End / Loop indicator */}
            <div className="flex flex-col items-center justify-center pl-2">
              {isCircular ? (
                <span className="px-3 py-1.5 rounded-xl border-2 border-indigo-400 bg-indigo-950/80 text-indigo-300 font-space font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20">
                  ↺ HEAD
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500 font-mono font-bold text-xs">
                  NULL
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (visualizationType === "stack") {
      const stackValues = Array.isArray(state.stack)
        ? state.stack
        : Array.isArray(state.stackIndices) && Array.isArray(state.array)
          ? state.stackIndices.map((idx) => state.array[idx])
          : [];

      return (
        <div className={`rounded-xl border p-3 ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
          <div className="h-44 flex flex-col-reverse items-center gap-1 overflow-auto">
            {stackValues.length ? (
              stackValues.map((value, idx) => {
                const isTop = idx === stackValues.length - 1;
                return (
                  <div
                    key={`${idx}-${value}`}
                    className={`w-24 h-9 rounded-md border flex items-center justify-center font-space font-black text-sm shadow-sm ${
                      isTop
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30"
                        : (isDark ? "bg-slate-100 border-slate-300 text-zinc-950" : "bg-white border-zinc-300 text-zinc-900")
                    }`}
                  >
                    {value}
                  </div>
                );
              })
            ) : (
              <p className={`font-space text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Stack is empty</p>
            )}
          </div>
          <p className={`mt-2 text-center font-space font-bold text-[10px] tracking-widest uppercase ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Top
          </p>
        </div>
      );
    }

    if (visualizationType === "tree" && Array.isArray(state.levels)) {
      return (
        <div className={`rounded-xl border p-3 space-y-2 ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
          {state.levels.map((level, levelIdx) => (
            <div
              key={`level-${levelIdx}`}
              className="flex items-center justify-center gap-2"
            >
              {level.map((nodeValue, nodeIdx) => {
                const flatIndex = Math.pow(2, levelIdx) - 1 + nodeIdx;
                const active =
                  flatIndex === state.currentNode ||
                  highlightIndexes.has(flatIndex);
                return (
                  <div
                    key={`${levelIdx}-${nodeIdx}-${nodeValue}`}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center font-space font-black text-xs shadow-sm ${
                      active
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30"
                        : (isDark ? "bg-slate-100 border-slate-300 text-zinc-950" : "bg-white border-zinc-300 text-zinc-900")
                    }`}
                  >
                    {nodeValue}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }

    if (
      visualizationType === "graph" &&
      Array.isArray(state.graphNodes) &&
      Array.isArray(state.edges)
    ) {
      const width = 360;
      const height = 260;
      const positions = state.positions || {};
      return (
        <div className={`rounded-xl border p-3 overflow-auto ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[220px]"
            role="img"
            aria-label="Graph visualization"
          >
            {state.edges.map((edge, idx) => {
              const from = positions[edge.from] || { x: 20, y: 20 };
              const to = positions[edge.to] || { x: 40, y: 40 };
              const active =
                Array.isArray(state.activeEdge) &&
                ((state.activeEdge[0] === edge.from &&
                  state.activeEdge[1] === edge.to) ||
                  (state.activeEdge[0] === edge.to &&
                    state.activeEdge[1] === edge.from));

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={active ? "#6366f1" : (isDark ? "#64748b" : "#a1a1aa")}
                    strokeWidth={active ? 3 : 1.5}
                  />
                  {Number.isFinite(edge.weight) ? (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      textAnchor="middle"
                      className={`text-[10px] ${isDark ? "fill-slate-300 font-bold" : "fill-zinc-600"}`}
                    >
                      {edge.weight}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {state.graphNodes.map((node) => {
              const pos = positions[node] || { x: 30, y: 30 };
              const isCurrent = node === state.currentNode;
              const isVisited =
                Array.isArray(state.visited) && state.visited[node];
              const fill = isCurrent
                ? "#6366f1"
                : isVisited
                  ? "#818cf8"
                  : (isDark ? "#f1f5f9" : "#ffffff");
              const stroke = isCurrent || isVisited ? "#6366f1" : (isDark ? "#94a3b8" : "#a1a1aa");

              return (
                <g key={`node-${node}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={15}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    className={`text-[10px] font-extrabold ${isCurrent || isVisited ? "fill-white" : (isDark ? "fill-slate-950" : "fill-zinc-700")}`}
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (visualizationType.startsWith("dp") && Array.isArray(state.grid)) {
      return (
        <div className={`rounded-xl border p-3 overflow-auto ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
          <div
            className="inline-grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${state.grid[0]?.length || 1}, minmax(0, 1fr))`,
            }}
          >
            {state.grid.flatMap((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isActive =
                  Array.isArray(state.activeCell) &&
                  state.activeCell[0] === rowIdx &&
                  state.activeCell[1] === colIdx;
                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={`w-10 h-10 rounded-md border flex items-center justify-center font-space font-black text-xs shadow-sm ${
                      isActive
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30"
                        : (isDark ? "bg-slate-100 border-slate-300 text-zinc-950" : "bg-white border-zinc-300 text-zinc-900")
                    }`}
                  >
                    {cell === Number.POSITIVE_INFINITY ? "∞" : cell}
                  </div>
                );
              }),
            )}
          </div>
        </div>
      );
    }

    if (visualizationType === "dp-array" && Array.isArray(state.dp)) {
      return (
        <div className={`rounded-xl border p-3 ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {state.dp.map((value, idx) => {
              const isActive = idx === state.activeIndex;
              return (
                <div
                  key={`dp-${idx}-${value}`}
                  className={`rounded-lg border px-2 py-2 text-center shadow-sm ${
                    isActive
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30"
                      : (isDark ? "bg-slate-100 border-slate-300 text-zinc-950" : "bg-white border-zinc-300 text-zinc-900")
                  }`}
                >
                  <p
                    className={`font-mono text-[10px] font-bold ${isActive ? "text-indigo-100" : (isDark ? "text-slate-600" : "text-zinc-500")}`}
                  >
                    [{idx}]
                  </p>
                  <p className="font-space font-black text-sm">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (stateArray) {
      if (isSortingVisualization && hasNumericStateArray) {
        return (
          <div className={`rounded-xl border p-3 ${isDark ? "border-zinc-800 bg-zinc-950/80" : "border-zinc-200 bg-zinc-50"}`}>
            <div className="h-44 sm:h-52 flex items-end gap-2">
              {stateArray.map((value, idx) => {
                const highlighted = highlightIndexes.has(idx);
                const barHeight = Math.max(
                  14,
                  (Math.abs(value) / maxBarValue) * 100,
                );

                return (
                  <div
                    key={`${idx}-${value}`}
                    className="h-full flex-1 min-w-0 flex flex-col items-center justify-end"
                  >
                    <p className={`mb-1 font-space font-black text-sm leading-none ${isDark ? "text-slate-100" : "text-zinc-900"}`}>
                      {value}
                    </p>
                    <div
                      className={`w-full rounded-t-lg border-t border-x transition-all duration-300 ${
                        highlighted
                          ? "bg-indigo-500 border-indigo-400 shadow-md shadow-indigo-500/30"
                          : (isDark ? "bg-slate-300 border-slate-400" : "bg-zinc-300 border-zinc-400")
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                    <p className={`mt-1 font-mono text-[10px] ${isDark ? "text-slate-400" : "text-zinc-500"}`}>
                      [{idx}]
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {stateArray.map((value, idx) => {
            const highlighted = highlightIndexes.has(idx);
            return (
              <div
                key={`${idx}-${value}`}
                className={`rounded-xl border px-3 py-4 text-center shadow-sm transition-all duration-200 ${
                  highlighted
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30 ring-2 ring-indigo-400/40 scale-105"
                    : (isDark ? "bg-slate-100 border-slate-300 text-zinc-950" : "bg-zinc-50 border-zinc-300 text-zinc-900")
                }`}
              >
                <p className={`font-mono text-xs font-bold ${
                  highlighted
                    ? "text-indigo-100"
                    : (isDark ? "text-slate-600" : "text-zinc-500")
                }`}>
                  [{idx}]
                </p>
                <p className={`font-space font-black text-lg ${
                  highlighted
                    ? "text-white"
                    : (isDark ? "text-zinc-950" : "text-zinc-900")
                }`}>
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <pre className={`text-xs rounded-xl p-3 overflow-auto ${
        isDark ? "bg-zinc-950 border border-zinc-800 text-zinc-100" : "bg-zinc-950 text-zinc-100"
      }`}>
        {JSON.stringify(currentStep?.state || {}, null, 2)}
      </pre>
    );
  };

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
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "theme-dark bg-[#0b0f19] text-zinc-100" : "theme-light bg-[#FCF9F3] text-zinc-900"}`}>
      <section className="w-full px-6 md:px-10 lg:px-12 py-8 md:py-10">
        <div className="w-full max-w-[1680px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className={`font-space font-bold text-xs tracking-widest uppercase ${isDark ? "text-indigo-400" : "text-zinc-500"}`}>
                Implementation + Visualization
              </p>
              <h1 className={`font-display font-extrabold text-3xl md:text-4xl tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
                Explore Patterns
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className={`px-3 py-2 rounded-xl border-2 flex items-center gap-2 font-space font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100 hover:border-zinc-500 shadow-md"
                    : "bg-white border-zinc-900 text-zinc-900 hover:bg-zinc-100 shadow-md"
                }`}
                title={isSidebarCollapsed ? "Expand Patterns Sidebar" : "Collapse Patterns Sidebar"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                <span className="hidden sm:inline">
                  {isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className={`p-2.5 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-amber-300 hover:border-zinc-500 shadow-md"
                    : "bg-white border-zinc-900 text-indigo-700 hover:bg-zinc-100 shadow-md"
                }`}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-space font-bold text-xs tracking-widest uppercase transition-colors ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-500"
                    : "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <ArrowLeft size={14} />
                Back to Home
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">
            <aside className={`${
              isSidebarCollapsed ? "lg:col-span-1 flex flex-col items-center py-4" : "lg:col-span-3"
            } rounded-2xl border-3 p-4 lg:p-5 transition-all duration-300 ${
              isDark ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-white text-zinc-900"
            }`}>
              {isSidebarCollapsed ? (
                <div className="flex flex-col items-center gap-4 py-2 w-full">
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(false)}
                    className={`p-2.5 rounded-xl border-2 transition-all duration-200 ${
                      isDark
                        ? "border-indigo-500/50 bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900"
                        : "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                    title="Expand Patterns Sidebar"
                  >
                    <PanelLeftOpen size={18} />
                  </button>
                  <div className="my-2 border-b w-full border-zinc-700/50" />
                  <span className={`text-[10px] font-space font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 ${
                    isDark ? "text-indigo-400" : "text-zinc-600"
                  }`}>
                    {selectedCategory} Sidebar
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`font-space font-extrabold text-[11px] tracking-widest uppercase ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      Patterns
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                      title="Collapse Sidebar"
                    >
                      <PanelLeftClose size={16} />
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <Search
                      size={14}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-zinc-400" : "text-zinc-400"}`}
                    />
                    <input
                      value={patternQuery}
                      onChange={(e) => setPatternQuery(e.target.value)}
                      placeholder="Search patterns..."
                      className={`w-full rounded-xl border pl-9 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 ${
                        isDark
                          ? "border-zinc-700 bg-zinc-800/80 text-zinc-100 placeholder:text-zinc-500 focus:ring-indigo-500"
                          : "border-zinc-300 bg-zinc-50 text-zinc-700 placeholder:text-zinc-400 focus:ring-indigo-300"
                      }`}
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
                              ? (isDark ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-900 text-white border-zinc-900")
                              : (isDark ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500" : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-800")
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
                            <p className={`font-space font-bold text-xs ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                              {categoryName}
                            </p>
                            <ChevronDown
                              size={13}
                              className={`transition-transform ${isDark ? "text-zinc-400" : "text-zinc-400"} ${collapsedGroups[categoryName] ? "-rotate-90" : "rotate-0"}`}
                            />
                          </button>

                          {!collapsedGroups[categoryName] ? (
                            <div className={`space-y-1.5 pl-1 border-l ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
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
                                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                                        : (isDark
                                            ? "bg-zinc-800/60 border-zinc-700/80 hover:bg-zinc-800 hover:border-zinc-600"
                                            : "bg-white border-zinc-300 hover:border-zinc-800")
                                    }`}
                                  >
                                    <p
                                      className={`font-space font-bold ${
                                        isActive
                                          ? "text-white"
                                          : (isDark ? "text-zinc-200" : "text-zinc-900")
                                      }`}
                                    >
                                      {algo.name}
                                    </p>
                                    <p
                                      className={`font-sans text-[11px] ${
                                        isActive
                                          ? "text-indigo-100"
                                          : (isDark ? "text-zinc-400" : "text-zinc-500")
                                      }`}
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
                </>
              )}
            </aside>

            <div className={`${isSidebarCollapsed ? "lg:col-span-11" : "lg:col-span-9"} space-y-4 transition-all duration-300`}>
              {!selectedAlgorithm ? (
                <div className={`rounded-2xl border-3 p-6 ${
                  isDark ? "border-zinc-800 bg-zinc-900 text-zinc-100" : "border-zinc-900 bg-white text-zinc-900"
                }`}>
                  <p className={`font-sans text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    No implementation is available for this category yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className={`flex items-center gap-3 text-[10px] font-space font-extrabold tracking-widest uppercase ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                    <span>{activeCategory}</span>
                    <span className={isDark ? "text-zinc-600" : "text-zinc-400"}>&gt;</span>
                    <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>
                      {selectedAlgorithm.name}
                    </span>
                  </div>

                  <div className={`rounded-2xl border-3 p-4 md:p-5 transition-colors ${
                    isDark ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-white text-zinc-900"
                  }`}>
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0 max-w-2xl">
                        <h2 className={`font-display font-extrabold text-2xl ${isDark ? "text-white" : "text-zinc-950"}`}>
                          {selectedAlgorithm.name}
                        </h2>
                        <p className={`font-sans text-sm mt-1 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                          {selectedAlgorithm.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 lg:pl-3">
                        <div className="flex items-start justify-end gap-4">
                          <div className={`w-[128px] rounded-xl border-2 px-3 py-2 text-center -rotate-2 shadow-md ${
                            isDark
                              ? "border-amber-500/50 bg-amber-950/70 text-amber-200 shadow-[0_8px_16px_-10px_rgba(245,158,11,0.3)]"
                              : "border-amber-300 bg-amber-200 text-zinc-950 shadow-[0_8px_16px_-10px_rgba(217,119,6,0.65)]"
                          }`}>
                            <p className="font-display font-extrabold text-[1.45rem] leading-none">
                              {selectedAlgorithm.complexity?.time || "N/A"}
                            </p>
                            <p className={`mt-1 font-space font-bold text-[8px] leading-none tracking-[0.18em] uppercase ${
                              isDark ? "text-amber-300/80" : "text-zinc-700"
                            }`}>
                              Time Complexity
                            </p>
                          </div>

                          <div className={`w-[128px] rounded-xl border-2 px-3 py-2 text-center rotate-2 shadow-md ${
                            isDark
                              ? "border-emerald-500/50 bg-emerald-950/70 text-emerald-200 shadow-[0_8px_16px_-10px_rgba(16,185,129,0.3)]"
                              : "border-emerald-300 bg-emerald-100 text-zinc-950 shadow-[0_8px_16px_-10px_rgba(5,150,105,0.55)]"
                          }`}>
                            <p className="font-display font-extrabold text-[1.45rem] leading-none">
                              {selectedAlgorithm.complexity?.space || "N/A"}
                            </p>
                            <p className={`mt-1 font-space font-bold text-[8px] leading-none tracking-[0.18em] uppercase ${
                              isDark ? "text-emerald-300/80" : "text-zinc-700"
                            }`}>
                              Space Complexity
                            </p>
                          </div>

                          <div className={`min-w-[210px] rounded-xl border px-4 py-3 ${
                            isDark ? "border-zinc-800 bg-zinc-950/70" : "border-zinc-200 bg-white"
                          }`}>
                            <div className={`flex items-center justify-between text-[10px] font-space font-bold tracking-widest uppercase ${
                              isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}>
                              <span>Step</span>
                              <span>Status</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <p className={`font-display font-extrabold text-2xl ${isDark ? "text-white" : "text-zinc-950"}`}>
                                {visualizer.currentStepIndex + 1} /{" "}
                                {visualizer.totalSteps || 1}
                              </p>
                              <p
                                className={`font-space font-bold text-[11px] uppercase ${
                                  visualizer.isPlaying
                                    ? (isDark ? "text-indigo-400" : "text-indigo-600")
                                    : (isDark ? "text-zinc-400" : "text-zinc-500")
                                }`}
                              >
                                {statusLabel}
                              </p>
                            </div>
                            <div className={`mt-2 h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
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
                            className={`p-1.5 rounded-md border transition-colors ${
                              isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                            }`}
                            title="Restart"
                          >
                            <RotateCcw size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={visualizer.previous}
                            className={`p-1.5 rounded-md border transition-colors ${
                              isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                            }`}
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
                            className={`p-1.5 rounded-md border transition-colors ${
                              isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                            }`}
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
                            className={`p-1.5 rounded-md border transition-colors ${
                              isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                            }`}
                            title="Next"
                          >
                            <SkipForward size={13} />
                          </button>

                          <select
                            value={visualizer.speed}
                            onChange={(e) =>
                              visualizer.setSpeed(Number(e.target.value))
                            }
                            className={`ml-auto px-1.5 py-1.5 rounded-md border text-[10px] font-space font-bold ${
                              isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                                : "border-zinc-300 bg-white text-zinc-800"
                            }`}
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
                      <div className={`flex rounded-lg border overflow-hidden ${isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-300 bg-white"}`}>
                        {availableLanguages.map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-2 text-xs font-space font-bold uppercase transition-colors ${
                              language === lang
                                ? (isDark ? "bg-indigo-600 text-white" : "bg-zinc-900 text-white")
                                : (isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-white text-zinc-700 hover:bg-zinc-100")
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className={`rounded-2xl border-3 p-4 order-2 xl:order-1 ${
                      isDark ? "border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-zinc-950 text-zinc-100"
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-400">
                          {language.toUpperCase()} Implementation
                        </h3>

                        <button
                          type="button"
                          onClick={() => setIsCodeExpanded((prev) => !prev)}
                          className="p-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
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

                    <div className={`rounded-2xl border-3 p-4 order-1 xl:order-2 transition-colors ${
                      isDark ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-white text-zinc-900"
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-space font-bold text-xs tracking-widest uppercase ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
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
                          className={`px-2 py-1 rounded-md border text-[10px] font-space font-bold uppercase ${
                            isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-white text-zinc-800"
                          }`}
                        >
                          <option value="manual">Manual</option>
                          <option value="auto">Auto Play</option>
                        </select>
                      </div>

                      {renderVisualizationContent()}

                      <div className={`mt-4 rounded-xl p-3 border ${
                        isDark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-zinc-950 border-zinc-950 text-zinc-100"
                      }`}>
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
                    <div className={`xl:col-span-2 rounded-2xl border-3 p-4 transition-colors ${
                      isDark ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-white text-zinc-900"
                    }`}>
                      <h3 className={`font-space font-bold text-xs tracking-widest uppercase mb-3 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
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
                                className={`rounded-xl border p-3 transition-colors ${
                                  isSelected
                                    ? (isDark ? "border-indigo-500 bg-indigo-950/50 text-zinc-100" : "border-indigo-400 bg-indigo-50 text-zinc-900")
                                    : (isDark ? "border-zinc-700/80 bg-zinc-800/60 text-zinc-200" : "border-zinc-200 bg-white text-zinc-900")
                                }`}
                              >
                                <p className={`font-space font-bold text-xs ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                                  {testCase.name}
                                </p>
                                <p className={`mt-2 font-mono text-[10px] break-all ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                  {JSON.stringify(testCase.input)}
                                </p>
                                <p className={`mt-2 font-space font-bold text-[10px] uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Expected Output
                                </p>
                                <p className={`mt-1 font-mono text-[10px] break-all ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                  {JSON.stringify(testCase.expectedOutput)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTestCaseId(testCase.id);
                                    visualizer.restart();
                                  }}
                                  className="mt-3 w-full rounded-lg bg-indigo-600 text-white py-1.5 text-[10px] font-space font-bold tracking-widest uppercase hover:bg-indigo-500 transition-colors"
                                >
                                  Select
                                </button>
                              </div>
                            );
                          })}

                        <div
                          className={`rounded-xl border p-3 transition-colors ${
                            selectedTestCaseId === "__custom__"
                              ? (isDark ? "border-indigo-500 bg-indigo-950/50" : "border-indigo-400 bg-indigo-50")
                              : (isDark ? "border-zinc-700/80 bg-zinc-800/40" : "border-zinc-200 bg-zinc-50")
                          }`}
                        >
                          <p className={`font-space font-bold text-xs ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                            Custom Input
                          </p>
                          <input
                            type="text"
                            value={customInputRaw}
                            onChange={(e) => setCustomInputRaw(e.target.value)}
                            placeholder="e.g. [4, 2, 9, 1]"
                            className={`mt-2 w-full rounded-md border px-2 py-1.5 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                              isDark
                                ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                                : "border-zinc-300 bg-white text-zinc-700 placeholder:text-zinc-400"
                            }`}
                          />
                          <p className={`mt-2 font-space font-bold text-[10px] uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                            Expected Output
                          </p>
                          <p className={`mt-1 font-mono text-[10px] ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                            Computed at runtime
                          </p>
                          {customInputError ? (
                            <p className="mt-1 text-[10px] font-sans text-rose-500">
                              {customInputError}
                            </p>
                          ) : null}
                          <button
                            type="button"
                            onClick={handleCustomInputSelect}
                            className="mt-3 w-full rounded-lg bg-indigo-600 text-white py-1.5 text-[10px] font-space font-bold tracking-widest uppercase hover:bg-indigo-500 transition-colors"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl border-3 p-4 transition-colors ${
                      isDark ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-lg shadow-black/40" : "border-zinc-900 bg-white text-zinc-900"
                    }`}>
                      <h3 className={`font-space font-bold text-xs tracking-widest uppercase mb-3 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                        Explanation
                      </h3>
                      <p className={`font-sans text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        {currentStep?.explanation || "No step available."}
                      </p>
                      <div className={`mt-4 rounded-xl border p-3 ${
                        isDark ? "border-indigo-900/80 bg-indigo-950/40" : "border-indigo-200 bg-indigo-50"
                      }`}>
                        <p className={`font-space font-bold text-[10px] tracking-widest uppercase mb-1 ${
                          isDark ? "text-indigo-400" : "text-indigo-700"
                        }`}>
                          Tip
                        </p>
                        <p className={`font-sans text-xs ${
                          isDark ? "text-indigo-200" : "text-indigo-900/90"
                        }`}>
                          In Bubble Sort, the largest element bubbles toward the
                          end on each pass.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-3 transition-colors ${
                    isDark ? "border-zinc-800 bg-zinc-900/90 shadow-lg shadow-black/40" : "border-zinc-200 bg-white/90"
                  }`}>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
                      <button
                        type="button"
                        onClick={visualizer.restart}
                        className={`rounded-lg border py-2 text-[11px] font-space font-bold tracking-widest uppercase transition-colors ${
                          isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                            : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                        }`}
                      >
                        First
                      </button>
                      <button
                        type="button"
                        onClick={visualizer.previous}
                        className={`rounded-lg border py-2 text-[11px] font-space font-bold tracking-widest uppercase transition-colors ${
                          isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                            : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                        }`}
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
                        className="rounded-full h-11 w-11 justify-self-center border-2 border-indigo-600 bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-md"
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
                        className={`rounded-lg border py-2 text-[11px] font-space font-bold tracking-widest uppercase transition-colors ${
                          isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                            : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                        }`}
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
                        className={`rounded-lg border py-2 text-[11px] font-space font-bold tracking-widest uppercase transition-colors ${
                          isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
                            : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900"
                        }`}
                      >
                        Last
                      </button>
                      <select
                        value={visualizer.speed}
                        onChange={(e) =>
                          visualizer.setSpeed(Number(e.target.value))
                        }
                        className={`rounded-lg border px-2 py-2 text-[11px] font-space font-bold ${
                          isDark
                            ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                            : "border-zinc-300 bg-white text-zinc-800"
                        }`}
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
        <div className={`fixed left-4 top-4 bottom-4 z-[140] w-[55vw] min-w-[500px] max-w-[800px] rounded-2xl border-3 bg-zinc-950 text-zinc-100 p-4 ${
          isDark
            ? "border-zinc-800 shadow-[16px_18px_0px_rgba(0,0,0,0.8)]"
            : "border-zinc-900 shadow-[16px_18px_0px_rgba(18,18,20,0.7)]"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-space font-bold text-xs tracking-widest uppercase text-zinc-400">
              {language.toUpperCase()} Implementation (Expanded)
            </h3>

            <button
              type="button"
              onClick={() => setIsCodeExpanded(false)}
              className="p-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
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
