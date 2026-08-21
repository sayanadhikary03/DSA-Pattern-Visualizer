import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int knapsack01(vector<int>& wt, vector<int>& val, int W) {
    int n = wt.size();
    // dp[i][w] = best value using first i items with capacity w
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            // Take the item or skip it, then keep the better choice
            if (wt[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            } else {
                // Item is too heavy, so carry forward the previous value
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`;

const pythonCode = `def knapsack_01(wt, val, W):
    n = len(wt)
    # dp[i][w] = best value using first i items with capacity w
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            # Take the item or skip it, then keep the better choice
            if wt[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]])
            else:
                # Item is too heavy, so carry forward the previous value
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`;

function generateSteps(input) {
  const wt = Array.isArray(input?.wt) ? [...input.wt] : [1, 3, 4, 5];
  const val = Array.isArray(input?.val) ? [...input.val] : [1, 4, 5, 7];
  const W = Number.isFinite(input?.W) ? input.W : 7;
  const n = wt.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  const steps = [];
  let step = 0;

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE_GRID,
    line: { cpp: 4, python: 4 },
    state: {
      grid: dp.map((r) => [...r]),
      wt: [...wt],
      val: [...val],
      capacity: W,
      activeCell: [-1, -1],
    },
    affected: [],
    explanation: "Initialize knapsack DP table with zeros.",
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (wt[i - 1] <= w) {
        const skip = dp[i - 1][w];
        const take = val[i - 1] + dp[i - 1][w - wt[i - 1]];
        dp[i][w] = Math.max(skip, take);
        steps.push({
          step: step++,
          event: EVENT_TYPES.CONSIDER_ITEM,
          line: { cpp: 8, python: 8 },
          state: {
            grid: dp.map((r) => [...r]),
            wt: [...wt],
            val: [...val],
            capacity: W,
            activeCell: [i, w],
            itemIndex: i - 1,
            skip,
            take,
            decision: dp[i][w] === take ? "take" : "skip",
          },
          affected: [i, w],
          explanation: `Item ${i - 1} (wt=${wt[i - 1]}, val=${val[i - 1]}), w=${w}: max(skip=${skip}, take=${take}) = ${dp[i][w]}.`,
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          step: step++,
          event: EVENT_TYPES.SKIP,
          line: { cpp: 12, python: 12 },
          state: {
            grid: dp.map((r) => [...r]),
            wt: [...wt],
            val: [...val],
            capacity: W,
            activeCell: [i, w],
            itemIndex: i - 1,
          },
          affected: [i, w],
          explanation: `Item ${i - 1} too heavy for capacity ${w}. Carry dp[${i - 1}][${w}] = ${dp[i][w]}.`,
        });
      }
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 16, python: 13 },
    state: {
      grid: dp.map((r) => [...r]),
      wt: [...wt],
      val: [...val],
      capacity: W,
      activeCell: [n, W],
      result: dp[n][W],
    },
    affected: [n, W],
    explanation: `Knapsack complete. Max value = ${dp[n][W]}.`,
  });

  return steps;
}

export const knapsack01Dp = {
  id: "dp-01-knapsack",
  category: "Dynamic Programming",
  name: "0/1 Knapsack",
  description: "Use 2D DP to maximize value under a weight capacity.",
  complexity: { time: "O(nW)", space: "O(nW)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "knapsack-1",
      name: "Example 1",
      input: { wt: [1, 3, 4, 5], val: [1, 4, 5, 7], W: 7 },
      expectedOutput: 9,
    },
    {
      id: "knapsack-2",
      name: "Example 2",
      input: { wt: [2, 3, 5], val: [6, 10, 12], W: 5 },
      expectedOutput: 16,
    },
  ],
  visualizationType: "dp-grid",
  generateSteps,
  lineMap: { cpp: { initialize_grid: 4, consider_item: 8, skip: 12, complete: 16 }, python: { initialize_grid: 4, consider_item: 8, skip: 12, complete: 13 } },
};
