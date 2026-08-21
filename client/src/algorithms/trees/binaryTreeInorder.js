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

const cppCode = `void inorder(Node* root) {
    if (root == nullptr) {
        return;
    }
    // Inorder: left subtree, current node, right subtree.
    inorder(root->left);
    visit(root->data);
    inorder(root->right);
}`;

const pythonCode = `def inorder(root):
    if root is None:
        return
    # Inorder: left subtree, current node, right subtree.
    inorder(root.left)
    visit(root.data)
    inorder(root.right)`;

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
    : [8, 4, 12, 2, 6, 10, 14];
  const levels = asTreeLevels(values);
  const { steps, push } = withStepFactory();
  const visited = [];

  function walk(index) {
    if (index >= values.length || values[index] == null) {
      return;
    }

    push({
      event: EVENT_TYPES.ENTER_NODE,
      line: { cpp: 2, python: 2 },
      state: {
        levels,
        currentNode: index,
        visited: [...visited],
        treeValues: values,
      },
      affected: [index],
      explanation: `Enter node ${values[index]}.`,
    });

    push({
      event: EVENT_TYPES.GO_LEFT,
      line: { cpp: 6, python: 6 },
      state: {
        levels,
        currentNode: index,
        visited: [...visited],
        treeValues: values,
      },
      affected: [index],
      explanation: `Traverse left from ${values[index]}.`,
    });
    walk(index * 2 + 1);

    visited.push(index);
    push({
      event: EVENT_TYPES.VISIT,
      line: { cpp: 7, python: 7 },
      state: {
        levels,
        currentNode: index,
        visited: [...visited],
        treeValues: values,
        order: visited.map((i) => values[i]),
      },
      affected: [index],
      explanation: `Visit node ${values[index]}.`,
    });

    push({
      event: EVENT_TYPES.GO_RIGHT,
      line: { cpp: 8, python: 8 },
      state: {
        levels,
        currentNode: index,
        visited: [...visited],
        treeValues: values,
      },
      affected: [index],
      explanation: `Traverse right from ${values[index]}.`,
    });
    walk(index * 2 + 2);
  }

  walk(0);

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 8, python: 8 },
    state: {
      levels,
      currentNode: -1,
      visited: [...visited],
      treeValues: values,
      result: visited.map((i) => values[i]),
    },
    explanation: "Inorder traversal complete.",
  });

  return steps;
}

export const binaryTreeInorder = {
  id: "tree-binary-inorder",
  category: "Trees",
  name: "Binary Tree - Inorder Traversal",
  description: "Traverse tree in left, root, right order.",
  complexity: { time: "O(n)", space: "O(h)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "inorder-1",
      name: "Example 1",
      input: { values: [8, 4, 12, 2, 6, 10, 14] },
      expectedOutput: [2, 4, 6, 8, 10, 12, 14],
    },
    {
      id: "inorder-2",
      name: "Example 2",
      input: { values: [5, 3, 7, 1, 4, 6, 9] },
      expectedOutput: [1, 3, 4, 5, 6, 7, 9],
    },
  ],
  visualizationType: "tree",
  generateSteps,
  lineMap: {
    cpp: { enter_node: 2, go_left: 6, visit: 7, go_right: 8, complete: 8 },
    python: { enter_node: 2, go_left: 6, visit: 7, go_right: 8, complete: 8 },
  }
};
