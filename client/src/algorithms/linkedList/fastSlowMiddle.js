import { EVENT_TYPES } from "../../engine/eventTypes";

function withStepFactory() {
  const steps = [];
  let step = 0;

  const push = ({
    event,
    line,
    state,
    variables = {},
    affected = [],
    explanation,
  }) => {
    steps.push({
      step: step++,
      event,
      line,
      state,
      variables,
      affected,
      explanation,
    });
  };

  return { steps, push };
}

const cppCode = `Node* findMiddle(Node* head) {
    Node* slow = head; // Moves one node at a time
    Node* fast = head; // Moves two nodes at a time
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;       // Move slow by one
        fast = fast->next->next; // Move fast by two
    }
    return slow; // Slow reaches the middle when fast reaches the end
}`

const pythonCode = `def find_middle(head):
    slow = head  # Moves one node at a time
    fast = head  # Moves two nodes at a time
    while fast is not None and fast.next is not None:
        slow = slow.next        # Move slow by one
        fast = fast.next.next   # Move fast by two
    return slow  # Slow reaches the middle when fast reaches the end`

function generateSteps(input) {
  const nodes = Array.isArray(input?.nodes)
    ? [...input.nodes]
    : [10, 20, 30, 40, 50];
  const { steps, push } = withStepFactory();
  let slow = 0;
  let fast = 0;

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: { nodes: [...nodes], listType: "singly", slow, fast },
    explanation: "Initialize slow and fast pointers at head.",
  });

  while (fast < nodes.length - 1) {
    slow += 1;
    fast += 2;

    push({
      event: EVENT_TYPES.MOVE_SLOW,
      line: { cpp: 6, python: 6 },
      state: {
        nodes: [...nodes],
        listType: "singly",
        slow,
        fast: Math.min(fast, nodes.length - 1),
      },
      affected: [slow],
      explanation: `Move slow by one step to index ${slow}.`,
    });

    push({
      event: EVENT_TYPES.MOVE_FAST,
      line: { cpp: 7, python: 7 },
      state: {
        nodes: [...nodes],
        listType: "singly",
        slow,
        fast: Math.min(fast, nodes.length - 1),
      },
      affected: [Math.min(fast, nodes.length - 1)],
      explanation: "Move fast by two steps.",
    });

    if (fast >= nodes.length - 1) {
      break;
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 9 },
    state: {
      nodes: [...nodes],
      listType: "singly",
      slow,
      fast: Math.min(fast, nodes.length - 1),
      middleIndex: slow,
      result: nodes[slow],
    },
    affected: [slow],
    explanation: `Fast reached end. Middle node is ${nodes[slow]}.`,
  });

  return steps;
}

export const fastSlowMiddle = {
  id: "linked-list-fast-slow-middle",
  category: "Linked List",
  name: "Fast and Slow Pointer - Middle Node",
  description:
    "Use fast/slow pointers to find the middle node in one traversal.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "fs-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40, 50] },
      expectedOutput: 30,
    },
    {
      id: "fs-2",
      name: "Example 2",
      input: { nodes: [1, 2, 3, 4, 5, 6] },
      expectedOutput: 4,
    },
  ],
  visualizationType: "linked-list",
  generateSteps,
  lineMap: {
    cpp: { initialize: 2, move_slow: 5, move_fast: 6, complete: 8 },
    python: { initialize: 2, move_slow: 5, move_fast: 6, complete: 8 },
  },
};
