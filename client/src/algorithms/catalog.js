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

import {
  singlyInsertHead,
  singlyInsertEnd,
  singlyInsertMiddle,
  singlyDeleteHead,
  singlyDeleteEnd,
  singlyDeleteMiddle,
  singlySearch,
  singlyTraverse,
  singlyReverse,
} from "./linkedList/singlyLinkedList";

import {
  doublyInsertHead,
  doublyInsertEnd,
  doublyInsertMiddle,
  doublyDeleteHead,
  doublyDeleteEnd,
  doublyDeleteMiddle,
  doublySearch,
  doublyTraverse,
  doublyReverse,
} from "./linkedList/doublyLinkedList";

import {
  circularInsertHead,
  circularInsertEnd,
  circularInsertMiddle,
  circularDeleteHead,
  circularDeleteEnd,
  circularDeleteMiddle,
  circularSearch,
  circularTraverse,
  circularReverse,
} from "./linkedList/circularLinkedList";

import { fastSlowMiddle } from "./linkedList/fastSlowMiddle";

import { stackOperations } from "./stack/stackOperations";
import { monotonicStack } from "./stack/monotonicStack";

import { binaryTreeInorder } from "./trees/binaryTreeInorder";
import { bstSearch } from "./trees/bstSearch";
import { treeDfs } from "./trees/treeDfs";
import { treeBfs } from "./trees/treeBfs";

import { graphBfsTraversal } from "./graph/graphBfs";
import { dijkstraShortestPath } from "./graph/dijkstra";
import { graphDfsTraversal } from "./graph/graphDfs";
import { topologicalSortGraph } from "./graph/topologicalSort";
import { kruskalMst } from "./graph/kruskal";

import { uniquePathsDp } from "./dp/uniquePaths";
import { lcsDp } from "./dp/lcs";
import { climbingStairsDp } from "./dp/climbingStairs";
import { knapsack01Dp } from "./dp/knapsack01";
import { lisDp } from "./dp/lis";
import { matrixChainDp } from "./dp/matrixChain";

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

  // Singly Linked List
  singlyInsertHead,
  singlyInsertEnd,
  singlyInsertMiddle,
  singlyDeleteHead,
  singlyDeleteEnd,
  singlyDeleteMiddle,
  singlySearch,
  singlyTraverse,
  singlyReverse,

  // Doubly Linked List
  doublyInsertHead,
  doublyInsertEnd,
  doublyInsertMiddle,
  doublyDeleteHead,
  doublyDeleteEnd,
  doublyDeleteMiddle,
  doublySearch,
  doublyTraverse,
  doublyReverse,

  // Circular Linked List
  circularInsertHead,
  circularInsertEnd,
  circularInsertMiddle,
  circularDeleteHead,
  circularDeleteEnd,
  circularDeleteMiddle,
  circularSearch,
  circularTraverse,
  circularReverse,

  fastSlowMiddle,

  stackOperations,
  monotonicStack,
  binaryTreeInorder,
  bstSearch,
  treeDfs,
  treeBfs,
  graphBfsTraversal,
  dijkstraShortestPath,
  graphDfsTraversal,
  topologicalSortGraph,
  kruskalMst,
  uniquePathsDp,
  lcsDp,
  climbingStairsDp,
  knapsack01Dp,
  lisDp,
  matrixChainDp,
];
