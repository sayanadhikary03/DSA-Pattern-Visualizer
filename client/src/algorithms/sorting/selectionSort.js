import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void selectionSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;

        for (int j = i + 1; j < n; j++) {

            // Find the smallest element
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        swap(arr[i], arr[minIndex]);
    }
}`;

const pythonCode = `def selection_sort(arr):
    n = len(arr)

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):

            # Find the smallest element
            if arr[j] < arr[min_index]:
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]`;

function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [...(input.arr || input)];
  const steps = [];
  let stepNum = 0;
  const n = arr.length;
  const sorted = [];

  steps.push({
    step: stepNum++, event: EVENT_TYPES.INITIALIZE, line: { cpp: 2, python: 2 },
    state: { array: [...arr], comparing: [], sorted: [], minIndex: -1, currentI: -1 },
    variables: { n }, affected: [],
    explanation: `Start Selection Sort on [${arr.join(", ")}].`,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    steps.push({
      step: stepNum++, event: EVENT_TYPES.SELECT_POSITION, line: { cpp: 5, python: 5 },
      state: { array: [...arr], comparing: [], sorted: [...sorted], minIndex: i, currentI: i },
      variables: { i, minIndex: i }, affected: [i],
      explanation: `Pass ${i + 1}: find minimum from index ${i} to ${n - 1}. Assume min = arr[${i}] = ${arr[i]}.`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        step: stepNum++, event: EVENT_TYPES.COMPARE, line: { cpp: 10, python: 10 },
        state: { array: [...arr], comparing: [j, minIndex], sorted: [...sorted], minIndex, currentI: i },
        variables: { i, j, minIndex, "arr[j]": arr[j], "arr[min]": arr[minIndex] }, affected: [j, minIndex],
        explanation: `Compare arr[${j}] = ${arr[j]} with current min arr[${minIndex}] = ${arr[minIndex]}.`,
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push({
          step: stepNum++, event: EVENT_TYPES.UPDATE_MINIMUM, line: { cpp: 11, python: 11 },
          state: { array: [...arr], comparing: [], sorted: [...sorted], minIndex, currentI: i },
          variables: { i, j, minIndex }, affected: [minIndex],
          explanation: `New minimum found: arr[${minIndex}] = ${arr[minIndex]}.`,
        });
      }
    }

    if (minIndex !== i) {
      const temp = arr[i]; arr[i] = arr[minIndex]; arr[minIndex] = temp;
      steps.push({
        step: stepNum++, event: EVENT_TYPES.SWAP, line: { cpp: 15, python: 13 },
        state: { array: [...arr], comparing: [], sorted: [...sorted], minIndex, currentI: i, swapping: [i, minIndex] },
        variables: { i, minIndex }, affected: [i, minIndex],
        explanation: `Swap arr[${i}] and arr[${minIndex}]. Array: [${arr.join(", ")}].`,
      });
    }

    sorted.push(i);
    steps.push({
      step: stepNum++, event: EVENT_TYPES.MARK_SORTED, line: { cpp: 15, python: 13 },
      state: { array: [...arr], comparing: [], sorted: [...sorted], minIndex: -1, currentI: -1 },
      variables: { sortedPosition: i }, affected: [i],
      explanation: `Position ${i} is now sorted with value ${arr[i]}.`,
    });
  }

  sorted.push(n - 1);
  steps.push({
    step: stepNum++, event: EVENT_TYPES.COMPLETE, line: { cpp: 17, python: 13 },
    state: { array: [...arr], comparing: [], sorted: [...sorted], result: [...arr] },
    variables: {}, affected: [],
    explanation: `Selection Sort complete. Sorted: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 2, select_position: 5, compare: 10, update_minimum: 11, swap: 15, mark_sorted: 15, complete: 17 },
  python: { initialize: 2, select_position: 5, compare: 10, update_minimum: 11, swap: 13, mark_sorted: 13, complete: 13 },
};

export const selectionSort = {
  id: "selection-sort", category: "Sorting", name: "Selection Sort",
  description: "Selection Sort finds the minimum element in the unsorted region and places it at the beginning.",
  complexity: { time: "O(n²)", space: "O(1)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "selection-1", name: "Example 1", input: [7, 3, 5, 1, 9], expectedOutput: [1, 3, 5, 7, 9] },
    { id: "selection-2", name: "Example 2", input: [6, 4, 8, 2, 5], expectedOutput: [2, 4, 5, 6, 8] },
  ],
  visualizationType: "array", generateSteps, lineMap,
};
