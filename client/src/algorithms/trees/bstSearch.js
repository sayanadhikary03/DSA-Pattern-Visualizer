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

const cppCode = `bool search(Node* root, int target) {
    if (root == nullptr) {
        return false;
    }
    if (root->data == target) {
        return true;
    }
    // BST property tells us which subtree to search.
    if (target < root->data) {
        return search(root->left, target);
    }
    return search(root->right, target);
}`;

const pythonCode = `def search(root, target):
    if root is None:
        return False
    if root.data == target:
        return True
    # BST property tells us which subtree to search.
    if target < root.data:
        return search(root.left, target)
    return search(root.right, target)`;

function asTreeLevels(values) {
  const levels = [];
  let start = 0;
  let width = 1;

  while (start < values.length) {
    levels.push(values.slice(start, start + width));
    start += width;
    width *= 2;
  }

  return levels;
}

function generateSteps(input) {
  const values = Array.isArray(input?.values)
    ? [...input.values]
    : [10, 5, 15, 3, 7, 12, 18];
  const target = Number.isFinite(input?.target) ? input.target : 12;
  const levels = asTreeLevels(values);
  const { steps, push } = withStepFactory();
  let index = 0;
  const path = [];

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: { levels, treeValues: values, target, currentNode: 0, path: [] },
    explanation: `Search for ${target} in BST.`,
  });

  while (index < values.length && values[index] != null) {
    const value = values[index];
    path.push(index);

    push({
      event: EVENT_TYPES.COMPARE,
      line: { cpp: 5, python: 5 },
      state: {
        levels,
        treeValues: values,
        target,
        currentNode: index,
        path: [...path],
      },
      affected: [index],
      explanation: `Compare target ${target} with node ${value}.`,
    });

    if (value === target) {
      push({
        event: EVENT_TYPES.FOUND,
        line: { cpp: 6, python: 6 },
        state: {
          levels,
          treeValues: values,
          target,
          currentNode: index,
          path: [...path],
          found: true,
        },
        affected: [index],
        explanation: `Found target ${target}.`,
      });
      push({
        event: EVENT_TYPES.COMPLETE,
        line: { cpp: 6, python: 6 },
        state: {
          levels,
          treeValues: values,
          target,
          currentNode: index,
          path: [...path],
          result: true,
        },
        explanation: "BST search complete.",
      });
      return steps;
    }

    if (target < value) {
      push({
        event: EVENT_TYPES.GO_LEFT,
        line: { cpp: 9, python: 9 },
        state: {
          levels,
          treeValues: values,
          target,
          currentNode: index,
          path: [...path],
        },
        explanation: `${target} < ${value}, move left.`,
      });
      index = index * 2 + 1;
    } else {
      push({
        event: EVENT_TYPES.GO_RIGHT,
        line: { cpp: 11, python: 10 },
        state: {
          levels,
          treeValues: values,
          target,
          currentNode: index,
          path: [...path],
        },
        explanation: `${target} > ${value}, move right.`,
      });
      index = index * 2 + 2;
    }
  }

  push({
    event: EVENT_TYPES.NOT_FOUND,
    line: { cpp: 3, python: 3 },
    state: {
      levels,
      treeValues: values,
      target,
      currentNode: -1,
      path: [...path],
      result: false,
    },
    explanation: `Reached null. Target ${target} was not found.`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 3, python: 3 },
    state: {
      levels,
      treeValues: values,
      target,
      currentNode: -1,
      path: [...path],
      result: false,
    },
    explanation: "BST search complete.",
  });

  return steps;
}

export const bstSearch = {
  id: "tree-bst-search",
  category: "Trees",
  name: "BST - Search",
  description: "Search a value in BST using ordered property.",
  complexity: { time: "O(h)", space: "O(h)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "bst-1",
      name: "Example 1",
      input: { values: [10, 5, 15, 3, 7, 12, 18], target: 12 },
      expectedOutput: true,
    },
    {
      id: "bst-2",
      name: "Example 2",
      input: { values: [10, 5, 15, 3, 7, 12, 18], target: 11 },
      expectedOutput: false,
    },
  ],
  visualizationType: "tree",
  generateSteps,
  lineMap: {
    cpp: { initialize: 2, compare: 5, found: 6, go_left: 9, go_right: 11, not_found: 3, complete: 3 },
    python: { initialize: 2, compare: 5, found: 6, go_left: 9, go_right: 10, not_found: 3, complete: 3 },
  }
};
