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

const cppCode = `void push(stack<int>& st, int value) {
    st.push(value);
}

void pop(stack<int>& st) {
    if (!st.empty()) {
        st.pop();
    }
}

int peek(stack<int>& st) {
    return st.top();
}`;

const pythonCode = `def push(stack, value):
    stack.append(value)

def pop(stack):
    if stack:
        stack.pop()

def peek(stack):
    return stack[-1]`;

function generateSteps(input) {
  const ops = Array.isArray(input?.operations)
    ? input.operations
    : [
        { type: "push", value: 10 },
        { type: "push", value: 20 },
        { type: "push", value: 30 },
        { type: "peek" },
        { type: "pop" },
      ];

  const { steps, push } = withStepFactory();
  const stack = [];

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: { stack: [...stack], action: "initialize", topIndex: -1 },
    explanation: "Start with an empty stack.",
  });

  for (const op of ops) {
    if (op.type === "push") {
      stack.push(op.value);
      push({
        event: EVENT_TYPES.PUSH,
        line: { cpp: 2, python: 2 },
        state: {
          stack: [...stack],
          action: `push(${op.value})`,
          topIndex: stack.length - 1,
        },
        affected: [stack.length - 1],
        explanation: `Push ${op.value} to stack.`,
      });
    } else if (op.type === "peek") {
      push({
        event: EVENT_TYPES.PEEK,
        line: { cpp: 12, python: 11 },
        state: {
          stack: [...stack],
          action: "peek",
          topIndex: stack.length - 1,
          peekValue: stack[stack.length - 1] ?? null,
        },
        affected: stack.length ? [stack.length - 1] : [],
        explanation: stack.length
          ? `Peek top value ${stack[stack.length - 1]}.`
          : "Peek on empty stack.",
      });
    } else if (op.type === "pop") {
      const popped = stack.pop();
      push({
        event: EVENT_TYPES.POP,
        line: { cpp: 7, python: 6 },
        state: {
          stack: [...stack],
          action: "pop",
          topIndex: stack.length - 1,
          popped: popped ?? null,
        },
        explanation:
          popped !== undefined
            ? `Pop ${popped} from stack.`
            : "Pop skipped. Stack is empty.",
      });
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 12, python: 11 },
    state: {
      stack: [...stack],
      action: "complete",
      topIndex: stack.length - 1,
      result: [...stack],
    },
    explanation: "Stack operations complete.",
  });

  return steps;
}

export const stackOperations = {
  id: "stack-push-pop-peek",
  category: "Stack",
  name: "Normal Stack - Push, Pop, Peek",
  description: "Core stack operations using LIFO behavior.",
  complexity: { time: "O(1)", space: "O(n)" },
  languages: {
    cpp: { code: cppCode, readOnly: true },
    python: { code: pythonCode, readOnly: true },
  },
  testCases: [
    {
      id: "stack-1",
      name: "Example 1",
      input: {
        operations: [
          { type: "push", value: 5 },
          { type: "push", value: 10 },
          { type: "peek" },
          { type: "pop" },
          { type: "push", value: 20 },
        ],
      },
      expectedOutput: [5, 20],
    },
    {
      id: "stack-2",
      name: "Example 2",
      input: {
        operations: [
          { type: "push", value: 1 },
          { type: "push", value: 2 },
          { type: "push", value: 3 },
          { type: "pop" },
          { type: "peek" },
        ],
      },
      expectedOutput: [1, 2],
    },
  ],
  visualizationType: "stack",
  generateSteps,
  lineMap: {
    cpp: {
      initialize: 1,
      push: 2,
      pop: 7,
      peek: 12,
      complete: 12,
    },
    python: {
      initialize: 1,
      push: 2,
      pop: 6,
      peek: 11,
      complete: 11,
    },
  },
};
