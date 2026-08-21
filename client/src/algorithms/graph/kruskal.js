import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int kruskalMST(int n, vector<tuple<int,int,int>>& edges) {
    // Process edges from smallest to largest weight.
    sort(edges.begin(), edges.end());
    vector<int> parent(n), rank(n, 0);
    // Initially, every node belongs to its own set.
    for (int i = 0; i < n; i++) parent[i] = i;
    int total = 0;
    for (auto [w, u, v] : edges) {
        // Add the edge only if it does not create a cycle.
        if (find(u, parent) != find(v, parent)) {
            unite(u, v, parent, rank);
            total += w;
        }
    }
    return total;
}`;

const pythonCode = `def kruskal(n, edges):
    # Process edges from smallest to largest weight.
    edges.sort()
    parent = list(range(n))
    rank = [0] * n
    total = 0
    for w, u, v in edges:
        # Different sets mean this edge will not create a cycle.
        if find(u, parent) != find(v, parent):
            union(u, v, parent, rank)
            total += w
    return total`;

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
  const n = Number.isFinite(input?.n) ? input.n : 6;
  const weightedEdges = Array.isArray(input?.edges)
    ? input.edges.map((e) => [...e])
    : [
        [4, 0, 1],
        [2, 0, 2],
        [1, 1, 2],
        [7, 1, 3],
        [3, 2, 3],
        [6, 2, 4],
        [5, 3, 4],
        [8, 3, 5],
        [9, 4, 5],
      ];

  const edges = [...weightedEdges].sort((a, b) => a[0] - b[0]);
  const parent = [...Array(n).keys()];
  const rank = new Array(n).fill(0);
  const mstEdges = [];
  let total = 0;
  const positions = makePositions(n);
  const steps = [];
  let step = 0;

  // Find the representative of a node's set.
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  // Merge two different sets using union by rank.
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;

    if (rank[ra] < rank[rb]) {
      parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
      parent[rb] = ra;
    } else {
      parent[rb] = ra;
      rank[ra] += 1;
    }

    return true;
  };

  steps.push({
    step: step++,
    event: EVENT_TYPES.SORT_EDGES,
    line: { cpp: 3, python: 3 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges: edges.map(([w, u, v]) => ({
        from: u,
        to: v,
        weight: w,
      })),
      positions,
      parent: [...parent],
      rank: [...rank],
      mstEdges: [],
      totalWeight: 0,
    },
    affected: [],
    explanation: "Sort all edges by ascending weight.",
  });

  for (const [w, u, v] of edges) {
    steps.push({
      step: step++,
      event: EVENT_TYPES.SELECT_EDGE,
      line: { cpp: 8, python: 7 },
      state: {
        graphNodes: [...Array(n).keys()],
        edges: edges.map(([ew, eu, ev]) => ({
          from: eu,
          to: ev,
          weight: ew,
        })),
        positions,
        parent: [...parent],
        rank: [...rank],
        mstEdges: [...mstEdges],
        totalWeight: total,
        activeEdge: [u, v, w],
      },
      affected: [u, v],
      explanation: `Select edge (${u}, ${v}) with weight ${w}.`,
    });

    const ru = find(u);
    const rv = find(v);

    if (ru !== rv) {
      union(u, v);
      mstEdges.push([u, v, w]);
      total += w;

      steps.push({
        step: step++,
        event: EVENT_TYPES.ACCEPT_EDGE,
        line: { cpp: 10, python: 9 },
        state: {
          graphNodes: [...Array(n).keys()],
          edges: edges.map(([ew, eu, ev]) => ({
            from: eu,
            to: ev,
            weight: ew,
          })),
          positions,
          parent: [...parent],
          rank: [...rank],
          mstEdges: [...mstEdges],
          totalWeight: total,
          activeEdge: [u, v, w],
        },
        affected: [u, v],
        explanation: `No cycle. Accept edge (${u}, ${v}) and union sets.`,
      });
    } else {
      steps.push({
        step: step++,
        event: EVENT_TYPES.REJECT_EDGE,
        line: { cpp: 9, python: 8 },
        state: {
          graphNodes: [...Array(n).keys()],
          edges: edges.map(([ew, eu, ev]) => ({
            from: eu,
            to: ev,
            weight: ew,
          })),
          positions,
          parent: [...parent],
          rank: [...rank],
          mstEdges: [...mstEdges],
          totalWeight: total,
          activeEdge: [u, v, w],
        },
        affected: [u, v],
        explanation: `Cycle detected. Reject edge (${u}, ${v}).`,
      });
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 12 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges: edges.map(([w, u, v]) => ({
        from: u,
        to: v,
        weight: w,
      })),
      positions,
      parent: [...parent],
      rank: [...rank],
      mstEdges: [...mstEdges],
      totalWeight: total,
      result: {
        mstEdges: [...mstEdges],
        totalWeight: total,
      },
    },
    affected: [],
    explanation: `Kruskal complete. MST weight = ${total}.`,
  });

  return steps;
}

export const kruskalMst = {
  id: "graph-kruskal-mst",
  category: "Graph",
  name: "Kruskal's MST",
  description:
    "Build a minimum spanning tree by greedily taking light edges without cycles.",
  complexity: { time: "O(E log E)", space: "O(V)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "kruskal-1",
      name: "Example 1",
      input: {
        n: 6,
        edges: [
          [4, 0, 1],
          [2, 0, 2],
          [1, 1, 2],
          [7, 1, 3],
          [3, 2, 3],
          [6, 2, 4],
          [5, 3, 4],
          [8, 3, 5],
          [9, 4, 5],
        ],
      },
      expectedOutput: 19,
    },
    {
      id: "kruskal-2",
      name: "Example 2",
      input: {
        n: 4,
        edges: [
          [1, 0, 1],
          [4, 0, 2],
          [2, 1, 2],
          [3, 1, 3],
          [5, 2, 3],
        ],
      },
      expectedOutput: 6,
    },
  ],
  visualizationType: "graph",
  generateSteps,
    lineMap: {
    cpp: {
      sort_edges: 3,
      select_edge: 8,
      reject_edge: 10,
      accept_edge: 10,
      complete: 15,
    },
    python: {
      sort_edges: 3,
      select_edge: 7,
      reject_edge: 9,
      accept_edge: 9,
      complete: 12,
    },
  },
};
