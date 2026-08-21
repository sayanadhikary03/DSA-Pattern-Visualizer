import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    // Compare adjacent elements in each pass.
    for (int i = 0; i < n - 1; i++) {

        for (int j = 0; j < n - i - 1; j++) {

            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`;
const pythonCode = `def bubble_sort(arr):
    n = len(arr)
    # Compare adjacent elements in each pass.
    for i in range(n - 1):

        for j in range(n - i - 1):

            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`;
function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [...input.arr || input];
  const steps = [];
  let stepNum = 0;
  const n = arr.length;
  const sorted = [];

  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: { array: [...arr], comparing: [], swapping: [], sorted: [] },
    variables: { n },
    affected: [],
    explanation: `Start Bubble Sort on array [${arr.join(", ")}]. n = ${n}.`,
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        step: stepNum++,
        event: EVENT_TYPES.COMPARE,
        line: { cpp: 9, python: 9 },
        state: { array: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted] },
        variables: { i, j, "arr[j]": arr[j], "arr[j+1]": arr[j + 1] },
        affected: [j, j + 1],
        explanation: `Compare arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}.`,
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          step: stepNum++,
          event: EVENT_TYPES.SWAP,
          line: { cpp: 10, python: 10 },
          state: { array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted] },
          variables: { i, j, "arr[j]": arr[j], "arr[j+1]": arr[j + 1] },
          affected: [j, j + 1],
          explanation: `${arr[j + 1]} > ${arr[j]}, swap them. Array: [${arr.join(", ")}].`,
        });
      }
    }

    sorted.unshift(n - 1 - i);
    steps.push({
      step: stepNum++,
      event: EVENT_TYPES.MARK_SORTED,
      line: { cpp: 5, python: 4 },
      state: { array: [...arr], comparing: [], swapping: [], sorted: [...sorted] },
      variables: { i, sortedPosition: n - 1 - i },
      affected: [n - 1 - i],
      explanation: `Pass ${i + 1} complete. Position ${n - 1 - i} is now sorted.`,
    });
  }

  sorted.unshift(0);
  steps.push({
    step: stepNum++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 10 },
    state: { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], result: [...arr] },
    variables: {},
    affected: [],
    explanation: `Bubble Sort complete. Sorted array: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 2, compare: 9, swap: 10, mark_sorted: 5, complete: 14 },
  python: { initialize: 2, compare: 9, swap: 10, mark_sorted: 4, complete: 10 },
};

export const bubbleSort = {
  id: "bubble-sort",
  category: "Sorting",
  name: "Bubble Sort",
  description: "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
  complexity: { time: "O(n²)", space: "O(1)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "bubble-1", name: "Example 1", input: [5, 3, 8, 2, 4], expectedOutput: [2, 3, 4, 5, 8] },
    { id: "bubble-2", name: "Example 2", input: [7, 1, 6, 3, 2], expectedOutput: [1, 2, 3, 6, 7] },
  ],
  visualizationType: "array",
  generateSteps,
  lineMap,
};
