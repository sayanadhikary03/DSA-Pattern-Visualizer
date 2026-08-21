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

const cppCode = `int uniquePaths(int m, int n) {
    // Start with 1: only one way along the first row and column
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // Paths to a cell come from the top or the left
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`;

const pythonCode = `def unique_paths(m, n):
    # Start with 1: only one way along the first row and column
    dp = [[1 for _ in range(n)] for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            # Paths to a cell come from the top or the left
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[m - 1][n - 1]`;

function generateSteps(input) {
  const m = Number.isFinite(input?.m) ? input.m : 3;
  const n = Number.isFinite(input?.n) ? input.n : 4;
  const dp = Array.from({ length: m }, () => Array(n).fill(1));
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE_GRID,
    line: { cpp: 3, python: 3 },
    state: {
      grid: dp.map((row) => [...row]),
      activeCell: [-1, -1],
      formula: "init",
    },
    explanation: "Initialize dp grid with 1s for first row and first column.",
  });

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const top = dp[i - 1][j];
      const left = dp[i][j - 1];
      dp[i][j] = top + left;

      push({
        event: EVENT_TYPES.CALCULATE_CELL,
        line: { cpp: 7, python: 7 },
        state: {
          grid: dp.map((row) => [...row]),
          activeCell: [i, j],
          topCell: [i - 1, j],
          leftCell: [i, j - 1],
          formula: `${top} + ${left} = ${dp[i][j]}`,
        },
        explanation: `dp[${i}][${j}] = top + left = ${dp[i][j]}.`,
      });
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 8 },
    state: {
      grid: dp.map((row) => [...row]),
      activeCell: [m - 1, n - 1],
      result: dp[m - 1][n - 1],
    },
    explanation: `Unique paths complete. Total paths = ${dp[m - 1][n - 1]}.`,
  });

  return steps;
}

export const uniquePathsDp = {
  id: "dp-unique-paths",
  category: "Dynamic Programming",
  name: "Unique Paths (2D DP)",
  description: "Count unique paths in an m x n grid using DP.",
  complexity: { time: "O(m x n)", space: "O(m x n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "up-1",
      name: "Example 1",
      input: { m: 3, n: 4 },
      expectedOutput: 10,
    },
    { id: "up-2", name: "Example 2", input: { m: 3, n: 3 }, expectedOutput: 6 },
  ],
  visualizationType: "dp-grid",
  generateSteps,
  lineMap: { cpp: { initialize_grid: 3, calculate_cell: 7, complete: 10 }, python: { initialize_grid: 3, calculate_cell: 7, complete: 8 } },
};
