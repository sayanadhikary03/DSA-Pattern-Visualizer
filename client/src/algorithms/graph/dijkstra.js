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

const cppCode = `vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int source) {
    // Store the shortest known distance to each node.
    vector<int> distance(n, INT_MAX);
    // Min-heap gives us the node with the smallest distance first.
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    distance[source] = 0;
    pq.push({0, source});
    while (!pq.empty()) {
        auto [dist, node] = pq.top();
        pq.pop();
        // Ignore an outdated entry from the priority queue.
        if (dist > distance[node]) continue;
        for (auto [nbr, wt] : adj[node]) {
            // Relax the edge if this path is shorter.
            if (distance[node] + wt < distance[nbr]) {
                distance[nbr] = distance[node] + wt;
                pq.push({distance[nbr], nbr});
            }
        }
    }
    return distance;
}`;

const pythonCode = `import heapq
def dijkstra(graph, source):
    # Start with infinity because no distances are known yet.
    distance = [float("inf")] * len(graph)
    distance[source] = 0
    # Heap stores (distance, node) so the nearest node comes first.
    pq = [(0, source)]
    while pq:
        dist, node = heapq.heappop(pq)
        # Skip entries that are no longer the best distance.
        if dist > distance[node]:
            continue
        for nbr, wt in graph[node]:
            # Update the neighbor when a shorter path is found.
            if distance[node] + wt < distance[nbr]:
                distance[nbr] = distance[node] + wt
                heapq.heappush(pq, (distance[nbr], nbr))
    return distance`;

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
    : [
        [[1, 4], [2, 2]],
        [[0, 4], [2, 1], [3, 5]],
        [[0, 2], [1, 1], [3, 8], [4, 10]],
        [[1, 5], [2, 8], [4, 2]],
        [[2, 10], [3, 2]],
      ];
  const source = Number.isFinite(input?.source) ? input.source : 0;
  const n = graph.length;
  const dist = new Array(n).fill(Number.POSITIVE_INFINITY);
  const visited = new Array(n).fill(false);
  dist[source] = 0;
  const pq = [{ node: source, dist: 0 }];
  const positions = makeGraphPositions(n);
  const edges = [];

  for (let i = 0; i < n; i++) {
    for (const [j, w] of graph[i]) {
      if (i < j) edges.push({ from: i, to: j, weight: w });
    }
  }

  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE_DISTANCES,
    line: { cpp: 2, python: 4 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges,
      positions,
      distances: [...dist],
      visited: [...visited],
      queue: [...pq],
      currentNode: -1,
    },
    explanation: `Initialize distances. Source node ${source} = 0.`,
  });

  while (pq.length) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node, dist: nodeDist } = pq.shift();
    if (visited[node]) continue;

    visited[node] = true;
    push({
      event: EVENT_TYPES.EXTRACT_MIN,
      line: { cpp: 10, python: 9 },
      state: {
        graphNodes: [...Array(n).keys()],
        edges,
        positions,
        distances: [...dist],
        visited: [...visited],
        queue: [...pq],
        currentNode: node,
      },
      affected: [node],
      explanation: `Extract node ${node} with smallest distance ${nodeDist}.`,
    });

    for (const [nbr, wt] of graph[node]) {
      push({
        event: EVENT_TYPES.EXPLORE_EDGE,
        line: { cpp: 13, python: 14 },
        state: {
          graphNodes: [...Array(n).keys()],
          edges,
          positions,
          distances: [...dist],
          visited: [...visited],
          queue: [...pq],
          currentNode: node,
          activeEdge: [node, nbr],
        },
        explanation: `Try edge ${node} -> ${nbr} (w=${wt}).`,
      });

      const candidate = dist[node] + wt;
      if (candidate < dist[nbr]) {
        dist[nbr] = candidate;
        pq.push({ node: nbr, dist: candidate });
        push({
          event: EVENT_TYPES.UPDATE_DISTANCE,
          line: { cpp: 15, python: 16 },
          state: {
            graphNodes: [...Array(n).keys()],
            edges,
            positions,
            distances: [...dist],
            visited: [...visited],
            queue: [...pq],
            currentNode: node,
            updatedNode: nbr,
          },
          affected: [nbr],
          explanation: `Relax edge: distance[${nbr}] becomes ${candidate}.`,
        });
      }
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 20, python: 18 },
    state: {
      graphNodes: [...Array(n).keys()],
      edges,
      positions,
      distances: [...dist],
      visited: [...visited],
      queue: [],
      currentNode: -1,
      result: [...dist],
    },
    explanation: "Dijkstra complete.",
  });

  return steps;
}

export const dijkstraShortestPath = {
  id: "graph-dijkstra",
  category: "Graph",
  name: "Dijkstra's Algorithm",
  description: "Find shortest distances from source in weighted graph.",
  complexity: { time: "O((V + E) log V)", space: "O(V)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "dijkstra-1",
      name: "Example 1",
      input: {
        graph: [
          [[1, 4], [2, 2]],
          [[0, 4], [2, 1], [3, 5]],
          [[0, 2], [1, 1], [3, 8], [4, 10]],
          [[1, 5], [2, 8], [4, 2]],
          [[2, 10], [3, 2]],
        ],
        source: 0,
      },
      expectedOutput: [0, 3, 2, 8, 10],
    },
    {
      id: "dijkstra-2",
      name: "Example 2",
      input: {
        graph: [
          [[1, 2], [2, 6]],
          [[0, 2], [2, 3], [3, 1]],
          [[0, 6], [1, 3], [3, 2]],
          [[1, 1], [2, 2]],
        ],
        source: 0,
      },
      expectedOutput: [0, 2, 5, 3],
    },
  ],
  visualizationType: "graph",
  generateSteps,
    lineMap: {
    cpp: {
      initialize_distances: 3,
      extract_min: 9,
      explore_edge: 13,
      update_distance: 16,
      complete: 21,
    },
    python: {
      initialize_distances: 4,
      extract_min: 9,
      explore_edge: 13,
      update_distance: 16,
      complete: 18,
    },
  },
};
