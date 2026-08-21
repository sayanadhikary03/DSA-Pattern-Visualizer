import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;

    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);

        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Move maximum to sorted section
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`;
const pythonCode = `def heapify(arr, n, i):
    largest = i

    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)`;
function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [...(input.arr || input)];
  const steps = [];
  let stepNum = 0;
  const n = arr.length;
  const sorted = [];

  steps.push({
    step: stepNum++, event: EVENT_TYPES.INITIALIZE, line: { cpp: 21, python: 19 },
    state: { array: [...arr], sorted: [], heapSize: n, phase: "build" },
    variables: { n }, affected: [],
    explanation: `Start Heap Sort on [${arr.join(", ")}]. First build a max heap.`,
  });

  function heapifySteps(heapSize, i, phase) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      step: stepNum++, event: EVENT_TYPES.COMPARE_PARENT_CHILD, line: { cpp: 7, python: 6 },
      state: { array: [...arr], sorted: [...sorted], heapSize, parent: i, left, right, largest, phase },
      variables: { i, left, right, largest },
      affected: [i, ...(left < heapSize ? [left] : []), ...(right < heapSize ? [right] : [])],
      explanation: `Heapify at index ${i}. Compare with children: left=${left < heapSize ? arr[left] : "N/A"}, right=${right < heapSize ? arr[right] : "N/A"}.`,
    });

    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      const temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
      steps.push({
        step: stepNum++, event: EVENT_TYPES.SWAP_HEAP, line: { cpp: 14, python: 14 },
        state: { array: [...arr], sorted: [...sorted], heapSize, parent: i, swapped: largest, phase },
        variables: { i, largest }, affected: [i, largest],
        explanation: `Swap arr[${i}] and arr[${largest}]. Array: [${arr.join(", ")}].`,
      });
      heapifySteps(heapSize, largest, phase);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifySteps(n, i, "build");
  }

  steps.push({
    step: stepNum++, event: EVENT_TYPES.HEAPIFY, line: { cpp: 25, python: 23 },
    state: { array: [...arr], sorted: [...sorted], heapSize: n, phase: "extract" },
    variables: {}, affected: [],
    explanation: `Max heap built: [${arr.join(", ")}]. Now extract elements.`,
  });

  // Extract
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      step: stepNum++, event: EVENT_TYPES.EXTRACT_MAX, line: { cpp: 29, python: 26 },
      state: { array: [...arr], sorted: [...sorted], heapSize: i + 1, extracting: 0, target: i },
      variables: { max: arr[0], position: i }, affected: [0, i],
      explanation: `Extract max ${arr[0]} → move to position ${i}.`,
    });

    const temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
    sorted.unshift(i);

    steps.push({
      step: stepNum++, event: EVENT_TYPES.SWAP, line: { cpp: 29, python: 26 },
      state: { array: [...arr], sorted: [...sorted], heapSize: i },
      variables: {}, affected: [0, i],
      explanation: `Swapped. Array: [${arr.join(", ")}]. Position ${i} sorted.`,
    });

    heapifySteps(i, 0, "extract");
  }

  sorted.unshift(0);
  steps.push({
    step: stepNum++, event: EVENT_TYPES.COMPLETE, line: { cpp: 31, python: 28 },
    state: { array: [...arr], sorted: [...sorted], result: [...arr] },
    variables: {}, affected: [],
    explanation: `Heap Sort complete. Sorted: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 21, compare_parent_child: 7, swap_heap: 14, heapify: 25, extract_max: 29, swap: 29, mark_sorted: 29, complete: 31 },
  python: { initialize: 19, compare_parent_child: 6, swap_heap: 14, heapify: 23, extract_max: 26, swap: 26, mark_sorted: 26, complete: 28 },
};

export const heapSort = {
  id: "heap-sort", category: "Sorting", name: "Heap Sort",
  description: "Heap Sort builds a max heap then repeatedly extracts the maximum to sort the array.",
  complexity: { time: "O(n log n)", space: "O(1)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "heap-1", name: "Example 1", input: [9, 7, 8, 3, 2, 5], expectedOutput: [2, 3, 5, 7, 8, 9] },
    { id: "heap-2", name: "Example 2", input: [10, 4, 6, 2, 8, 1], expectedOutput: [1, 2, 4, 6, 8, 10] },
  ],
  visualizationType: "heap", generateSteps, lineMap,
};
