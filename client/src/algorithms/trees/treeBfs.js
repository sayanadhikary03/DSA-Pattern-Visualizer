import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void bfs(Node* root) {
    if (root == nullptr) {
        return;
    }
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* node = q.front();
        q.pop();
        visit(node->data);
        // Add children so they are processed level by level.
        if (node->left != nullptr) q.push(node->left);
        if (node->right != nullptr) q.push(node->right);
    }
}`;

const pythonCode = `from collections import deque

def bfs(root):
    if root is None:
        return
    q = deque([root])
    while q:
        node = q.popleft()
        visit(node.data)
        # Add children so they are processed level by level.
        if node.left is not None:
            q.append(node.left)
        if node.right is not None:
            q.append(node.right)`;

function buildLevels(values) {
  const levels = [];
  let width = 1;
  let index = 0;
  while (index < values.length) {
    levels.push(values.slice(index, index + width));
    index += width;
    width *= 2;
  }
  return levels;
}

function generateSteps(input) {
  const values = Array.isArray(input?.values)
    ? [...input.values]
    : [8, 4, 12, 2, 6, 10, 14];
  const levels = buildLevels(values);
  const visited = new Array(values.length).fill(false);
  const queue = [0];
  const order = [];
  const steps = [];
  let step = 0;

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 6, python: 7 },
    state: {
      treeValues: values,
      levels,
      queue: [...queue],
      visited: [...visited],
      currentNode: -1,
      order: [...order],
    },
    affected: [],
    explanation: "Initialize BFS queue with root node.",
  });

  visited[0] = true;

  while (queue.length) {
    const node = queue.shift();
    order.push(node);

    steps.push({
      step: step++,
      event: EVENT_TYPES.DEQUEUE,
      line: { cpp: 10, python: 9 },
      state: {
        treeValues: values,
        levels,
        queue: [...queue],
        visited: [...visited],
        currentNode: node,
        order: [...order],
      },
      affected: [node],
      explanation: `Dequeue node ${values[node]} and visit it.`,
    });

    const left = node * 2 + 1;
    const right = node * 2 + 2;

    if (left < values.length && values[left] != null) {
      queue.push(left);
      visited[left] = true;
      steps.push({
        step: step++,
        event: EVENT_TYPES.ENQUEUE_LEFT,
        line: { cpp: 16, python: 13 },
        state: {
          treeValues: values,
          levels,
          queue: [...queue],
          visited: [...visited],
          currentNode: node,
          order: [...order],
        },
        affected: [left],
        explanation: `Enqueue left child ${values[left]}.`,
      });
    }

    if (right < values.length && values[right] != null) {
      queue.push(right);
      visited[right] = true;
      steps.push({
        step: step++,
        event: EVENT_TYPES.ENQUEUE_RIGHT,
        line: { cpp: 17, python: 15 },
        state: {
          treeValues: values,
          levels,
          queue: [...queue],
          visited: [...visited],
          currentNode: node,
          order: [...order],
        },
        affected: [right],
        explanation: `Enqueue right child ${values[right]}.`,
      });
    }
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 17, python: 15 },
    state: {
      treeValues: values,
      levels,
      queue: [],
      visited: [...visited],
      currentNode: -1,
      order: order.map((i) => values[i]),
      result: order.map((i) => values[i]),
    },
    affected: [],
    explanation: `BFS complete. Order: ${order.map((i) => values[i]).join(" -> ")}.`,
  });

  return steps;
}

export const treeBfs = {
  id: "tree-bfs-level-order",
  category: "Trees",
  name: "Tree BFS - Level Order",
  description: "Traverse a binary tree level by level using a queue.",
  complexity: { time: "O(n)", space: "O(n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "tree-bfs-1",
      name: "Example 1",
      input: { values: [8, 4, 12, 2, 6, 10, 14] },
      expectedOutput: [8, 4, 12, 2, 6, 10, 14],
    },
    {
      id: "tree-bfs-2",
      name: "Example 2",
      input: { values: [5, 3, 7, 1, 4, 6, 9] },
      expectedOutput: [5, 3, 7, 1, 4, 6, 9],
    },
  ],
  visualizationType: "tree",
  generateSteps,
  lineMap: {
    cpp: { initialize: 6, dequeue: 11, enqueue_left: 17, enqueue_right: 18, complete: 19 },
    python: { initialize: 7, dequeue: 9, enqueue_left: 13, enqueue_right: 15, complete: 16 },
  }
};
