import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int lis(vector<int>& arr) {
    int n = arr.size();
    // dp[i] stores the LIS length ending at index i
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            // Extend the subsequence when arr[j] can come before arr[i]
            if (arr[j] < arr[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    // The LIS can end at any index, so take the largest value
    return *max_element(dp.begin(), dp.end());
}`;

const pythonCode = `def lis(arr):
    n = len(arr)
    # dp[i] stores the LIS length ending at index i
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            # Extend the subsequence when arr[j] can come before arr[i]
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    # The LIS can end at any index, so take the largest value
    return max(dp)`;

function generateSteps(input) {
  const arr = Array.isArray(input?.arr)
    ? [...input.arr]
    : [10, 9, 2, 5, 3, 7, 101, 18];
  const n = arr.length;
  const dp = new Array(n).fill(1);
  const steps = [];
  let step = 0;

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 4, python: 4 },
    state: { array: [...arr], dp: [...dp], i: -1, j: -1, best: 1 },
    affected: [],
    explanation: "Initialize LIS lengths to 1 for each element.",
  });

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      steps.push({
        step: step++,
        event: EVENT_TYPES.COMPARE,
        line: { cpp: 8, python: 8 },
        state: { array: [...arr], dp: [...dp], i, j, best: Math.max(...dp) },
        affected: [i, j],
        explanation: `Compare arr[${j}] = ${arr[j]} with arr[${i}] = ${arr[i]}.`,
      });

      if (arr[j] < arr[i]) {
        const candidate = dp[j] + 1;
        if (candidate > dp[i]) {
          dp[i] = candidate;
          steps.push({
            step: step++,
            event: EVENT_TYPES.UPDATE_DP,
            line: { cpp: 9, python: 9 },
            state: {
              array: [...arr],
              dp: [...dp],
              i,
              j,
              best: Math.max(...dp),
              candidate,
            },
            affected: [i],
            explanation: `arr[${j}] < arr[${i}], update dp[${i}] to ${dp[i]}.`,
          });
        }
      }
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 11 },
    state: {
      array: [...arr],
      dp: [...dp],
      i: -1,
      j: -1,
      best: Math.max(...dp),
      result: Math.max(...dp),
    },
    affected: [],
    explanation: `LIS complete. Length = ${Math.max(...dp)}.`,
  });

  return steps;
}

export const lisDp = {
  id: "dp-lis",
  category: "Dynamic Programming",
  name: "Longest Increasing Subsequence (LIS)",
  description: "Build LIS lengths using O(n^2) dynamic programming.",
  complexity: { time: "O(n^2)", space: "O(n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "lis-1",
      name: "Example 1",
      input: { arr: [10, 9, 2, 5, 3, 7, 101, 18] },
      expectedOutput: 4,
    },
    {
      id: "lis-2",
      name: "Example 2",
      input: { arr: [0, 1, 0, 3, 2, 3] },
      expectedOutput: 4,
    },
  ],
  visualizationType: "dp-array",
  generateSteps,
  lineMap: { cpp: { initialize: 4, compare: 8, update_dp: 9, complete: 14 }, python: { initialize: 4, compare: 8, update_dp: 9, complete: 11 } },
};
