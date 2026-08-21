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

// ==========================================
// 1. Doubly Linked List - Insert at Head
// ==========================================
const insertHeadCpp = `void insertAtHead(Node*& head, int value) {
    Node* newNode = new Node(value); // Create new node
    newNode->next = head;            // Link newNode next to current head
    if (head != nullptr) {
        head->prev = newNode;        // Link head prev to newNode
    }
    head = newNode;                  // Update head pointer
}`;

const insertHeadPython = `def insert_at_head(self, value):
    new_node = Node(value)      # Create new node
    new_node.next = self.head   # Link new_node next to current head
    if self.head is not None:
        self.head.prev = new_node # Link head prev to new_node
    self.head = new_node        # Update head pointer`;

function generateInsertHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 5;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Initial Doubly Linked List: NULL <-> ${baseNodes.join(" <-> ")} <-> NULL.`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 2, python: 2 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new doubly-linked node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.SET_NEXT,
    line: { cpp: 3, python: 3 },
    state: {
      nodes: [insertValue, ...baseNodes],
      listType: "doubly",
      pointers: { head: 1, newNode: 0 },
      highlightIndexes: [0, 1],
    },
    explanation: `Set newNode (${insertValue}) next pointer to current head (${baseNodes[0]}).`,
  });

  push({
    event: EVENT_TYPES.SET_PREV,
    line: { cpp: 5, python: 5 },
    state: {
      nodes: [insertValue, ...baseNodes],
      listType: "doubly",
      pointers: { head: 1, newNode: 0 },
      highlightIndexes: [0, 1],
    },
    explanation: `Set current head (${baseNodes[0]}) prev pointer back to newNode (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 7, python: 6 },
    state: {
      nodes: [insertValue, ...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
      result: [insertValue, ...baseNodes],
    },
    explanation: `Head updated to new node (${insertValue}). Doubly linked list insertion complete!`,
  });

  return steps;
}

export const doublyInsertHead = {
  id: "doubly-insert-head",
  category: "Linked List",
  name: "Doubly Linked List - Insert at Head",
  description: "Insert a node at the beginning of a doubly linked list, connecting next and prev pointers.",
  complexity: { time: "O(1)", space: "O(1)" },
  languages: {
    cpp: { code: insertHeadCpp, readOnly: true },
    python: { code: insertHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 5 },
      expectedOutput: [5, 10, 20, 30],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertHeadSteps,
  lineMap: {
    cpp: { initialize: 1, create_node: 2, set_next: 3, set_prev: 5, complete: 7 },
    python: { initialize: 1, create_node: 2, set_next: 3, set_prev: 5, complete: 6 },
  },
};

// ==========================================
// 2. Doubly Linked List - Insert at End
// ==========================================
const insertEndCpp = `void insertAtEnd(Node*& head, int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) { head = newNode; return; }
    Node* current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    current->next = newNode; // Link current tail to new node
    newNode->prev = current;  // Link new node back to current tail
}`;

const insertEndPython = `def insert_at_end(self, value):
    new_node = Node(value)
    if self.head is None: self.head = new_node; return
    current = self.head
    while current.next is not None:
        current = current.next
    current.next = new_node  # Link current tail to new node
    new_node.prev = current  # Link new node back to current tail`;

function generateInsertEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 40;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Initial Doubly Linked List: NULL <-> ${baseNodes.join(" <-> ")} <-> NULL.`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 2, python: 2 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new doubly-linked node (${insertValue}).`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 5, python: 5 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        newNodeValue: insertValue,
        pointers: { head: 0, curr: i, newNode: "new" },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]}.`,
    });
  }

  const result = [...baseNodes, insertValue];
  push({
    event: EVENT_TYPES.SET_NEXT,
    line: { cpp: 7, python: 6 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0, curr: baseNodes.length - 1 },
      highlightIndexes: [baseNodes.length - 1, baseNodes.length],
    },
    explanation: `Set tail node (${baseNodes[baseNodes.length - 1]}) next pointer to new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.SET_PREV,
    line: { cpp: 8, python: 7 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0, curr: baseNodes.length - 1 },
      highlightIndexes: [baseNodes.length - 1, baseNodes.length],
    },
    explanation: `Set new node (${insertValue}) prev pointer back to tail node (${baseNodes[baseNodes.length - 1]}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 8, python: 7 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Insertion at end complete!`,
  });

  return steps;
}

