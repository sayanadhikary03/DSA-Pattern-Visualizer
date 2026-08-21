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

const cppCode = `vector<int> nextGreater(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        // Resolve smaller elements when a greater value appears.
        while (!st.empty() && arr[st.top()] < arr[i]) {
            result[st.top()] = arr[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}`;

const pythonCode = `def next_greater(arr):
    result = [-1] * len(arr)
    st = []
    for i in range(len(arr)):
        # Resolve smaller elements when a greater value appears.
        while st and arr[st[-1]] < arr[i]:
            idx = st.pop()
            result[idx] = arr[i]
        st.append(i)
    return result`;

function generateSteps(input) {
  const arr = Array.isArray(input) ? [...input] : [4, 5, 2, 10, 8];
  const result = new Array(arr.length).fill(-1);
  const st = [];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 2, python: 2 },
    state: {
      array: [...arr],
      stackIndices: [...st],
      result: [...result],
      currentIndex: -1,
    },
    explanation: "Initialize result with -1 and empty monotonic stack.",
  });

  for (let i = 0; i < arr.length; i++) {
    while (st.length && arr[st[st.length - 1]] < arr[i]) {
      const idx = st.pop();
      result[idx] = arr[i];
      push({
        event: EVENT_TYPES.RESOLVE_NEXT_GREATER,
        line: { cpp: 9, python: 8 },
        state: {
          array: [...arr],
          stackIndices: [...st],
          result: [...result],
          currentIndex: i,
          resolvedIndex: idx,
        },
        affected: [idx, i],
        explanation: `${arr[i]} is the next greater for arr[${idx}] = ${arr[idx]}.`,
      });
    }

    st.push(i);
    push({
      event: EVENT_TYPES.PUSH,
      line: { cpp: 13, python: 11 },
      state: {
        array: [...arr],
        stackIndices: [...st],
        result: [...result],
        currentIndex: i,
      },
      affected: [i],
      explanation: `Push index ${i} onto stack.`,
    });
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 16, python: 13 },
    state: { array: [...arr], stackIndices: [...st], result: [...result] },
    explanation: "Next greater computation complete.",
  });

  return steps;
}

export const monotonicStack = {
  id: "stack-monotonic-next-greater",
  category: "Stack",
  name: "Monotonic Stack - Next Greater Element",
  description: "Use a decreasing stack to resolve next greater elements.",
  complexity: { time: "O(n)", space: "O(n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "mono-1",
      name: "Example 1",
      input: [4, 5, 2, 10, 8],
      expectedOutput: [5, 10, 10, -1, -1],
    },
    {
      id: "mono-2",
      name: "Example 2",
      input: [2, 1, 3],
      expectedOutput: [3, 3, -1],
    },
  ],
  visualizationType: "stack",
  generateSteps,
  lineMap: {
    cpp: {
      initialize: 2,
      resolve_next_greater: 9,
      push: 13,
      complete: 16,
    },
    python: {
      initialize: 2,
      resolve_next_greater: 8,
      push: 11,
      complete: 13,
    },
  },
};
