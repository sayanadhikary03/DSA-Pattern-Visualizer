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
// 1. Singly Linked List - Insert at Head
// ==========================================
const insertHeadCpp = `struct Node {
    int data;
    Node* next;
    Node(int v) : data(v), next(nullptr) {}
};

void insertAtHead(Node*& head, int value) {
    Node* newNode = new Node(value); // Create a new node
    newNode->next = head;            // Point new node to current head
    head = newNode;                  // Update head pointer to new node
}`;

const insertHeadPython = `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def insert_at_head(self, value):
    new_node = Node(value)    # Create a new node
    new_node.next = self.head # Point new node to current head
    self.head = new_node      # Update head pointer to new node`;

function generateInsertHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 5;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 7, python: 6 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Initial Singly Linked List: ${baseNodes.join(" -> ")} -> NULL. Head is at node ${baseNodes[0]}.`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 8, python: 7 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new node with value ${insertValue}.`,
  });

  push({
    event: EVENT_TYPES.SET_NEXT,
    line: { cpp: 9, python: 8 },
    state: {
      nodes: [insertValue, ...baseNodes],
      listType: "singly",
      pointers: { head: 1, newNode: 0 },
      highlightIndexes: [0, 1],
    },
    explanation: `Point new node (${insertValue}) next pointer to current head (${baseNodes[0]}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 9 },
    state: {
      nodes: [insertValue, ...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
      result: [insertValue, ...baseNodes],
    },
    explanation: `Update Head to point to new node (${insertValue}). Insertion complete! Result: ${[insertValue, ...baseNodes].join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyInsertHead = {
  id: "singly-insert-head",
  category: "Linked List",
  name: "Singly Linked List - Insert at Head",
  description: "Create a new node and insert it at the beginning of the list.",
  complexity: { time: "O(1)", space: "O(1)" },
  languages: {
    cpp: { code: insertHeadCpp, readOnly: true },
    python: { code: insertHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 5 },
      expectedOutput: [5, 10, 20, 30],
    },
    {
      id: "sll-head-2",
      name: "Example 2",
      input: { nodes: [100], insert: 50 },
      expectedOutput: [50, 100],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertHeadSteps,
  lineMap: {
    cpp: { initialize: 7, create_node: 8, set_next: 9, complete: 10 },
    python: { initialize: 6, create_node: 7, set_next: 8, complete: 9 },
  },
};

// ==========================================
// 2. Singly Linked List - Insert at End
// ==========================================
const insertEndCpp = `struct Node {
    int data;
    Node* next;
    Node(int v) : data(v), next(nullptr) {}
};

void insertAtEnd(Node*& head, int value) {
    Node* newNode = new Node(value); // Create node
    if (head == nullptr) {
        head = newNode;
        return;
    }
    Node* current = head;
    while (current->next != nullptr) { // Traverse to tail
        current = current->next;
    }
    current->next = newNode;          // Link tail to new node
}`;

const insertEndPython = `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def insert_at_end(self, value):
    new_node = Node(value) # Create node
    if self.head is None:
        self.head = new_node
        return
    current = self.head
    while current.next is not None: # Traverse to tail
        current = current.next
    current.next = new_node          # Link tail to new node`;

function generateInsertEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 40;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 7, python: 6 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Initial Singly Linked List: ${baseNodes.join(" -> ")} -> NULL.`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 8, python: 7 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new node with value ${insertValue}.`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 13, python: 12 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        newNodeValue: insertValue,
        pointers: { head: 0, curr: i, newNode: "new" },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]} at index ${i}.`,
    });
  }

  const result = [...baseNodes, insertValue];
  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 16, python: 14 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0, curr: baseNodes.length - 1 },
      highlightIndexes: [baseNodes.length - 1, baseNodes.length],
    },
    explanation: `Link current tail node (${baseNodes[baseNodes.length - 1]}) next pointer to new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 16, python: 14 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Insertion at end complete! Result: ${result.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyInsertEnd = {
  id: "singly-insert-end",
  category: "Linked List",
  name: "Singly Linked List - Insert at End",
  description: "Traverse to the tail and attach a new node at the end.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertEndCpp, readOnly: true },
    python: { code: insertEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 40 },
      expectedOutput: [10, 20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertEndSteps,
  lineMap: {
    cpp: { initialize: 7, create_node: 8, move_current: 13, link_node: 16, complete: 16 },
    python: { initialize: 6, create_node: 7, move_current: 12, link_node: 14, complete: 14 },
  },
};

// ==========================================
// 3. Singly Linked List - Insert at Middle / Position
// ==========================================
const insertMiddleCpp = `void insertAtPosition(Node*& head, int value, int position) {
    if (position == 0) {
        insertAtHead(head, value);
        return;
    }
    Node* current = head;
    for (int i = 0; i < position - 1 && current != nullptr; i++) {
        current = current->next; // Traverse to position - 1
    }
    if (current == nullptr) return;
    Node* newNode = new Node(value);
    newNode->next = current->next; // New node points to current->next
    current->next = newNode;       // current points to new node
}`;

const insertMiddlePython = `def insert_at_position(self, value, position):
    if position == 0:
        self.insert_at_head(value)
        return
    current = self.head
    for _ in range(position - 1):
        if current is None: return
        current = current.next # Traverse to position - 1
    if current is None: return
    new_node = Node(value)
    new_node.next = current.next # New node points to current.next
    current.next = new_node       # current points to new node`;

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
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Insert value ${insertValue} at index ${position}.`,
  });

  const targetIdx = Math.max(0, Math.min(position - 1, baseNodes.length - 1));
  for (let i = 0; i <= targetIdx; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 8, python: 7 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse to node index ${i} (${baseNodes[i]}).`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 0, insertValue);

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 11, python: 9 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      newNodeValue: insertValue,
      pointers: { head: 0, curr: targetIdx, newNode: "new" },
    },
    explanation: `Create new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.SET_NEXT,
    line: { cpp: 12, python: 10 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0, curr: targetIdx, newNode: position },
      highlightIndexes: [position, position + 1],
    },
    explanation: `Set new node (${insertValue}) next pointer to node ${baseNodes[targetIdx + 1] || "NULL"}.`,
  });

  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 13, python: 11 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0, curr: targetIdx },
      highlightIndexes: [targetIdx, position],
    },
    explanation: `Link current node (${baseNodes[targetIdx]}) next pointer to new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 13, python: 11 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Insertion at index ${position} complete! Result: ${result.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyInsertMiddle = {
  id: "singly-insert-middle",
  category: "Linked List",
  name: "Singly Linked List - Insert at Middle",
  description: "Insert a new node at a specified index in the list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertMiddleCpp, readOnly: true },
    python: { code: insertMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40], insert: 25, position: 2 },
      expectedOutput: [10, 20, 25, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 8, create_node: 11, set_next: 12, link_node: 13, complete: 13 },
    python: { initialize: 1, move_current: 7, create_node: 9, set_next: 10, link_node: 11, complete: 11 },
  },
};

// ==========================================
// 4. Singly Linked List - Delete from Head
// ==========================================
const deleteHeadCpp = `void deleteAtHead(Node*& head) {
    if (head == nullptr) return;
    Node* temp = head; // Store head in temp
    head = head->next; // Move head to next node
    delete temp;       // Free old head node
}`;

const deleteHeadPython = `def delete_at_head(self):
    if self.head is None: return
    temp = self.head     # Store head in temp
    self.head = self.head.next # Move head to next node
    del temp             # Delete old head`;

function generateDeleteHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0, temp: 0 },
    },
    explanation: `Initial list: ${baseNodes.join(" -> ")} -> NULL. Set temp pointer to head (${baseNodes[0]}).`,
  });

  const result = baseNodes.slice(1);
  push({
    event: EVENT_TYPES.MOVE_CURRENT,
    line: { cpp: 4, python: 4 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 1, temp: 0 },
      highlightIndexes: [0, 1],
    },
    explanation: `Move Head pointer to head->next (${baseNodes[1]}).`,
  });

  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 5, python: 5 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0 },
      result,
    },
    explanation: `Delete temp node (${baseNodes[0]}). Head deletion complete! Result: ${result.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyDeleteHead = {
  id: "singly-delete-head",
  category: "Linked List",
  name: "Singly Linked List - Delete from Head",
  description: "Remove the first node from the list and update the head pointer.",
  complexity: { time: "O(1)", space: "O(1)" },
  languages: {
    cpp: { code: deleteHeadCpp, readOnly: true },
    python: { code: deleteHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-del-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteHeadSteps,
  lineMap: {
    cpp: { initialize: 3, move_current: 4, delete: 5, complete: 5 },
    python: { initialize: 3, move_current: 4, delete: 5, complete: 5 },
  },
};

// ==========================================
// 5. Singly Linked List - Delete from End
// ==========================================
const deleteEndCpp = `void deleteAtEnd(Node*& head) {
    if (head == nullptr) return;
    if (head->next == nullptr) {
        delete head; head = nullptr; return;
    }
    Node* current = head;
    while (current->next->next != nullptr) { // Traverse to second-last node
        current = current->next;
    }
    delete current->next; // Delete tail node
    current->next = nullptr;
}`;

const deleteEndPython = `def delete_at_end(self):
    if self.head is None: return
    if self.head.next is None:
        self.head = None; return
    current = self.head
    while current.next.next is not None: # Traverse to second-last node
        current = current.next
    current.next = None # Delete tail node link`;

function generateDeleteEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Initial list: ${baseNodes.join(" -> ")} -> NULL.`,
  });

  const lastIndex = baseNodes.length - 2;
  for (let i = 0; i <= lastIndex; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 8, python: 7 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]} at index ${i}.`,
    });
  }

  const result = baseNodes.slice(0, -1);
  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 10, python: 8 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0, curr: lastIndex },
      result,
    },
    explanation: `Delete tail node (${baseNodes[baseNodes.length - 1]}) and set node ${baseNodes[lastIndex]} next to NULL. Result: ${result.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyDeleteEnd = {
  id: "singly-delete-end",
  category: "Linked List",
  name: "Singly Linked List - Delete from End",
  description: "Traverse to the second-to-last node and delete the tail node.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteEndCpp, readOnly: true },
    python: { code: deleteEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-del-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [10, 20, 30],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteEndSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 8, delete: 10, complete: 10 },
    python: { initialize: 1, move_current: 7, delete: 8, complete: 8 },
  },
};

// ==========================================
// 6. Singly Linked List - Delete from Middle
// ==========================================
const deleteMiddleCpp = `void deleteAtPosition(Node*& head, int position) {
    if (head == nullptr) return;
    if (position == 0) { deleteAtHead(head); return; }
    Node* current = head;
    for (int i = 0; i < position - 1 && current->next != nullptr; i++) {
        current = current->next; // Traverse to position - 1
    }
    if (current->next == nullptr) return;
    Node* temp = current->next;
    current->next = temp->next; // Bypass temp node
    delete temp;
}`;

const deleteMiddlePython = `def delete_at_position(self, position):
    if self.head is None: return
    if position == 0: self.delete_at_head(); return
    current = self.head
    for _ in range(position - 1):
        if current.next is None: return
        current = current.next # Traverse to position - 1
    if current.next is None: return
    temp = current.next
    current.next = temp.next # Bypass temp node
    del temp`;

function generateDeleteMiddleSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40, 50];
  const position = Number.isInteger(input?.position) ? input.position : 2;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Delete node at position ${position} (${baseNodes[position]}).`,
  });

  const prevIdx = Math.max(0, position - 1);
  for (let i = 0; i <= prevIdx; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 6, python: 6 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, curr: i, temp: position },
        highlightIndexes: [i, position],
      },
      explanation: `Traverse current pointer to node index ${i} (${baseNodes[i]}). Temp points to node at position ${position} (${baseNodes[position]}).`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 1);

  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 10, python: 9 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0, curr: prevIdx, temp: position },
      highlightIndexes: [prevIdx, position + 1],
    },
    explanation: `Point current node (${baseNodes[prevIdx]}) next pointer to temp->next (${baseNodes[position + 1] || "NULL"}).`,
  });

  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 11, python: 10 },
    state: {
      nodes: result,
      listType: "singly",
      pointers: { head: 0, curr: prevIdx },
      result,
    },
    explanation: `Delete temp node (${baseNodes[position]}). Deletion complete! Result: ${result.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyDeleteMiddle = {
  id: "singly-delete-middle",
  category: "Linked List",
  name: "Singly Linked List - Delete from Middle",
  description: "Delete the node at a given position from the linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteMiddleCpp, readOnly: true },
    python: { code: deleteMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-del-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40, 50], position: 2 },
      expectedOutput: [10, 20, 40, 50],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 6, link_node: 10, delete: 11, complete: 11 },
    python: { initialize: 1, move_current: 6, link_node: 9, delete: 10, complete: 10 },
  },
};

// ==========================================
// 7. Singly Linked List - Search
// ==========================================
const searchCpp = `int search(Node* head, int value) {
    Node* current = head;
    int index = 0;
    while (current != nullptr) {
        if (current->data == value) {
            return index; // Found match
        }
        current = current->next;
        index++;
    }
    return -1; // Value not found
}`;

const searchPython = `def search(self, value):
    current = self.head
    index = 0
    while current is not None:
        if current.data == value:
            return index # Found match
        current = current.next
        index += 1
    return -1 # Value not found`;

function generateSearchSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40, 50];
  const searchValue = Number.isFinite(input?.target) ? input.target : 30;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Search for target value ${searchValue} in linked list.`,
  });

  let foundIdx = -1;
  for (let i = 0; i < baseNodes.length; i++) {
    const match = baseNodes[i] === searchValue;
    push({
      event: match ? EVENT_TYPES.FOUND : EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: match ? 5 : 7, python: match ? 5 : 6 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: match
        ? `Match found! Node at index ${i} has value ${baseNodes[i]}.`
        : `Check node at index ${i} (${baseNodes[i]}) != ${searchValue}. Move current to next.`,
    });

    if (match) {
      foundIdx = i;
      break;
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: foundIdx !== -1 ? 5 : 10, python: foundIdx !== -1 ? 5 : 8 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0, ...(foundIdx !== -1 ? { curr: foundIdx } : {}) },
      foundIndex: foundIdx,
    },
    explanation: foundIdx !== -1
      ? `Search complete! Target ${searchValue} found at index ${foundIdx}.`
      : `Search complete! Target ${searchValue} not found in the list.`,
  });

  return steps;
}

export const singlySearch = {
  id: "singly-search",
  category: "Linked List",
  name: "Singly Linked List - Search",
  description: "Traverse the list to search for a target value and return its index.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: searchCpp, readOnly: true },
    python: { code: searchPython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-search-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40, 50], target: 30 },
      expectedOutput: 2,
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateSearchSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 7, found: 5, complete: 10 },
    python: { initialize: 1, move_current: 6, found: 5, complete: 8 },
  },
};

// ==========================================
// 8. Singly Linked List - Traverse / Display
// ==========================================
const traverseCpp = `void display(Node* head) {
    Node* current = head;
    while (current != nullptr) {
        cout << current->data << " "; // Process node data
        current = current->next;      // Move to next node
    }
    cout << endl;
}`;

const traversePython = `def display(self):
    current = self.head
    while current is not None:
        print(current.data, end=" ") # Process node data
        current = current.next       # Move to next node
    print()`;

function generateTraverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
    },
    explanation: `Start traversing linked list from head (${baseNodes[0]}).`,
  });

  const visited = [];
  for (let i = 0; i < baseNodes.length; i++) {
    visited.push(i);
    push({
      event: EVENT_TYPES.VISIT,
      line: { cpp: 4, python: 4 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, curr: i },
        highlightIndexes: [...visited],
      },
      explanation: `Visit node at index ${i}: value ${baseNodes[i]}.`,
    });
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 6, python: 5 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0 },
      highlightIndexes: [...visited],
    },
    explanation: `Traversal complete! All ${baseNodes.length} nodes displayed.`,
  });

  return steps;
}

export const singlyTraverse = {
  id: "singly-traverse",
  category: "Linked List",
  name: "Singly Linked List - Traverse",
  description: "Visit every node sequentially from head to tail.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: traverseCpp, readOnly: true },
    python: { code: traversePython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-trav-1",
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
// 9. Singly Linked List - Reverse
// ==========================================
const reverseCpp = `void reverse(Node*& head) {
    Node* previous = nullptr;
    Node* current = head;
    while (current != nullptr) {
        Node* nextNode = current->next; // Store next
        current->next = previous;       // Reverse pointer
        previous = current;             // Move previous forward
        current = nextNode;             // Move current forward
    }
    head = previous; // Update head
}`;

const reversePython = `def reverse(self):
    previous = None
    current = self.head
    while current is not None:
        next_node = current.next # Store next
        current.next = previous  # Reverse pointer
        previous = current       # Move previous forward
        current = next_node      # Move current forward
    self.head = previous # Update head`;

function generateReverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "singly",
      pointers: { head: 0, prev: -1, curr: 0 },
    },
    explanation: `Initial list: ${baseNodes.join(" -> ")} -> NULL. Set prev = NULL, curr = head.`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    const nextIdx = i + 1 < baseNodes.length ? i + 1 : -1;
    push({
      event: EVENT_TYPES.SET_NEXT,
      line: { cpp: 5, python: 5 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, prev: i - 1, curr: i, next: nextIdx },
        highlightIndexes: [i],
      },
      explanation: `Store nextNode = ${nextIdx !== -1 ? baseNodes[nextIdx] : "NULL"}. Reverse current (${baseNodes[i]}) next link to point to ${i > 0 ? baseNodes[i - 1] : "NULL"}.`,
    });

    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 7, python: 7 },
      state: {
        nodes: [...baseNodes],
        listType: "singly",
        pointers: { head: 0, prev: i, curr: nextIdx },
      },
      explanation: `Advance prev to ${baseNodes[i]} and current to ${nextIdx !== -1 ? baseNodes[nextIdx] : "NULL"}.`,
    });
  }

  const reversed = [...baseNodes].reverse();
  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 9, python: 8 },
    state: {
      nodes: reversed,
      listType: "singly",
      pointers: { head: 0 },
      result: reversed,
    },
    explanation: `Reversal complete! Update head to prev (${reversed[0]}). Result: ${reversed.join(" -> ")} -> NULL.`,
  });

  return steps;
}

export const singlyReverse = {
  id: "singly-reverse",
  category: "Linked List",
  name: "Singly Linked List - Reverse",
  description: "Reverse all pointer directions in-place so the list flows from tail to head.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: reverseCpp, readOnly: true },
    python: { code: reversePython, readOnly: true },
  },
  testCases: [
    {
      id: "sll-rev-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [40, 30, 20, 10],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateReverseSteps,
  lineMap: {
    cpp: { initialize: 1, set_next: 5, move_current: 7, complete: 9 },
    python: { initialize: 1, set_next: 5, move_current: 7, complete: 8 },
  },
};
