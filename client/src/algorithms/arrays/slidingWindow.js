import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int maxSum(vector<int>& arr, int k) {
    int windowSum = 0;
    // Build the first window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int bestSum = windowSum;
    for (int right = k; right < arr.size(); right++) {
        windowSum += arr[right];
        windowSum -= arr[right - k];
        bestSum = max(bestSum, windowSum);
    }
    return bestSum;
}`;

const pythonCode = `def max_sum(arr, k):
    window_sum = 0
    # Build the first window
    for i in range(k):
        window_sum += arr[i]
    best_sum = window_sum
    for right in range(k, len(arr)):
        window_sum += arr[right]
        window_sum -= arr[right - k]
        best_sum = max(best_sum, window_sum)
    return best_sum`;

function generateSteps(input) {
  const { arr, k } = input;
  const steps = [];
  let stepNum = 0;
  let windowSum = 0;

  // Initialize
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: {
      array: [...arr],
      windowStart: 0,
      windowEnd: -1,
      windowSum: 0,
      bestSum: 0,
      k,
    },
    variables: {
      windowSum: 0,
      k,
    },
    affected: [],
    explanation: `Initialize window sum to 0. Window size k = ${k}.`,
  });

  // Build first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.ADD_TO_WINDOW,
      line: { cpp: 5, python: 5 },
      state: {
        array: [...arr],
        windowStart: 0,
        windowEnd: i,
        windowSum,
        bestSum: 0,
        k,
      },
      variables: {
        i,
        windowSum,
      },
      affected: [i],
      explanation: `Add arr[${i}] = ${arr[i]} to window. Window sum = ${windowSum}.`,
    });
  }

  let bestSum = windowSum;

  // Calculate first window
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.CALCULATE,
    line: { cpp: 7, python: 6 },
    state: {
      array: [...arr],
      windowStart: 0,
      windowEnd: k - 1,
      windowSum,
      bestSum,
      k,
    },
    variables: {
      windowSum,
      bestSum,
    },
    affected: Array.from({ length: k }, (_, i) => i),
    explanation: `First window sum = ${windowSum}. Set best sum = ${bestSum}.`,
  });

  // Slide window
  for (let right = k; right < arr.length; right++) {
    const leaving = right - k;

    // Add entering element
    windowSum += arr[right];

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.ADD_TO_WINDOW,
      line: { cpp: 10, python: 9 },
      state: {
        array: [...arr],
        windowStart: leaving,
        windowEnd: right,
        windowSum,
        bestSum,
        k,
        entering: right,
      },
      variables: {
        right,
        windowSum,
      },
      affected: [right],
      explanation: `Add entering element arr[${right}] = ${arr[right]}. Sum = ${windowSum}.`,
    });

    // Remove leaving element
    windowSum -= arr[leaving];

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.REMOVE_FROM_WINDOW,
      line: { cpp: 11, python: 10 },
      state: {
        array: [...arr],
        windowStart: leaving + 1,
        windowEnd: right,
        windowSum,
        bestSum,
        k,
        leaving,
      },
      variables: {
        right,
        windowSum,
      },
      affected: [leaving],
      explanation: `Remove leaving element arr[${leaving}] = ${arr[leaving]}. Sum = ${windowSum}.`,
    });

    // Update best sum
    if (windowSum > bestSum) {
      bestSum = windowSum;

      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.UPDATE_BEST,
        line: { cpp: 12, python: 11 },
        state: {
          array: [...arr],
          windowStart: leaving + 1,
          windowEnd: right,
          windowSum,
          bestSum,
          k,
        },
        variables: {
          windowSum,
          bestSum,
        },
        affected: Array.from(
          { length: k },
          (_, i) => leaving + 1 + i
        ),
        explanation: `New best sum! ${windowSum} > previous best. Update best = ${bestSum}.`,
      });
    } else {
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.COMPARE,
        line: { cpp: 12, python: 11 },
        state: {
          array: [...arr],
          windowStart: leaving + 1,
          windowEnd: right,
          windowSum,
          bestSum,
          k,
        },
        variables: {
          windowSum,
          bestSum,
        },
        affected: Array.from(
          { length: k },
          (_, i) => leaving + 1 + i
        ),
        explanation: `Window sum ${windowSum} ≤ best ${bestSum}. No update.`,
      });
    }
  }

  // Complete
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 15, python: 14 },
    state: {
      array: [...arr],
      windowSum,
      bestSum,
      k,
      result: bestSum,
    },
    variables: {
      bestSum,
    },
    affected: [],
    explanation: `Complete. Maximum sum subarray of size ${k} = ${bestSum}.`,
  });

  return steps;
}

const lineMap = {
  cpp: {
    initialize: 2,
    add_to_window: 5,
    calculate: 7,
    remove_from_window: 11,
    update_best: 12,
    complete: 15,
  },

  python: {
    initialize: 2,
    add_to_window: 5,
    calculate: 6,
    remove_from_window: 10,
    update_best: 11,
    complete: 14,
  },
};

export const slidingWindow = {
  id: "sliding-window",
  category: "Arrays",

  name: "Sliding Window — Maximum Sum Subarray of Size K",

  description:
    "Find the maximum sum of any contiguous subarray of size k using a sliding window.",

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
      id: "sliding-1",
      name: "Example 1",
      input: {
        arr: [2, 4, 1, 7, 3, 6],
        k: 3,
      },
      expectedOutput: 16,
    },

    {
      id: "sliding-2",
      name: "Example 2",
      input: {
        arr: [1, 2, 3, 4, 5],
        k: 2,
      },
      expectedOutput: 9,
    },
  ],

  visualizationType: "array",
  generateSteps,
  lineMap,
};