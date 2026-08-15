import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `vector<int> buildPrefix(vector<int>& arr) {
    vector<int> prefix(arr.size());

    prefix[0] = arr[0];

    for (int i = 1; i < arr.size(); i++) {
        prefix[i] = prefix[i - 1] + arr[i];
    }

    return prefix;
}

int rangeSum(vector<int>& prefix, int left, int right) {
    if (left == 0) {
        return prefix[right];
    }

    return prefix[right] - prefix[left - 1];
}`;

const pythonCode = `def build_prefix(arr):
    prefix = [0] * len(arr)

    prefix[0] = arr[0]

    for i in range(1, len(arr)):
        prefix[i] = prefix[i - 1] + arr[i]

    return prefix


def range_sum(prefix, left, right):
    if left == 0:
        return prefix[right]

    return prefix[right] - prefix[left - 1]`;

function generateSteps(input) {
  const { arr, left, right } = input;
  const steps = [];
  let stepNum = 0;
  const prefix = new Array(arr.length).fill(0);

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right },
    variables: {},
    affected: [],
    explanation: `Build prefix sum array for [${arr.join(", ")}]. Then query range [${left}, ${right}].`,
  });

  prefix[0] = arr[0];
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.BUILD_PREFIX,
    line: { cpp: 4, python: 4 },
    state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right },
    variables: { i: 0, "prefix[0]": prefix[0] },
    affected: [0],
    explanation: `prefix[0] = arr[0] = ${arr[0]}.`,
  });

  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.CALCULATE,
      line: { cpp: 7, python: 7 },
      state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right },
      variables: { i, "prefix[i-1]": prefix[i - 1] - arr[i], "arr[i]": arr[i], "prefix[i]": prefix[i] },
      affected: [i],
      explanation: `prefix[${i}] = prefix[${i - 1}] + arr[${i}] = ${prefix[i - 1] - arr[i]} + ${arr[i]} = ${prefix[i]}.`,
    });
  }

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.SELECT_RANGE,
    line: { cpp: 13, python: 12 },
    state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right },
    variables: { left, right },
    affected: Array.from({ length: right - left + 1 }, (_, i) => left + i),
    explanation: `Query: sum of range [${left}, ${right}].`,
  });

  let result;
  if (left === 0) {
    result = prefix[right];
    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.CALCULATE_RANGE,
      line: { cpp: 15, python: 14 },
      state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right, result },
      variables: { left, right, result },
      affected: [right],
      explanation: `left == 0, so result = prefix[${right}] = ${result}.`,
    });
  } else {
    result = prefix[right] - prefix[left - 1];
    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.CALCULATE_RANGE,
      line: { cpp: 18, python: 17 },
      state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right, result },
      variables: { left, right, "prefix[right]": prefix[right], "prefix[left-1]": prefix[left - 1], result },
      affected: [left - 1, right],
      explanation: `result = prefix[${right}] - prefix[${left - 1}] = ${prefix[right]} - ${prefix[left - 1]} = ${result}.`,
    });
  }

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 18, python: 17 },
    state: { array: [...arr], prefix: [...prefix], queryLeft: left, queryRight: right, result },
    variables: { result },
    affected: [],
    explanation: `Range sum of [${left}, ${right}] = ${result}.`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 1, build_prefix: 4, calculate: 7, select_range: 13, calculate_range: 18, complete: 18 },
  python: { initialize: 1, build_prefix: 4, calculate: 7, select_range: 12, calculate_range: 17, complete: 17 },
};

export const prefixSum = {
  id: "prefix-sum",
  category: "Arrays",
  name: "Prefix Sum — Range Sum Queries",
  description: "Build a prefix sum array to answer range sum queries in O(1) time.",
  complexity: { time: "O(n) build, O(1) query", space: "O(n)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "prefix-1", name: "Example 1", input: { arr: [2, 4, 3, 5, 1], left: 1, right: 3 }, expectedOutput: 12 },
    { id: "prefix-2", name: "Example 2", input: { arr: [2, 4, 3, 5, 1], left: 0, right: 4 }, expectedOutput: 15 },
  ],
  visualizationType: "array",
  generateSteps,
  lineMap,
};
