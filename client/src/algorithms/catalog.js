import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";
import { heapSort } from "./sorting/heapSort";

import { slidingWindow } from "./arrays/slidingWindow";
import { twoPointer } from "./arrays/twoPointer";
import { prefixSum } from "./arrays/prefixSum";
import { kadane } from "./arrays/kadane";

export const algorithmCatalog = [
  slidingWindow,
  twoPointer,
  prefixSum,
  kadane,
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
];
