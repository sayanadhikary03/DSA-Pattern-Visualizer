import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int maxSubArray(vector<int>& arr) {
    int currentSum = arr[0];
    int bestSum = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        // Extend current subarray or start again
        currentSum = max(arr[i], currentSum + arr[i]);
        bestSum = max(bestSum, currentSum);
    }
    return bestSum;
}`;

const pythonCode = `def max_sub_array(arr):
    current_sum = arr[0]
    best_sum = arr[0]
    for i in range(1, len(arr)):
        # Extend or start a new subarray
        current_sum = max(arr[i], current_sum + arr[i])
        best_sum = max(best_sum, current_sum)
    return best_sum`;

function generateSteps(input) {
  const arr = Array.isArray(input) ? input : input.arr || input;
  const steps = [];

  let stepNum = 0;
  let currentSum = arr[0];
  let bestSum = arr[0];

  let subarrayStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  // Initialize
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: {
      array: [...arr],
      currentSum,
      bestSum,
      subarrayStart: 0,
      bestStart: 0,
      bestEnd: 0,
      currentIndex: 0,
    },
    variables: {
      currentSum,
      bestSum,
    },
    affected: [0],
    explanation: `Initialize: currentSum = arr[0] = ${arr[0]}, bestSum = ${arr[0]}.`,
  });

  for (let i = 1; i < arr.length; i++) {
    const extendValue = currentSum + arr[i];
    const restartValue = arr[i];

    // Compare extend vs restart
    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.COMPARE_EXTEND_OR_RESTART,
      line: { cpp: 6, python: 6 },
      state: {
        array: [...arr],
        currentSum,
        bestSum,
        subarrayStart,
        bestStart,
        bestEnd,
        currentIndex: i,
        extendValue,
        restartValue,
      },
      variables: {
        i,
        "arr[i]": arr[i],
        extend: extendValue,
        restart: restartValue,
      },
      affected: [i],
      explanation: `Extend: ${currentSum} + ${arr[i]} = ${extendValue}. Restart: ${arr[i]}. Choose max.`,
    });

    // Update current sum
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      subarrayStart = i;
    } else {
      currentSum = currentSum + arr[i];
    }

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.UPDATE_CURRENT,
      line: { cpp: 7, python: 7 },
      state: {
        array: [...arr],
        currentSum,
        bestSum,
        subarrayStart,
        bestStart,
        bestEnd,
        currentIndex: i,
      },
      variables: {
        currentSum,
        decision: arr[i] > extendValue ? "restart" : "extend",
      },
      affected: Array.from(
        { length: i - subarrayStart + 1 },
        (_, j) => subarrayStart + j
      ),
      explanation: `${arr[i] > extendValue ? "Restart" : "Extend"
        }: currentSum = ${currentSum}.`,
    });

    // Update best sum
    if (currentSum > bestSum) {
      bestSum = currentSum;
      bestEnd = i;
      bestStart = subarrayStart;

      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.UPDATE_BEST,
        line: { cpp: 8, python: 8 },
        state: {
          array: [...arr],
          currentSum,
          bestSum,
          subarrayStart,
          bestStart,
          bestEnd,
          currentIndex: i,
        },
        variables: {
          currentSum,
          bestSum,
        },
        affected: Array.from(
          { length: bestEnd - bestStart + 1 },
          (_, j) => bestStart + j
        ),
        explanation: `New best! bestSum = ${bestSum} (subarray [${bestStart}..${bestEnd}]).`,
      });
    }
  }

  // Complete
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 10 },
    state: {
      array: [...arr],
      currentSum,
      bestSum,
      bestStart,
      bestEnd,
      result: bestSum,
    },
    variables: {
      bestSum,
    },
    affected: Array.from(
      { length: bestEnd - bestStart + 1 },
      (_, j) => bestStart + j
    ),
    explanation: `Complete. Maximum subarray sum = ${bestSum}.`,
  });

  return steps;
}

const lineMap = {
  cpp: {
    initialize: 2,
    compare_extend_or_restart: 6,
    update_current: 7,
    update_best: 8,
    complete: 10,
  },

  python: {
    initialize: 2,
    compare_extend_or_restart: 6,
    update_current: 7,
    update_best: 8,
    complete: 10,
  },
};

export const kadane = {
  id: "kadane",
  category: "Arrays",

  name: "Kadane's Algorithm — Maximum Subarray Sum",

  description:
    "Find the contiguous subarray with the largest sum using Kadane's algorithm.",

  complexity: {
    time: "O(n)",
    space: "O(1)",
  },

  languages: {
    cpp: {
      code: cppCode,
      readOnly: true,
    },

    python: {
      code: pythonCode,
      readOnly: true,
    },
  },

  testCases: [
    {
      id: "kadane-1",
      name: "Example 1",
      input: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      expectedOutput: 6,
    },

    {
      id: "kadane-2",
      name: "Example 2",
      input: [5, -2, 3, 4, -1],
      expectedOutput: 9,
    },
  ],

  visualizationType: "array",
  generateSteps,
  lineMap,
};