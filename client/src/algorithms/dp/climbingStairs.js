import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int climbStairs(int n) {
    // Handle the first two steps directly
    if (n <= 2) return n;
    // dp[i] stores the number of ways to reach step i
    vector<int> dp(n + 1, 0);
    dp[1] = 1;
    dp[2] = 2;
    // Each step can come from one or two steps before
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`;

const pythonCode = `def climb_stairs(n):
    # Handle the first two steps directly
    if n <= 2:
        return n
    # dp[i] stores the number of ways to reach step i
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    # Each step can come from one or two steps before
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;

function generateSteps(input) {
  const n = Number.isFinite(input?.n) ? input.n : 6;
  const dp = new Array(n + 1).fill(0);
  const steps = [];
  let step = 0;

  if (n <= 2) {
    steps.push({
      step: step++,
      event: EVENT_TYPES.COMPLETE,
      line: { cpp: 3, python: 3 },
      state: { n, dp: [0, 1, 2], activeIndex: n, result: n },
      affected: [n],
      explanation: `Base case: ways(${n}) = ${n}.`,
    });
    return steps;
  }

  dp[1] = 1;
  dp[2] = 2;

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 5, python: 6 },
    state: { n, dp: [...dp], activeIndex: 2 },
    affected: [1, 2],
    explanation: "Initialize dp[1] = 1 and dp[2] = 2.",
  });

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push({
      step: step++,
      event: EVENT_TYPES.UPDATE_DP,
      line: { cpp: 10, python: 11 },
      state: {
        n,
        dp: [...dp],
        activeIndex: i,
        from: [i - 1, i - 2],
        formula: `${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      },
      affected: [i, i - 1, i - 2],
      explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}.`,
    });
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 12, python: 12 },
    state: { n, dp: [...dp], activeIndex: n, result: dp[n] },
    affected: [n],
    explanation: `Climbing Stairs complete. Total ways = ${dp[n]}.`,
  });

  return steps;
}

export const climbingStairsDp = {
  id: "dp-climbing-stairs",
  category: "Dynamic Programming",
  name: "Climbing Stairs",
  description:
    "Compute number of ways to reach step n using 1-step and 2-step moves.",
  complexity: { time: "O(n)", space: "O(n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    { id: "stairs-1", name: "Example 1", input: { n: 5 }, expectedOutput: 8 },
    { id: "stairs-2", name: "Example 2", input: { n: 6 }, expectedOutput: 13 },
  ],
  visualizationType: "dp-array",
  generateSteps,
  lineMap: { cpp: { initialize: 5, update_dp: 10, complete: 12 }, python: { initialize: 6, update_dp: 11, complete: 12 } },
};
