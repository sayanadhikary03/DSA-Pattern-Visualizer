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

const cppCode = `int lcs(string a, string b) {
    int n = a.size(), m = b.size();
    // dp[i][j] stores LCS length for a[0..i-1] and b[0..j-1]
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            // Matching characters extend the diagonal result
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                // Otherwise, keep the better result from top or left
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[n][m];
}`;

const pythonCode = `def lcs(a, b):
    n, m = len(a), len(b)
    # dp[i][j] stores LCS length for a[0..i-1] and b[0..j-1]
    dp = [[0 for _ in range(m + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # Matching characters extend the diagonal result
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                # Otherwise, keep the better result from top or left
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`;

function generateSteps(input) {
  const a = typeof input?.a === "string" ? input.a : "ABCBDAB";
  const b = typeof input?.b === "string" ? input.b : "BDCAB";

  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE_GRID,
    line: { cpp: 4, python: 4 },
    state: {
      grid: dp.map((r) => [...r]),
      activeCell: [-1, -1],
      stringA: a,
      stringB: b,
    },
    explanation: "Initialize LCS table with zeros.",
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        push({
          event: EVENT_TYPES.MATCH,
          line: { cpp: 8, python: 8 },
          state: {
            grid: dp.map((r) => [...r]),
            activeCell: [i, j],
            diagCell: [i - 1, j - 1],
            stringA: a,
            stringB: b,
            formula: `1 + ${dp[i - 1][j - 1]} = ${dp[i][j]}`,
          },
          explanation: `Characters match (${a[i - 1]}). Use diagonal + 1.`,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        push({
          event: EVENT_TYPES.MISMATCH,
          line: { cpp: 12, python: 12 },
          state: {
            grid: dp.map((r) => [...r]),
            activeCell: [i, j],
            topCell: [i - 1, j],
            leftCell: [i, j - 1],
            stringA: a,
            stringB: b,
            formula: `max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
          },
          explanation: `Characters mismatch (${a[i - 1]} vs ${b[j - 1]}). Use max(top, left).`,
        });
      }
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 16, python: 13 },
    state: {
      grid: dp.map((r) => [...r]),
      activeCell: [n, m],
      stringA: a,
      stringB: b,
      result: dp[n][m],
    },
    explanation: `LCS length is ${dp[n][m]}.`,
  });

  return steps;
}

export const lcsDp = {
  id: "dp-lcs",
  category: "Dynamic Programming",
  name: "Longest Common Subsequence (LCS)",
  description: "Build a DP table to compute longest common subsequence length.",
  complexity: { time: "O(n x m)", space: "O(n x m)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "lcs-1",
      name: "Example 1",
      input: { a: "ABCBDAB", b: "BDCAB" },
      expectedOutput: 4,
    },
    {
      id: "lcs-2",
      name: "Example 2",
      input: { a: "XMJYAUZ", b: "MZJAWXU" },
      expectedOutput: 4,
    },
  ],
  visualizationType: "dp-grid",
  generateSteps,
  lineMap: { cpp: { initialize_grid: 4, match: 8, mismatch: 12, complete: 16 }, python: { initialize_grid: 4, match: 8, mismatch: 12, complete: 13 } },
};
