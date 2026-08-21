import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {
    // Mark the current node so we do not visit it again.
    visited[node] = true;
    visit(node);
    for (int nbr : graph[node]) {
        // Recursively explore each unvisited neighbor.
        if (!visited[nbr]) {
            dfs(nbr, graph, visited);
        }
    }
}`;

const pythonCode = `def dfs(node, graph, visited):
    # Mark the current node as visited.
    visited[node] = True
    visit(node)
    for nbr in graph[node]:
        # Go deeper only when the neighbor is unvisited.
        if not visited[nbr]:
            dfs(nbr, graph, visited)`;

function makePositions(count) {
  const pos = {};
  const r = 120;
  const cx = 170;
  const cy = 120;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    pos[i] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }
  return pos;
}

function generateSteps(input) {
  const graph = Array.isArray(input?.graph)
    ? input.graph
    : [[1, 2], [0, 3, 4], [0, 5], [1], [1, 5], [2, 4]];
  const start = Number.isFinite(input?.start) ? input.start : 0;
  const visited = new Array(graph.length).fill(false);
  const order = [];
  const positions = makePositions(graph.length);
  const edges = [];
  const steps = [];
  let step = 0;

  for (let i = 0; i < graph.length; i++) {
    for (const j of graph[i]) {
      if (i < j) edges.push({ from: i, to: j });
    }
  }

  function dfs(node) {
    visited[node] = true;
    order.push(node);

    steps.push({
      step: step++,
      event: EVENT_TYPES.VISIT,
      line: { cpp: 3, python: 3 },
      state: {
        graphNodes: graph.map((_, i) => i),
        edges,
        positions,
        visited: [...visited],
        currentNode: node,
        order: [...order],
      },
      affected: [node],
      explanation: `Visit node ${node}.`,
    });

    for (const nbr of graph[node]) {
      steps.push({
        step: step++,
        event: EVENT_TYPES.EXPLORE_EDGE,
        line: { cpp: 7, python: 6 },
        state: {
          graphNodes: graph.map((_, i) => i),
          edges,
          positions,
          visited: [...visited],
          currentNode: node,
          order: [...order],
          activeEdge: [node, nbr],
        },
        affected: [node, nbr],
        explanation: `Explore edge ${node} -> ${nbr}.`,
      });

      if (!visited[nbr]) {
        dfs(nbr);
      }
    }

    steps.push({
      step: step++,
      event: EVENT_TYPES.BACKTRACK,
      line: { cpp: 8, python: 8 },
      state: {
        graphNodes: graph.map((_, i) => i),
        edges,
        positions,
        visited: [...visited],
        currentNode: node,
        order: [...order],
      },
      affected: [node],
      explanation: `Backtrack from node ${node}.`,
    });
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      graphNodes: graph.map((_, i) => i),
      edges,
      positions,
      visited: [...visited],
      currentNode: start,
      order: [],
    },
    affected: [],
    explanation: `Initialize DFS from node ${start}.`,
  });

  dfs(start);

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 10 },
    state: {
      graphNodes: graph.map((_, i) => i),
      edges,
      positions,
      visited: [...visited],
      currentNode: -1,
      order: [...order],
      result: [...order],
    },
    affected: [],
    explanation: `DFS complete. Order: ${order.join(" -> ")}.`,
  });

  return steps;
}

export const graphDfsTraversal = {
  id: "graph-dfs-traversal",
  category: "Graph",
  name: "Graph - DFS Traversal",
  description: "Visit graph nodes depth-first using recursive DFS.",
  complexity: { time: "O(V + E)", space: "O(V)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "gdfs-1",
      name: "Example 1",
      input: {
        graph: [[1, 2], [0, 3, 4], [0, 5], [1], [1, 5], [2, 4]],
        start: 0,
      },
      expectedOutput: [0, 1, 3, 4, 5, 2],
    },
    {
      id: "gdfs-2",
      name: "Example 2",
      input: { graph: [[1], [0, 2], [1, 3], [2]], start: 1 },
      expectedOutput: [1, 0, 2, 3],
    },
  ],
  visualizationType: "graph",
  generateSteps,
    lineMap: {
    cpp: {
      initialize: 3,
      visit: 3,
      explore_edge: 5,
      backtrack: 8,
      complete: 11,
    },
    python: {
      initialize: 3,
      visit: 3,
      explore_edge: 5,
      backtrack: 8,
      complete: 8,
    },
  },
};