export const doublyInsertEnd = {
  id: "doubly-insert-end",
  category: "Linked List",
  name: "Doubly Linked List - Insert at End",
  description: "Traverse to the tail of a doubly linked list and attach a new node with bidirection pointers.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertEndCpp, readOnly: true },
    python: { code: insertEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 40 },
      expectedOutput: [10, 20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertEndSteps,
  lineMap: {
    cpp: { initialize: 1, create_node: 2, move_current: 5, set_next: 7, set_prev: 8, complete: 8 },
    python: { initialize: 1, create_node: 2, move_current: 5, set_next: 6, set_prev: 7, complete: 7 },
  },
};

// ==========================================
// 3. Doubly Linked List - Insert at Middle
// ==========================================
const insertMiddleCpp = `void insertAtPosition(Node*& head, int value, int position) {
    if (position == 0) { insertAtHead(head, value); return; }
    Node* current = head;
    for (int i = 0; i < position - 1 && current != nullptr; i++) {
        current = current->next;
    }
    if (current == nullptr) return;
    Node* newNode = new Node(value);
    newNode->next = current->next; // Point new node next to current->next
    newNode->prev = current;       // Point new node prev to current
    if (current->next != nullptr) {
        current->next->prev = newNode;
    }
    current->next = newNode;
}`;

const insertMiddlePython = `def insert_at_position(self, value, position):
    if position == 0: self.insert_at_head(value); return
    current = self.head
    for _ in range(position - 1):
        if current is None: return
        current = current.next
    if current is None: return
    new_node = Node(value)
    new_node.next = current.next # Point new node next to current.next
    new_node.prev = current       # Point new node prev to current
    if current.next is not None:
        current.next.prev = new_node
    current.next = new_node`;

function generateInsertMiddleSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 25;
  const position = Number.isInteger(input?.position) ? input.position : 2;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Insert value ${insertValue} at index ${position} in doubly linked list.`,
  });

  const prevIdx = Math.max(0, position - 1);
  for (let i = 0; i <= prevIdx; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 4, python: 5 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse to node at index ${i} (${baseNodes[i]}).`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 0, insertValue);

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 8, python: 8 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      newNodeValue: insertValue,
      pointers: { head: 0, curr: prevIdx, newNode: "new" },
    },
    explanation: `Create new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.SET_NEXT,
    line: { cpp: 9, python: 9 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0, curr: prevIdx, newNode: position },
      highlightIndexes: [position, position + 1],
    },
    explanation: `Connect new node (${insertValue}) next and prev pointers to current node and next node.`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 13 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Doubly linked list insertion at index ${position} complete!`,
  });

  return steps;
}

export const doublyInsertMiddle = {
  id: "doubly-insert-middle",
  category: "Linked List",
  name: "Doubly Linked List - Insert at Middle",
  description: "Insert a node at a given position in a doubly linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertMiddleCpp, readOnly: true },
    python: { code: insertMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40], insert: 25, position: 2 },
      expectedOutput: [10, 20, 25, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 4, create_node: 8, set_next: 9, complete: 14 },
    python: { initialize: 1, move_current: 5, create_node: 8, set_next: 9, complete: 13 },
  },
};

// ==========================================
// 4. Doubly Linked List - Delete from Head
// ==========================================
const deleteHeadCpp = `void deleteAtHead(Node*& head) {
    if (head == nullptr) return;
    Node* temp = head;
    head = head->next;   // Move head pointer forward
    if (head != nullptr) {
        head->prev = nullptr; // Clear prev pointer of new head
    }
    delete temp;
}`;

const deleteHeadPython = `def delete_at_head(self):
    if self.head is None: return
    temp = self.head
    self.head = self.head.next # Move head pointer forward
    if self.head is not None:
        self.head.prev = None # Clear prev pointer of new head
    del temp`;

function generateDeleteHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0, temp: 0 },
    },
    explanation: `Initial doubly list: ${baseNodes.join(" <-> ")}. Temp points to head node (${baseNodes[0]}).`,
  });

  const result = baseNodes.slice(1);
  push({
    event: EVENT_TYPES.MOVE_CURRENT,
    line: { cpp: 4, python: 4 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 1, temp: 0 },
      highlightIndexes: [0, 1],
    },
    explanation: `Move head pointer to next node (${baseNodes[1]}). Clear new head prev link to NULL.`,
  });

  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 7, python: 7 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Delete old head node (${baseNodes[0]}). Deletion complete!`,
  });

  return steps;
}

export const doublyDeleteHead = {
  id: "doubly-delete-head",
  category: "Linked List",
  name: "Doubly Linked List - Delete from Head",
  description: "Delete the head node of a doubly linked list and reset the new head's prev pointer.",
  complexity: { time: "O(1)", space: "O(1)" },
  languages: {
    cpp: { code: deleteHeadCpp, readOnly: true },
    python: { code: deleteHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-del-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteHeadSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 4, delete: 7, complete: 7 },
    python: { initialize: 1, move_current: 4, delete: 7, complete: 7 },
  },
};

// ==========================================
// 5. Doubly Linked List - Delete from End
// ==========================================
const deleteEndCpp = `void deleteAtEnd(Node*& head) {
    if (head == nullptr) return;
    Node* current = head;
    while (current->next != nullptr) {
        current = current->next; // Traverse to tail
    }
    if (current->prev != nullptr) {
        current->prev->next = nullptr; // Unlink tail node
    } else {
        head = nullptr;
    }
    delete current;
}`;

const deleteEndPython = `def delete_at_end(self):
    if self.head is None: return
    current = self.head
    while current.next is not None:
        current = current.next # Traverse to tail
    if current.prev is not None:
        current.prev.next = None # Unlink tail node
    else:
        self.head = None
    del current`;

function generateDeleteEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Initial doubly list: ${baseNodes.join(" <-> ")}.`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 4, python: 4 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]}.`,
    });
  }

  const result = baseNodes.slice(0, -1);
  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 7, python: 7 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0, curr: result.length - 1 },
      result,
    },
    explanation: `Unlink and delete tail node (${baseNodes[baseNodes.length - 1]}).`,
  });

  return steps;
}

export const doublyDeleteEnd = {
  id: "doubly-delete-end",
  category: "Linked List",
  name: "Doubly Linked List - Delete from End",
  description: "Traverse to tail node and detach it by resetting the previous node's next pointer.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteEndCpp, readOnly: true },
    python: { code: deleteEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-del-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [10, 20, 30],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteEndSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 4, delete: 7, complete: 7 },
    python: { initialize: 1, move_current: 4, delete: 7, complete: 7 },
  },
};

// ==========================================
// 6. Doubly Linked List - Delete from Middle
// ==========================================
const deleteMiddleCpp = `void deleteAtPosition(Node*& head, int position) {
    if (head == nullptr) return;
    if (position == 0) { deleteAtHead(head); return; }
    Node* current = head;
    for (int i = 0; i < position && current != nullptr; i++) {
        current = current->next; // Traverse to target node
    }
    if (current == nullptr) return;
    current->prev->next = current->next; // Link prev node to next node
    if (current->next != nullptr) {
        current->next->prev = current->prev; // Link next node back to prev node
    }
    delete current;
}`;

const deleteMiddlePython = `def delete_at_position(self, position):
    if self.head is None: return
    if position == 0: self.delete_at_head(); return
    current = self.head
    for _ in range(position):
        if current is None: return
        current = current.next # Traverse to target node
    if current is None: return
    current.prev.next = current.next # Link prev node to next node
    if current.next is not None:
        current.next.prev = current.prev # Link next node back to prev node
    del current`;

function generateDeleteMiddleSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40, 50];
  const position = Number.isInteger(input?.position) ? input.position : 2;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Delete target node at index ${position} (${baseNodes[position]}).`,
  });

  for (let i = 0; i <= position; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 5, python: 6 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]}.`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 1);

  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 8, python: 8 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0, curr: position, prev: position - 1, next: position + 1 },
      highlightIndexes: [position - 1, position + 1],
    },
    explanation: `Bypass target node (${baseNodes[position]}) by linking prev node (${baseNodes[position - 1]}) directly with next node (${baseNodes[position + 1] || "NULL"}).`,
  });

  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 12, python: 11 },
    state: {
      nodes: result,
      listType: "doubly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Delete target node (${baseNodes[position]}). Deletion complete!`,
  });

  return steps;
}

export const doublyDeleteMiddle = {
  id: "doubly-delete-middle",
  category: "Linked List",
  name: "Doubly Linked List - Delete from Middle",
  description: "Bypass and delete a middle node in a doubly linked list by linking its prev and next neighbors.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteMiddleCpp, readOnly: true },
    python: { code: deleteMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-del-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40, 50], position: 2 },
      expectedOutput: [10, 20, 40, 50],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 5, link_node: 8, delete: 12, complete: 12 },
    python: { initialize: 1, move_current: 6, link_node: 8, delete: 11, complete: 11 },
  },
};

// ==========================================
// 7. Doubly Linked List - Search
// ==========================================
const searchCpp = `int search(Node* head, int value) {
    Node* current = head;
    int index = 0;
    while (current != nullptr) {
        if (current->data == value) return index;
        current = current->next;
        index++;
    }
    return -1;
}`;

const searchPython = `def search(self, value):
    current = self.head
    index = 0
    while current is not None:
        if current.data == value: return index
        current = current.next
        index += 1
    return -1`;

function generateSearchSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const searchValue = Number.isFinite(input?.target) ? input.target : 30;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Search for ${searchValue} in doubly linked list.`,
  });

  let foundIdx = -1;
  for (let i = 0; i < baseNodes.length; i++) {
    const match = baseNodes[i] === searchValue;
    push({
      event: match ? EVENT_TYPES.FOUND : EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: match ? 4 : 5, python: match ? 4 : 5 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: match
        ? `Found match at node index ${i} (${baseNodes[i]}).`
        : `Node ${i} (${baseNodes[i]}) != ${searchValue}. Move current pointer next.`,
    });
    if (match) {
      foundIdx = i;
      break;
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 8, python: 7 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0, ...(foundIdx !== -1 ? { curr: foundIdx } : {}) },
      foundIndex: foundIdx,
    },
    explanation: foundIdx !== -1 ? `Search complete! Found at index ${foundIdx}.` : `Value not found.`,
  });

  return steps;
}

export const doublySearch = {
  id: "doubly-search",
  category: "Linked List",
  name: "Doubly Linked List - Search",
  description: "Search for a value in a doubly linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: searchCpp, readOnly: true },
    python: { code: searchPython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-search-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40], target: 30 },
      expectedOutput: 2,
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateSearchSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 5, found: 4, complete: 8 },
    python: { initialize: 1, move_current: 5, found: 4, complete: 7 },
  },
};

// ==========================================
// 8. Doubly Linked List - Traverse
// ==========================================
const traverseCpp = `void displayForward(Node* head) {
    Node* current = head;
    while (current != nullptr) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}`;

const traversePython = `def display(self):
    current = self.head
    while current is not None:
        print(current.data, end=" ")
        current = current.next
    print()`;

function generateTraverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
    },
    explanation: `Traverse doubly linked list forward.`,
  });

  const visited = [];
  for (let i = 0; i < baseNodes.length; i++) {
    visited.push(i);
    push({
      event: EVENT_TYPES.VISIT,
      line: { cpp: 4, python: 4 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [...visited],
      },
      explanation: `Visit node at index ${i}: ${baseNodes[i]}.`,
    });
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 6, python: 5 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0 },
      highlightIndexes: [...visited],
    },
    explanation: `Doubly linked list traversal complete!`,
  });

  return steps;
}

export const doublyTraverse = {
  id: "doubly-traverse",
  category: "Linked List",
  name: "Doubly Linked List - Traverse",
  description: "Sequential forward traversal of doubly linked list nodes.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: traverseCpp, readOnly: true },
    python: { code: traversePython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-trav-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [10, 20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateTraverseSteps,
  lineMap: {
    cpp: { initialize: 1, visit: 4, complete: 6 },
    python: { initialize: 1, visit: 4, complete: 5 },
  },
};

// ==========================================
// 9. Doubly Linked List - Reverse
// ==========================================
const reverseCpp = `void reverse(Node*& head) {
    Node* current = head;
    Node* newHead = nullptr;
    while (current != nullptr) {
        Node* nextNode = current->next;
        current->next = current->prev; // Swap next to prev
        current->prev = nextNode;      // Swap prev to next
        newHead = current;
        current = nextNode;
    }
    head = newHead; // Update head pointer
}`;

const reversePython = `def reverse(self):
    current = self.head
    new_head = None
    while current is not None:
        next_node = current.next
        current.next = current.prev # Swap next to prev
        current.prev = next_node     # Swap prev to next
        new_head = current
        current = next_node
    self.head = new_head # Update head pointer`;

function generateReverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "doubly",
      pointers: { head: 0, curr: 0 },
    },
    explanation: `Initial doubly list: ${baseNodes.join(" <-> ")}. Start reversing pointers from head.`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.SET_NEXT,
      line: { cpp: 6, python: 6 },
      state: {
        nodes: [...baseNodes],
        listType: "doubly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Swap next and prev pointers for node ${baseNodes[i]}.`,
    });
  }

  const reversed = [...baseNodes].reverse();
  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 10 },
    state: {
      nodes: reversed,
      listType: "doubly",
      pointers: { head: 0 },
      result: reversed,
    },
    explanation: `Doubly linked list reversal complete! Result: NULL <-> ${reversed.join(" <-> ")} <-> NULL.`,
  });

  return steps;
}

export const doublyReverse = {
  id: "doubly-reverse",
  category: "Linked List",
  name: "Doubly Linked List - Reverse",
  description: "Swap next and prev pointers for every node to reverse the doubly linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: reverseCpp, readOnly: true },
    python: { code: reversePython, readOnly: true },
  },
  testCases: [
    {
      id: "dll-rev-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [40, 30, 20, 10],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateReverseSteps,
  lineMap: {
    cpp: { initialize: 1, set_next: 6, complete: 10 },
    python: { initialize: 1, set_next: 6, complete: 10 },
  },
};
