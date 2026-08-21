import { EVENT_TYPES } from "../../engine/eventTypes";

const cppCode = `void dfs(Node* root) {
    if (root == nullptr) {
        return;
    }
    visit(root->data);
    dfs(root->left);
    dfs(root->right);
}`;

const pythonCode = `def dfs(root):
    if root is None:
        return
    visit(root.data)
    dfs(root.left)
    dfs(root.right)`;

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
  const steps = [];
  let step = 0;
  const visited = [];

  function walk(index) {
    if (index >= values.length || values[index] == null) {
      return;
    }

    steps.push({
      step: step++,
      event: EVENT_TYPES.VISIT,
      line: { cpp: 6, python: 5 },
      state: {
        treeValues: values,
        levels,
        currentNode: index,
        visited: [...visited],
      },
      affected: [index],
      explanation: `Visit node ${values[index]}.`,
    });

    visited.push(index);

    if (index * 2 + 1 < values.length && values[index * 2 + 1] != null) {
      steps.push({
        step: step++,
        event: EVENT_TYPES.GO_LEFT,
        line: { cpp: 7, python: 6 },
        state: {
          treeValues: values,
          levels,
          currentNode: index,
          visited: [...visited],
          nextNode: index * 2 + 1,
        },
        affected: [index],
        explanation: `Go left from ${values[index]}.`,
      });
    }
    walk(index * 2 + 1);

    if (index * 2 + 2 < values.length && values[index * 2 + 2] != null) {
      steps.push({
        step: step++,
        event: EVENT_TYPES.GO_RIGHT,
        line: { cpp: 8, python: 7 },
        state: {
          treeValues: values,
          levels,
          currentNode: index,
          visited: [...visited],
          nextNode: index * 2 + 2,
        },
        affected: [index],
        explanation: `Go right from ${values[index]}.`,
      });
    }
    walk(index * 2 + 2);

    steps.push({
      step: step++,
      event: EVENT_TYPES.BACKTRACK,
      line: { cpp: 8, python: 7 },
      state: {
        treeValues: values,
        levels,
        currentNode: index,
        visited: [...visited],
      },
      affected: [index],
      explanation: `Backtrack from ${values[index]}.`,
    });
  }

  steps.push({
    step: step++,
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: { treeValues: values, levels, currentNode: 0, visited: [] },
    affected: [],
    explanation: "Initialize DFS traversal.",
  });

  walk(0);

  steps.push({
    step: step++,
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 8, python: 7 },
    state: {
      treeValues: values,
      levels,
      currentNode: -1,
      visited: [...visited],
      result: visited.map((i) => values[i]),
    },
    affected: [],
    explanation: `DFS complete. Order: ${visited.map((i) => values[i]).join(" -> ")}.`,
  });

  return steps;
}

export const treeDfs = {
  id: "tree-dfs",
  category: "Trees",
  name: "Tree DFS",
  description: "Depth-first traversal using preorder recursion.",
  complexity: { time: "O(n)", space: "O(h)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "tree-dfs-1",
      name: "Example 1",
      input: { values: [8, 4, 12, 2, 6, 10, 14] },
      expectedOutput: [8, 4, 2, 6, 12, 10, 14],
    },
    {
      id: "tree-dfs-2",
      name: "Example 2",
      input: { values: [5, 3, 7, 1, 4, 6, 9] },
      expectedOutput: [5, 3, 1, 4, 7, 6, 9],
    },
  ],
  visualizationType: "tree",
  generateSteps,
  lineMap: {
    cpp: { initialize: 2, visit: 6, go_left: 7, go_right: 8, backtrack: 8, complete: 8 },
    python: { initialize: 2, visit: 5, go_left: 6, go_right: 7, backtrack: 7, complete: 7 },
  }
};
