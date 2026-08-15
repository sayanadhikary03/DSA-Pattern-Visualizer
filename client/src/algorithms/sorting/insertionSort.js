import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;

        // Shift larger elements right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }
}`;

const pythonCode = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Shift larger elements right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key`;

function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [...(input.arr || input)];
  const steps = [];
  let stepNum = 0;
  const sorted = [0];

  steps.push({
    step: stepNum++, event: EVENT_TYPES.INITIALIZE, line: { cpp: 1, python: 1 },
    state: { array: [...arr], sorted: [0], keyIndex: -1, key: null, shifting: [] },
    variables: {}, affected: [],
    explanation: `Start Insertion Sort on [${arr.join(", ")}]. First element is trivially sorted.`,
  });

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];

    steps.push({
      step: stepNum++, event: EVENT_TYPES.SELECT_KEY, line: { cpp: 3, python: 3 },
      state: { array: [...arr], sorted: [...sorted], keyIndex: i, key, shifting: [] },
      variables: { i, key }, affected: [i],
      explanation: `Select key = arr[${i}] = ${key}. Insert it into the sorted portion.`,
    });

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({
        step: stepNum++, event: EVENT_TYPES.COMPARE, line: { cpp: 7, python: 7 },
        state: { array: [...arr], sorted: [...sorted], keyIndex: i, key, shifting: [j] },
        variables: { j, "arr[j]": arr[j], key }, affected: [j],
        explanation: `arr[${j}] = ${arr[j]} > key ${key}? Yes, shift right.`,
      });

      arr[j + 1] = arr[j];
      steps.push({
        step: stepNum++, event: EVENT_TYPES.SHIFT, line: { cpp: 8, python: 8 },
        state: { array: [...arr], sorted: [...sorted], keyIndex: i, key, shifting: [j, j + 1] },
        variables: { j }, affected: [j, j + 1],
        explanation: `Shift arr[${j}] = ${arr[j]} one position right to index ${j + 1}.`,
      });

      j--;
    }

    if (j >= 0) {
      steps.push({
        step: stepNum++, event: EVENT_TYPES.COMPARE, line: { cpp: 7, python: 7 },
        state: { array: [...arr], sorted: [...sorted], keyIndex: i, key, shifting: [] },
        variables: { j, "arr[j]": arr[j], key }, affected: [j],
        explanation: `arr[${j}] = ${arr[j]} > key ${key}? No, stop shifting.`,
      });
    }

    arr[j + 1] = key;
    steps.push({
      step: stepNum++, event: EVENT_TYPES.INSERT_KEY, line: { cpp: 11, python: 11 },
      state: { array: [...arr], sorted: [...sorted], keyIndex: j + 1, key, shifting: [] },
      variables: { "position": j + 1, key }, affected: [j + 1],
      explanation: `Insert key ${key} at position ${j + 1}. Array: [${arr.join(", ")}].`,
    });

    sorted.push(i);
    steps.push({
      step: stepNum++, event: EVENT_TYPES.MARK_SORTED, line: { cpp: 2, python: 2 },
      state: { array: [...arr], sorted: [...sorted], keyIndex: -1, key: null, shifting: [] },
      variables: {}, affected: [...sorted],
      explanation: `Elements [0..${i}] are now sorted.`,
    });
  }

  steps.push({
    step: stepNum++, event: EVENT_TYPES.COMPLETE, line: { cpp: 13, python: 11 },
    state: { array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i), result: [...arr] },
    variables: {}, affected: [],
    explanation: `Insertion Sort complete. Sorted: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 1, select_key: 3, compare: 7, shift: 8, insert_key: 11, mark_sorted: 2, complete: 13 },
  python: { initialize: 1, select_key: 3, compare: 7, shift: 8, insert_key: 11, mark_sorted: 2, complete: 11 },
};

export const insertionSort = {
  id: "insertion-sort", category: "Sorting", name: "Insertion Sort",
  description: "Insertion Sort builds the sorted array one element at a time by inserting each into its correct position.",
  complexity: { time: "O(n²)", space: "O(1)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "insertion-1", name: "Example 1", input: [5, 3, 8, 2, 4], expectedOutput: [2, 3, 4, 5, 8] },
    { id: "insertion-2", name: "Example 2", input: [9, 7, 5, 3, 1], expectedOutput: [1, 3, 5, 7, 9] },
  ],
  visualizationType: "array", generateSteps, lineMap,
};
