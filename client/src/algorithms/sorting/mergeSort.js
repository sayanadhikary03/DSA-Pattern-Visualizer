import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void mergeArray(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;

    int i = left;
    int j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i]);
            i++;
        }
        else {
            temp.push_back(arr[j]);
            j++;
        }
    }

    while (i <= mid) {
        temp.push_back(arr[i]);
        i++;
    }

    while (j <= right) {
        temp.push_back(arr[j]);
        j++;
    }

    for (int k = 0; k < temp.size(); k++) {
        arr[left + k] = temp[k];
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right)
        return;

    int mid = left + (right - left) / 2;

    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    mergeArray(arr, left, mid, right);
}`;
const pythonCode = `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2

    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    result = []
    i = 0
    j = 0

    # Merge two sorted halves
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result`;
function generateSteps(input) {
  const originalArr = Array.isArray(input) ? [...input] : [...(input.arr || input)];
  const steps = [];
  let stepNum = 0;
  const arr = [...originalArr];

  steps.push({
    step: stepNum++, event: EVENT_TYPES.INITIALIZE, line: { cpp: 35, python: 1 },
    state: { array: [...arr], ranges: [], merging: [], sorted: [] },
    variables: {}, affected: [],
    explanation: `Start Merge Sort on [${arr.join(", ")}].`,
  });

  function mergeSortHelper(left, right) {
    if (left >= right) return;

    const mid = Math.floor(left + (right - left) / 2);

    steps.push({
      step: stepNum++, event: EVENT_TYPES.SPLIT, line: { cpp: 39, python: 5 },
      state: { array: [...arr], splitLeft: left, splitMid: mid, splitRight: right },
      variables: { left, mid, right },
      affected: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      explanation: `Split [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].`,
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);

    // Merge
    const temp = [];
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push({
        step: stepNum++, event: EVENT_TYPES.COMPARE, line: { cpp: 8, python: 15 },
        state: { array: [...arr], mergeLeft: left, mergeMid: mid, mergeRight: right, i, j, temp: [...temp] },
        variables: { i, j, "arr[i]": arr[i], "arr[j]": arr[j] },
        affected: [i, j],
        explanation: `Compare arr[${i}] = ${arr[i]} with arr[${j}] = ${arr[j]}.`,
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        steps.push({
          step: stepNum++, event: EVENT_TYPES.TAKE_LEFT, line: { cpp: 9, python: 16 },
          state: { array: [...arr], mergeLeft: left, mergeMid: mid, mergeRight: right, i, j, temp: [...temp] },
          variables: { taken: arr[i] }, affected: [i],
          explanation: `Take ${arr[i]} from left half.`,
        });
        i++;
      } else {
        temp.push(arr[j]);
        steps.push({
          step: stepNum++, event: EVENT_TYPES.TAKE_RIGHT, line: { cpp: 14, python: 19 },
          state: { array: [...arr], mergeLeft: left, mergeMid: mid, mergeRight: right, i, j, temp: [...temp] },
          variables: { taken: arr[j] }, affected: [j],
          explanation: `Take ${arr[j]} from right half.`,
        });
        j++;
      }
    }

    while (i <= mid) { temp.push(arr[i]); i++; }
    while (j <= right) { temp.push(arr[j]); j++; }

    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
    }

    steps.push({
      step: stepNum++, event: EVENT_TYPES.MERGE, line: { cpp: 44, python: 25 },
      state: { array: [...arr], mergeLeft: left, mergeRight: right, merged: temp },
      variables: {}, affected: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      explanation: `Merged [${left}..${right}] → [${temp.join(", ")}].`,
    });
  }

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    step: stepNum++, event: EVENT_TYPES.COMPLETE, line: { cpp: 44, python: 25 },
    state: { array: [...arr], result: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i) },
    variables: {}, affected: [],
    explanation: `Merge Sort complete. Sorted: [${arr.join(", ")}].`,
  });

  return steps;
}

const lineMap = {
  cpp: { initialize: 35, split: 39, compare: 8, take_left: 9, take_right: 14, merge: 44, complete: 44 },
  python: { initialize: 1, split: 5, compare: 15, take_left: 16, take_right: 19, merge: 25, complete: 25 },
};

export const mergeSort = {
  id: "merge-sort", category: "Sorting", name: "Merge Sort",
  description: "Merge Sort divides the array into halves, sorts each, then merges them back in order.",
  complexity: { time: "O(n log n)", space: "O(n)" },
  languages: { cpp: { code: cppCode, readOnly: true }, python: { code: pythonCode, readOnly: true } },
  testCases: [
    { id: "merge-1", name: "Example 1", input: [8, 3, 7, 2, 5], expectedOutput: [2, 3, 5, 7, 8] },
    { id: "merge-2", name: "Example 2", input: [10, 4, 6, 2, 8, 1], expectedOutput: [1, 2, 4, 6, 8, 10] },
  ],
  visualizationType: "array", generateSteps, lineMap,
};
