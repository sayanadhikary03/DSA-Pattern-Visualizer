import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `int partitionArray(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {

        // Move smaller values before pivot
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);

    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low >= high)
        return;

    int pivotIndex = partitionArray(arr, low, high);

    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
}`;

const pythonCode = `def quick_sort(arr, low, high):
    if low >= high:
        return

    pivot = arr[high]
    i = low - 1

    for j in range(low, high):

        # Move smaller values before pivot
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]

    pivot_index = i + 1

    quick_sort(arr, low, pivot_index - 1)
    quick_sort(arr, pivot_index + 1, high)`;

function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [...(input.arr || input)];
  const steps = [];
  let stepNum = 0;
  const sorted = new Set();

  steps.push({
    step: stepNum++, event: EVENT_TYPES.INITIALIZE, line: { cpp: 19, python: 1 },
    state: { array: [...arr], pivot: -1, partitionBoundary: -1, sorted: [], comparing: [] },
    variables: {}, affected: [],
    explanation: `Start Quick Sort on [${arr.join(", ")}].`,
  });

  function quickSortHelper(low, high) {
    if (low >= high) {
      if (low === high) sorted.add(low);
      return;
    }

    const pivot = arr[high];
    steps.push({
      step: stepNum++, event: EVENT_TYPES.SELECT_PIVOT, line: { cpp: 2, python: 4 },
      state: { array: [...arr], pivot: high, pivotValue: pivot, low, high, sorted: [...sorted] },
      variables: { pivot, low, high }, affected: [high],
      explanation: `Select pivot = arr[${high}] = ${pivot}. Partition range [${low}..${high}].`,
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        step: stepNum++, event: EVENT_TYPES.COMPARE, line: { cpp: 8, python: 10 },
        state: { array: [...arr], pivot: high, pivotValue: pivot, i, j, low, high, sorted: [...sorted], comparing: [j] },
        variables: { j, "arr[j]": arr[j], pivot }, affected: [j, high],
        explanation: `Compare arr[${j}] = ${arr[j]} with pivot ${pivot}.`,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
          steps.push({
            step: stepNum++, event: EVENT_TYPES.SWAP, line: { cpp: 10, python: 12 },
            state: { array: [...arr], pivot: high, pivotValue: pivot, i, j, low, high, sorted: [...sorted], swapping: [i, j] },
            variables: { i, j }, affected: [i, j],
            explanation: `${arr[j]} < pivot. Swap arr[${i}] and arr[${j}].`,
          });
        } else {
          steps.push({
            step: stepNum++, event: EVENT_TYPES.MOVE_TO_LEFT_PARTITION, line: { cpp: 9, python: 11 },
            state: { array: [...arr], pivot: high, pivotValue: pivot, i, j, low, high, sorted: [...sorted] },
            variables: { i, j }, affected: [j],
            explanation: `${arr[j]} < pivot. Already in position.`,
          });
        }
      }
    }

    // Place pivot
    const pivotFinal = i + 1;
    const temp = arr[pivotFinal]; arr[pivotFinal] = arr[high]; arr[high] = temp;

    steps.push({
      step: stepNum++, event: EVENT_TYPES.PLACE_PIVOT, line: { cpp: 14, python: 15 },
      state: { array: [...arr], pivotIndex: pivotFinal, pivotValue: pivot, low, high, sorted: [...sorted] },
      variables: { pivotIndex: pivotFinal }, affected: [pivotFinal, high],
      explanation: `Place pivot ${pivot} at index ${pivotFinal}. Array: [${arr.join(", ")}].`,
    });

    sorted.add(pivotFinal);

    steps.push({
      step: stepNum++, event: EVENT_TYPES.PARTITION_COMPLETE, line: { cpp: 16, python: 17 },
      state: { array: [...arr], pivotIndex: pivotFinal, low, high, sorted: [...sorted] },
      variables: { pivotIndex: pivotFinal }, affected: Array.from({ length: high - low + 1 }, (_, k) => low + k),
      explanation: `Partition complete. Pivot at ${pivotFinal}. Left: [${low}..${pivotFinal - 1}], Right: [${pivotFinal + 1}..${high}].`,
    });

    quickSortHelper(low, pivotFinal - 1);
    quickSortHelper(pivotFinal + 1, high);
  }

  quickSortHelper(0, arr.length - 1);

  steps.push({
    step: stepNum++, event: EVENT_TYPES.COMPLETE, line: { cpp: 27, python: 19 },
    state: { array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i), result: [...arr] },
    variables: {}, affected: [],
    explanation: `Quick Sort complete. Sorted: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 19, select_pivot: 2, compare: 8, swap: 10, place_pivot: 14, partition_complete: 16, complete: 27 },
  python: { initialize: 1, select_pivot: 4, compare: 10, swap: 12, place_pivot: 15, partition_complete: 17, complete: 19 },
};

export const quickSort = {
  id: "quick-sort", category: "Sorting", name: "Quick Sort",
  description: "Quick Sort selects a pivot, partitions elements around it, then recursively sorts each partition.",
  complexity: { time: "O(n log n) avg, O(n²) worst", space: "O(log n)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "quick-1", name: "Example 1", input: [8, 3, 7, 2, 5, 9], expectedOutput: [2, 3, 5, 7, 8, 9] },
    { id: "quick-2", name: "Example 2", input: [10, 4, 7, 3, 8, 2], expectedOutput: [2, 3, 4, 7, 8, 10] },
  ],
  visualizationType: "array", generateSteps, lineMap,
};
