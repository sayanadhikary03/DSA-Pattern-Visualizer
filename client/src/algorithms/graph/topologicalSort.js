import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `vector<int> topologicalSort(int n, vector<vector<int>>& graph) {
    // Count incoming edges for every node.
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) indegree[v]++;
    }
    queue<int> q;
    // Nodes with no incoming edges can be processed first.
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    vector<int> order;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int nbr : graph[node]) {
            // Removing an edge reduces the neighbor's indegree.
            indegree[nbr]--;
            if (indegree[nbr] == 0) q.push(nbr);
        }
    }
    return order;
}`;

const pythonCode = `from collections import deque
def topological_sort(n, graph):
    # Count incoming edges for every node.
    indegree = [0] * n
    for u in range(n):
        for v in graph[u]:
            indegree[v] += 1
    # Start with nodes that have no incoming edges.
    q = deque([i for i in range(n) if indegree[i] == 0])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nbr in graph[node]:
            # Remove the current edge from the graph.
            indegree[nbr] -= 1
            if indegree[nbr] == 0:
                q.append(nbr)
    return order`;

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
    : [[1, 2], [3], [3, 4], [5], [5], []];
  const n = Number.isFinite(input?.n) ? input.n : graph.length;
  const indegree = new Array(n).fill(0);
  const queue = [];
  const order = [];
  const positions = makePositions(n);
  const edges = [];
  const steps = [];
  let step = 0;

  for (let u = 0; u < n; u++) {
    for (const v of graph[u]) {
      indegree[v] += 1;
      edges.push({ from: u, to: v });
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.CALCULATE_INDEGREE,
    line: { cpp: 3, python: 3 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges,
      positions,
      indegree: [...indegree],
      queue: [...queue],
      order: [...order],
      currentNode: -1,
    },
    affected: [],
    explanation: `Calculated indegree for all nodes: [${indegree.join(", ")}].`,
  });

  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
      steps.push({
        step: step++,
        event: EVENT_TYPES.ENQUEUE_ZERO_INDEGREE,
        line: { cpp: 8, python: 8 },
        state: {
          graphNodes: [...Array(n).keys()],
          edges,
          positions,
          indegree: [...indegree],
          queue: [...queue],
          order: [...order],
          currentNode: -1,
        },
        affected: [i],
        explanation: `Node ${i} has indegree 0, enqueue it.`,
      });
    }
  }

  while (queue.length) {
    const node = queue.shift();
    order.push(node);

    steps.push({
      step: step++,
      event: EVENT_TYPES.DEQUEUE,
      line: { cpp: 12, python: 12 },
      state: {
        graphNodes: [...Array(n).keys()],
        edges,
        positions,
        indegree: [...indegree],
        queue: [...queue],
        order: [...order],
        currentNode: node,
      },
      affected: [node],
      explanation: `Dequeue node ${node} and add to topological order.`,
    });

    for (const nbr of graph[node]) {
      indegree[nbr] -= 1;

      steps.push({
        step: step++,
        event: EVENT_TYPES.DECREMENT_INDEGREE,
        line: { cpp: 16, python: 16 },
        state: {
          graphNodes: [...Array(n).keys()],
          edges,
          positions,
          indegree: [...indegree],
          queue: [...queue],
          order: [...order],
          currentNode: node,
          activeEdge: [node, nbr],
        },
        affected: [nbr],
        explanation: `Remove edge ${node} -> ${nbr}, indegree[${nbr}] becomes ${indegree[nbr]}.`,
      });

      if (indegree[nbr] === 0) {
        queue.push(nbr);
        steps.push({
          step: step++,
          event: EVENT_TYPES.ENQUEUE,
          line: { cpp: 17, python: 18 },
          state: {
            graphNodes: [...Array(n).keys()],
            edges,
            positions,
            indegree: [...indegree],
            queue: [...queue],
            order: [...order],
            currentNode: node,
          },
          affected: [nbr],
          explanation: `Node ${nbr} now has indegree 0, enqueue it.`,
        });
      }
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 22, python: 20 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges,
      positions,
      indegree: [...indegree],
      queue: [],
      order: [...order],
      result: [...order],
      currentNode: -1,
    },
    affected: [],
    explanation: `Topological sort complete: ${order.join(" -> ")}.`,
  });

  return steps;
}

export const topologicalSortGraph = {
  id: "graph-topological-sort",
  category: "Graph",
  name: "Topological Sort - Kahn's Algorithm",
  description:
    "Compute a topological order of a DAG using indegrees and queue.",
  complexity: { time: "O(V + E)", space: "O(V)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "topo-1",
      name: "Example 1",
      input: {
        graph: [[1, 2], [3], [3, 4], [5], [5], []],
        n: 6,
      },
      expectedOutput: [0, 1, 2, 3, 4, 5],
    },
    {
      id: "topo-2",
      name: "Example 2",
      input: {
        graph: [[2], [2, 3], [4], [4], []],
        n: 5,
      },
      expectedOutput: [0, 1, 2, 3, 4],
    },
  ],
  visualizationType: "graph",
  generateSteps,
    lineMap: {
    cpp: {
      calculate_indegree: 3,
      enqueue_zero_indegree: 10,
      dequeue: 14,
      decrement_indegree: 19,
      enqueue: 20,
      complete: 23,
    },
    python: {
      calculate_indegree: 4,
      enqueue_zero_indegree: 9,
      dequeue: 12,
      decrement_indegree: 16,
      enqueue: 18,
      complete: 19,
    },
  },
};
