import { EVENT_TYPES } from "../../engine/eventTypes";

function withStepFactory() {
  const steps = [];
  let step = 0;

  const push = ({
    event,
    line,
    state,
    variables = {},
    affected = [],
    explanation,
  }) => {
    steps.push({
      step: step++,
      event,
      line,
      state,
      variables,
      affected,
      explanation,
    });
  };

  return { steps, push };
}

const cppCode = `void bfs(int start, vector<vector<int>>& graph) {
    // Track visited nodes so each node is processed once.
    vector<bool> visited(graph.size(), false);
    // BFS uses a queue to process nodes level by level.
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int nbr : graph[node]) {
            // Visit and enqueue each unvisited neighbor.
            if (!visited[nbr]) {
                visited[nbr] = true;
                q.push(nbr);
            }
        }
    }
}`;

const pythonCode = `from collections import deque
def bfs(start, graph):
    # Track which nodes have already been visited.
    visited = [False] * len(graph)
    # Queue keeps BFS processing order.
    q = deque([start])
    visited[start] = True;
    while q:
        node = q.popleft()
        for nbr in graph[node]:
            # Add an unvisited neighbor to the queue.
            if not visited[nbr]:
                visited[nbr] = True
                q.append(nbr)`;

function makeGraphPositions(count) {
  const map = {};
  const radius = 120;
  const cx = 170;
  const cy = 120;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    map[i] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }
  return map;
}

function generateSteps(input) {
  const graph = Array.isArray(input?.graph)
    ? input.graph
    : [[1, 2], [0, 3, 4], [0, 5], [1], [1, 5], [2, 4]];
  const start = Number.isFinite(input?.start) ? input.start : 0;
  const visited = new Array(graph.length).fill(false);
  const queue = [start];
  const order = [];
  const positions = makeGraphPositions(graph.length);
  const edges = [];

  for (let i = 0; i < graph.length; i++) {
    for (const j of graph[i]) {
      if (i < j) {
        edges.push({ from: i, to: j });
      }
    }
  }

  const { steps, push } = withStepFactory();
  visited[start] = true;

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 4, python: 6 },
    state: {
      graphNodes: graph.map((_, idx) => idx),
      edges,
      positions,
      queue: [...queue],
      visited: [...visited],
      order: [...order],
      currentNode: -1,
    },
    explanation: `Initialize BFS from node ${start}.`,
  });

  while (queue.length) {
    const node = queue.shift();
    order.push(node);

    push({
      event: EVENT_TYPES.DEQUEUE,
      line: { cpp: 9, python: 10 },
      state: {
        graphNodes: graph.map((_, idx) => idx),
        edges,
        positions,
        queue: [...queue],
        visited: [...visited],
        order: [...order],
        currentNode: node,
      },
      affected: [node],
      explanation: `Dequeue node ${node} and visit it.`,
    });

    for (const nbr of graph[node]) {
      push({
        event: EVENT_TYPES.EXPLORE_EDGE,
        line: { cpp: 12, python: 13 },
        state: {
          graphNodes: graph.map((_, idx) => idx),
          edges,
          positions,
          queue: [...queue],
          visited: [...visited],
          order: [...order],
          currentNode: node,
          activeEdge: [node, nbr],
        },
        affected: [node, nbr],
        explanation: `Explore edge ${node} -> ${nbr}.`,
      });

      if (!visited[nbr]) {
        visited[nbr] = true;
        queue.push(nbr);
        push({
          event: EVENT_TYPES.ENQUEUE,
          line: { cpp: 15, python: 16 },
          state: {
            graphNodes: graph.map((_, idx) => idx),
            edges,
            positions,
            queue: [...queue],
            visited: [...visited],
            order: [...order],
            currentNode: node,
          },
          affected: [nbr],
          explanation: `Node ${nbr} was unvisited. Mark visited and enqueue.`,
        });
      }
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 18, python: 18 },
    state: {
      graphNodes: graph.map((_, idx) => idx),
      edges,
      positions,
      queue: [],
      visited: [...visited],
      order: [...order],
      result: [...order],
      currentNode: -1,
    },
    explanation: `BFS complete. Visit order: ${order.join(" -> ")}.`,
  });

  return steps;
}

export const graphBfsTraversal = {
  id: "graph-bfs-traversal",
  category: "Graph",
  name: "Graph - BFS Traversal",
  description: "Visit graph nodes level by level with queue-based BFS.",
  complexity: { time: "O(V + E)", space: "O(V)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "gbfs-1",
      name: "Example 1",
      input: {
        graph: [[1, 2], [0, 3, 4], [0, 5], [1], [1, 5], [2, 4]],
        start: 0,
      },
      expectedOutput: [0, 1, 2, 3, 4, 5],
    },
    {
      id: "gbfs-2",
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
      dequeue: 9,
      explore_edge: 11,
      enqueue: 14,
      complete: 19,
    },
    python: {
      initialize: 4,
      dequeue: 9,
      explore_edge: 10,
      enqueue: 13,
      complete: 14,
    },
  },
};
