import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `bool twoSum(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];

        if (sum == target) {
            return true;
        }
        else if (sum < target) {
            left++;       // Need a larger sum
        }
        else {
            right--;      // Need a smaller sum
        }
    }

    return false;
}`;

const pythonCode = `def two_sum(arr, target):
    left = 0
    right = len(arr) - 1

    while left < right:
        total = arr[left] + arr[right]

        if total == target:
            return True
        elif total < target:
            left += 1       # Need a larger sum
        else:
            right -= 1      # Need a smaller sum

    return False`;

function generateSteps(input) {
  const { arr, target } = input;
  const steps = [];
  let left = 0;
  let right = arr.length - 1;
  let stepNum = 0;

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: { array: [...arr], left, right, target },
    variables: { left, right, target },
    affected: [],
    explanation: `Initialize two pointers: left = 0, right = ${right}. Target = ${target}.`,
  });

  while (left < right) {
    const sum = arr[left] + arr[right];

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.COMPARE_POINTERS,
      line: { cpp: 5, python: 5 },
      state: { array: [...arr], left, right, target },
      variables: { left, right, sum },
      affected: [left, right],
      explanation: `Check: left (${left}) < right (${right})? Yes, continue.`,
    });

    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.CALCULATE,
      line: { cpp: 6, python: 6 },
      state: { array: [...arr], left, right, target, sum },
      variables: { left, right, sum },
      affected: [left, right],
      explanation: `Calculate sum: arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}.`,
    });

    if (sum === target) {
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.FOUND,
        line: { cpp: 8, python: 8 },
        state: { array: [...arr], left, right, target, sum, found: true },
        variables: { left, right, sum },
        affected: [left, right],
        explanation: `Sum ${sum} equals target ${target}. Pair found: (${arr[left]}, ${arr[right]})!`,
      });
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.COMPLETE,
        line: { cpp: 9, python: 9 },
        state: { array: [...arr], left, right, target, sum, found: true, result: true },
        variables: { left, right, result: true },
        affected: [left, right],
        explanation: `Return true. Pair (${arr[left]}, ${arr[right]}) sums to ${target}.`,
      });
      return steps;
    } else if (sum < target) {
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.MOVE_LEFT,
        line: { cpp: 12, python: 11 },
        state: { array: [...arr], left, right, target, sum },
        variables: { left: left + 1, right, sum },
        affected: [left],
        explanation: `Sum ${sum} < target ${target}. Move left pointer right to increase sum.`,
      });
      left++;
    } else {
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.MOVE_RIGHT,
        line: { cpp: 15, python: 13 },
        state: { array: [...arr], left, right, target, sum },
        variables: { left, right: right - 1, sum },
        affected: [right],
        explanation: `Sum ${sum} > target ${target}. Move right pointer left to decrease sum.`,
      });
      right--;
    }
  }

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 19, python: 15 },
    state: { array: [...arr], left, right, target, found: false, result: false },
    variables: { left, right, result: false },
    affected: [],
    explanation: `Pointers crossed. No pair found that sums to ${target}. Return false.`,
  });

  return steps;
}

const lineMap = {
  cpp: {
    initialize: 2,
    compare_pointers: 5,
    calculate: 6,
    found: 8,
    move_left: 12,
    move_right: 15,
    complete: 19,
  },
  python: {
    initialize: 2,
    compare_pointers: 5,
    calculate: 6,
    found: 8,
    move_left: 11,
    move_right: 13,
    complete: 15,
  },
};

export const twoPointer = {
  id: "two-pointer",
  category: "Arrays",
  name: "Two Pointer — Two Sum in Sorted Array",
  description:
    "Use two pointers from both ends of a sorted array to find a pair that sums to a target value.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "two-pointer-1",
      name: "Example 1",
      input: { arr: [2, 4, 7, 9, 12], target: 11 },
      expectedOutput: true,
    },
    {
      id: "two-pointer-2",
      name: "Example 2",
      input: { arr: [1, 3, 5, 8, 10], target: 20 },
      expectedOutput: false,
    },
  ],
  visualizationType: "array",
  generateSteps,
  lineMap,
};
