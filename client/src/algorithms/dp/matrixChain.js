import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int matrixChain(vector<int>& dims) {
    int n = dims.size() - 1;
    // dp[i][j] stores the minimum cost to multiply matrices i through j
    vector<vector<int>> dp(n, vector<int>(n, 0));
    // Solve shorter chains before longer chains
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            // Try every possible split point
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n - 1];
}`;

const pythonCode = `def matrix_chain(dims):
    n = len(dims) - 1
    # dp[i][j] stores the minimum cost to multiply matrices i through j
    dp = [[0 for _ in range(n)] for _ in range(n)]
    # Solve shorter chains before longer chains
    for length in range(2, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            dp[i][j] = float("inf")
            # Try every possible split point
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n - 1]`;

function generateSteps(input) {
  const dims = Array.isArray(input?.dims) ? [...input.dims] : [10, 30, 5, 60];
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  const steps = [];
  let step = 0;

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE_GRID,
    line: { cpp: 4, python: 4 },
    state: {
      grid: dp.map((r) => [...r]),
      dims: [...dims],
      interval: [-1, -1],
      split: -1,
    },
    affected: [],
    explanation: "Initialize Matrix Chain DP table with zeros on diagonal.",
  });

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Number.POSITIVE_INFINITY;

      steps.push({
        step: step++,
        event: EVENT_TYPES.SELECT_INTERVAL,
        line: { cpp: 6, python: 6 },
        state: {
          grid: dp.map((r) => [...r]),
          dims: [...dims],
          interval: [i, j],
          split: -1,
        },
        affected: [i, j],
        explanation: `Evaluate interval [${i}, ${j}].`,
      });

      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

        steps.push({
          step: step++,
          event: EVENT_TYPES.CALCULATE_COST,
          line: { cpp: 12, python: 12 },
          state: {
            grid: dp.map((r) => [...r]),
            dims: [...dims],
            interval: [i, j],
            split: k,
            candidate: cost,
            formula: `${dp[i][k]} + ${dp[k + 1][j]} + ${dims[i]}*${dims[k + 1]}*${dims[j + 1]}`,
          },
          affected: [i, j],
          explanation: `Try split k=${k}, cost = ${cost}.`,
        });

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          steps.push({
            step: step++,
            event: EVENT_TYPES.UPDATE_DP,
            line: { cpp: 13, python: 13 },
            state: {
              grid: dp.map((r) => [...r]),
              dims: [...dims],
              interval: [i, j],
              split: k,
              bestCost: dp[i][j],
            },
            affected: [i, j],
            explanation: `Update best cost for [${i}, ${j}] to ${dp[i][j]}.`,
          });
        }
      }
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 17, python: 14 },
    state: {
      grid: dp.map((r) => [...r]),
      dims: [...dims],
      interval: [0, n - 1],
      split: -1,
      result: dp[0][n - 1],
    },
    affected: [0, n - 1],
    explanation: `Matrix Chain Multiplication complete. Minimum multiplications = ${dp[0][n - 1]}.`,
  });

  return steps;
}

export const matrixChainDp = {
  id: "dp-matrix-chain-multiplication",
  category: "Dynamic Programming",
  name: "Matrix Chain Multiplication",
  description: "Use interval DP to minimize scalar multiplications.",
  complexity: { time: "O(n^3)", space: "O(n^2)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "mcm-1",
      name: "Example 1",
      input: { dims: [10, 30, 5, 60] },
      expectedOutput: 4500,
    },
    {
      id: "mcm-2",
      name: "Example 2",
      input: { dims: [40, 20, 30, 10, 30] },
      expectedOutput: 26000,
    },
  ],
  visualizationType: "dp-grid",
  generateSteps,
  lineMap: { cpp: { initialize_grid: 4, select_interval: 6, calculate_cost: 12, update_dp: 13, complete: 17 }, python: { initialize_grid: 4, select_interval: 6, calculate_cost: 12, update_dp: 13, complete: 14 } },
};
