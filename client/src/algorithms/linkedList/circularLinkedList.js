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
// 1. Circular Linked List - Insert at Head
// ==========================================
const insertHeadCpp = `void insertAtHead(Node*& head, int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
        head = newNode;
        newNode->next = head;
        return;
    }
    Node* last = head;
    while (last->next != head) { // Traverse to tail
        last = last->next;
    }
    newNode->next = head; // Point new node to current head
    last->next = newNode;  // Point tail node to new node
    head = newNode;        // Update head to new node
}`;

const insertHeadPython = `def insert_at_head(self, value):
    new_node = Node(value)
    if self.head is None:
        self.head = new_node
        new_node.next = self.head
        return
    last = self.head
    while last.next != self.head: # Traverse to tail
        last = last.next
    new_node.next = self.head # Point new node to current head
    last.next = new_node      # Point tail node to new node
    self.head = new_node      # Update head to new node`;

function generateInsertHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 5;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Initial Circular Linked List: Head -> ${baseNodes.join(" -> ")} -> (↺ Head).`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 2, python: 2 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new node (${insertValue}).`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 9, python: 9 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        newNodeValue: insertValue,
        pointers: { head: 0, last: i, newNode: "new" },
        highlightIndexes: [i],
      },
      explanation: `Traverse last pointer to node ${baseNodes[i]} at index ${i}.`,
    });
  }

  const result = [insertValue, ...baseNodes];
  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 13, python: 13 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 1, last: baseNodes.length, newNode: 0 },
      highlightIndexes: [0, 1, baseNodes.length],
    },
    explanation: `Point newNode (${insertValue}) next to current head, and tail node (${baseNodes[baseNodes.length - 1]}) next to newNode. Update Head pointer.`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 14 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0 },
      result,
    },
    explanation: `Circular linked list insertion at head complete! Head is now ${insertValue}.`,
  });

  return steps;
}

export const circularInsertHead = {
  id: "circular-insert-head",
  category: "Linked List",
  name: "Circular Linked List - Insert at Head",
  description: "Insert a new node before the current head, updating tail's next pointer to maintain the cycle.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertHeadCpp, readOnly: true },
    python: { code: insertHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 5 },
      expectedOutput: [5, 10, 20, 30],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertHeadSteps,
  lineMap: {
    cpp: { initialize: 1, create_node: 2, move_current: 9, link_node: 13, complete: 14 },
    python: { initialize: 1, create_node: 2, move_current: 9, link_node: 13, complete: 14 },
  },
};

// ==========================================
// 2. Circular Linked List - Insert at End
// ==========================================
const insertEndCpp = `void insertAtEnd(Node*& head, int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
        head = newNode;
        newNode->next = head;
        return;
    }
    Node* last = head;
    while (last->next != head) { // Traverse to tail
        last = last->next;
    }
    last->next = newNode;  // Point current tail to new node
    newNode->next = head; // Point new node back to head
}`;

const insertEndPython = `def insert_at_end(self, value):
    new_node = Node(value)
    if self.head is None:
        self.head = new_node
        new_node.next = self.head
        return
    last = self.head
    while last.next != self.head: # Traverse to tail
        last = last.next
    last.next = new_node  # Point current tail to new node
    new_node.next = self.head # Point new node back to head`;

function generateInsertEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30];
  const insertValue = Number.isFinite(input?.insert) ? input.insert : 40;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Initial Circular Linked List: Head -> ${baseNodes.join(" -> ")} -> (↺ Head).`,
  });

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 2, python: 2 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      newNodeValue: insertValue,
      pointers: { head: 0, newNode: "new" },
    },
    explanation: `Create a new node (${insertValue}).`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 9, python: 9 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        newNodeValue: insertValue,
        pointers: { head: 0, last: i, newNode: "new" },
        highlightIndexes: [i],
      },
      explanation: `Traverse last pointer to tail node ${baseNodes[i]}.`,
    });
  }

  const result = [...baseNodes, insertValue];
  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 12, python: 12 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0, last: baseNodes.length - 1 },
      highlightIndexes: [baseNodes.length - 1, baseNodes.length, 0],
    },
    explanation: `Link tail node (${baseNodes[baseNodes.length - 1]}) to new node (${insertValue}), and point new node back to Head (${baseNodes[0]}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 13, python: 13 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0 },
      result,
    },
    explanation: `Circular linked list insertion at end complete!`,
  });

  return steps;
}

export const circularInsertEnd = {
  id: "circular-insert-end",
  category: "Linked List",
  name: "Circular Linked List - Insert at End",
  description: "Traverse to the tail and insert a new node that points back to head.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertEndCpp, readOnly: true },
    python: { code: insertEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30], insert: 40 },
      expectedOutput: [10, 20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertEndSteps,
  lineMap: {
    cpp: { initialize: 1, create_node: 2, move_current: 9, link_node: 12, complete: 13 },
    python: { initialize: 1, create_node: 2, move_current: 9, link_node: 12, complete: 13 },
  },
};

// ==========================================
// 3. Circular Linked List - Insert at Middle
// ==========================================
const insertMiddleCpp = `void insertAtPosition(Node*& head, int value, int position) {
    if (position == 0) { insertAtHead(head, value); return; }
    if (head == nullptr) return;
    Node* current = head;
    for (int i = 0; i < position - 1; i++) {
        current = current->next;
        if (current == head) return;
    }
    Node* newNode = new Node(value);
    newNode->next = current->next; // Point new node to current->next
    current->next = newNode;       // Link current to new node
}`;

const insertMiddlePython = `def insert_at_position(self, value, position):
    if position == 0: self.insert_at_head(value); return
    if self.head is None: return
    current = self.head
    for _ in range(position - 1):
        current = current.next
        if current == self.head: return
    new_node = Node(value)
    new_node.next = current.next # Point new node to current.next
    current.next = new_node       # Link current to new node`;

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
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Insert ${insertValue} at index ${position} in circular linked list.`,
  });

  const prevIdx = Math.max(0, position - 1);
  for (let i = 0; i <= prevIdx; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 6, python: 6 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node ${baseNodes[i]}.`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 0, insertValue);

  push({
    event: EVENT_TYPES.CREATE_NODE,
    line: { cpp: 9, python: 8 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      newNodeValue: insertValue,
      pointers: { head: 0, curr: prevIdx, newNode: "new" },
    },
    explanation: `Create node ${insertValue}.`,
  });

  push({
    event: EVENT_TYPES.LINK_NODE,
    line: { cpp: 11, python: 10 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0, curr: prevIdx },
      highlightIndexes: [prevIdx, position],
    },
    explanation: `Link current node (${baseNodes[prevIdx]}) next pointer to new node (${insertValue}).`,
  });

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 11, python: 10 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0 },
      result,
    },
    explanation: `Circular linked list insertion complete!`,
  });

  return steps;
}

export const circularInsertMiddle = {
  id: "circular-insert-middle",
  category: "Linked List",
  name: "Circular Linked List - Insert at Middle",
  description: "Insert a node at a target index inside a circular linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: insertMiddleCpp, readOnly: true },
    python: { code: insertMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40], insert: 25, position: 2 },
      expectedOutput: [10, 20, 25, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateInsertMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 6, create_node: 9, link_node: 11, complete: 11 },
    python: { initialize: 1, move_current: 6, create_node: 8, link_node: 10, complete: 10 },
  },
};

// ==========================================
// 4. Circular Linked List - Delete from Head
// ==========================================
const deleteHeadCpp = `void deleteAtHead(Node*& head) {
    if (head == nullptr) return;
    if (head->next == head) {
        delete head; head = nullptr; return;
    }
    Node* last = head;
    while (last->next != head) { // Traverse to tail
        last = last->next;
    }
    Node* temp = head;
    head = head->next;   // Move head forward
    last->next = head;   // Link tail to new head
    delete temp;
}`;

const deleteHeadPython = `def delete_at_head(self):
    if self.head is None: return
    if self.head.next == self.head:
        self.head = None; return
    last = self.head
    while last.next != self.head: # Traverse to tail
        last = last.next
    self.head = self.head.next # Move head forward
    last.next = self.head      # Link tail to new head`;

function generateDeleteHeadSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0, temp: 0 },
    },
    explanation: `Initial circular list: Head -> ${baseNodes.join(" -> ")} -> (↺ Head).`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 8, python: 7 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, last: i, temp: 0 },
        highlightIndexes: [i],
      },
      explanation: `Traverse last pointer to tail node ${baseNodes[i]}.`,
    });
  }

  const result = baseNodes.slice(1);
  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 13, python: 10 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0 },
      result,
    },
    explanation: `Update Head pointer to node ${baseNodes[1]} and point tail node (${baseNodes[baseNodes.length - 1]}) to new Head. Delete old head (${baseNodes[0]}).`,
  });

  return steps;
}

export const circularDeleteHead = {
  id: "circular-delete-head",
  category: "Linked List",
  name: "Circular Linked List - Delete from Head",
  description: "Delete head node and update tail's next pointer to point to the new head node.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteHeadCpp, readOnly: true },
    python: { code: deleteHeadPython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-del-head-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteHeadSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 8, delete: 13, complete: 13 },
    python: { initialize: 1, move_current: 7, delete: 10, complete: 10 },
  },
};

// ==========================================
// 5. Circular Linked List - Delete from End
// ==========================================
const deleteEndCpp = `void deleteAtEnd(Node*& head) {
    if (head == nullptr) return;
    if (head->next == head) { delete head; head = nullptr; return; }
    Node* current = head;
    while (current->next->next != head) { // Traverse to second-last node
        current = current->next;
    }
    delete current->next; // Delete tail node
    current->next = head; // Link new tail back to head
}`;

const deleteEndPython = `def delete_at_end(self):
    if self.head is None: return
    if self.head.next == self.head: self.head = None; return
    current = self.head
    while current.next.next != self.head: # Traverse to second-last node
        current = current.next
    current.next = self.head # Link new tail back to head`;

function generateDeleteEndSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Initial circular list: Head -> ${baseNodes.join(" -> ")} -> (↺ Head).`,
  });

  const secondLast = baseNodes.length - 2;
  for (let i = 0; i <= secondLast; i++) {
    push({
      event: EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: 6, python: 5 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node index ${i} (${baseNodes[i]}).`,
    });
  }

  const result = baseNodes.slice(0, -1);
  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 9, python: 6 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0, curr: secondLast },
      result,
    },
    explanation: `Delete tail node (${baseNodes[baseNodes.length - 1]}) and set new tail (${baseNodes[secondLast]}) next to Head (${baseNodes[0]}).`,
  });

  return steps;
}

export const circularDeleteEnd = {
  id: "circular-delete-end",
  category: "Linked List",
  name: "Circular Linked List - Delete from End",
  description: "Traverse to second-to-last node, delete tail node, and reconnect new tail to head.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteEndCpp, readOnly: true },
    python: { code: deleteEndPython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-del-end-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [10, 20, 30],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteEndSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 6, delete: 9, complete: 9 },
    python: { initialize: 1, move_current: 5, delete: 6, complete: 6 },
  },
};

// ==========================================
// 6. Circular Linked List - Delete from Middle
// ==========================================
const deleteMiddleCpp = `void deleteAtPosition(Node*& head, int position) {
    if (head == nullptr) return;
    if (position == 0) { deleteAtHead(head); return; }
    Node* current = head;
    for (int i = 0; i < position - 1; i++) {
        current = current->next;
        if (current == head) return;
    }
    Node* temp = current->next;
    current->next = temp->next; // Bypass temp node
    delete temp;
}`;

const deleteMiddlePython = `def delete_at_position(self, position):
    if self.head is None: return
    if position == 0: self.delete_at_head(); return
    current = self.head
    for _ in range(position - 1):
        current = current.next
        if current == self.head: return
    current.next = current.next.next # Bypass temp node`;

function generateDeleteMiddleSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40, 50];
  const position = Number.isInteger(input?.position) ? input.position : 2;
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
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
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Traverse current pointer to node index ${i} (${baseNodes[i]}).`,
    });
  }

  const result = [...baseNodes];
  result.splice(position, 1);

  push({
    event: EVENT_TYPES.DELETE,
    line: { cpp: 10, python: 8 },
    state: {
      nodes: result,
      listType: "circular",
      pointers: { head: 0, curr: prevIdx },
      result,
    },
    explanation: `Bypass node at position ${position} (${baseNodes[position]}) by linking node ${baseNodes[prevIdx]} directly to node ${baseNodes[position + 1] || "Head"}.`,
  });

  return steps;
}

export const circularDeleteMiddle = {
  id: "circular-delete-middle",
  category: "Linked List",
  name: "Circular Linked List - Delete from Middle",
  description: "Bypass and delete a target node in a circular linked list.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: deleteMiddleCpp, readOnly: true },
    python: { code: deleteMiddlePython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-del-mid-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40, 50], position: 2 },
      expectedOutput: [10, 20, 40, 50],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateDeleteMiddleSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 6, delete: 10, complete: 10 },
    python: { initialize: 1, move_current: 6, delete: 8, complete: 8 },
  },
};

// ==========================================
// 7. Circular Linked List - Search
// ==========================================
const searchCpp = `int search(Node* head, int value) {
    if (head == nullptr) return -1;
    Node* current = head;
    int index = 0;
    do {
        if (current->data == value) return index;
        current = current->next;
        index++;
    } while (current != head);
    return -1;
}`;

const searchPython = `def search(self, value):
    if self.head is None: return -1
    current = self.head
    index = 0
    while True:
        if current.data == value: return index
        current = current.next
        index += 1
        if current == self.head: break
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
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Search for target value ${searchValue} in circular list.`,
  });

  let foundIdx = -1;
  for (let i = 0; i < baseNodes.length; i++) {
    const match = baseNodes[i] === searchValue;
    push({
      event: match ? EVENT_TYPES.FOUND : EVENT_TYPES.MOVE_CURRENT,
      line: { cpp: match ? 6 : 7, python: match ? 6 : 7 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: match
        ? `Match found at index ${i} (${baseNodes[i]})!`
        : `Node index ${i} (${baseNodes[i]}) != ${searchValue}. Move current pointer next.`,
    });
    if (match) {
      foundIdx = i;
      break;
    }
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 10, python: 10 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0, ...(foundIdx !== -1 ? { curr: foundIdx } : {}) },
      foundIndex: foundIdx,
    },
    explanation: foundIdx !== -1 ? `Search complete! Found at index ${foundIdx}.` : `Value not found.`,
  });

  return steps;
}

export const circularSearch = {
  id: "circular-search",
  category: "Linked List",
  name: "Circular Linked List - Search",
  description: "Search for a value by traversing each node in the cycle once.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: searchCpp, readOnly: true },
    python: { code: searchPython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-search-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40], target: 30 },
      expectedOutput: 2,
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateSearchSteps,
  lineMap: {
    cpp: { initialize: 1, move_current: 7, found: 6, complete: 10 },
    python: { initialize: 1, move_current: 7, found: 6, complete: 10 },
  },
};

// ==========================================
// 8. Circular Linked List - Traverse
// ==========================================
const traverseCpp = `void display(Node* head) {
    if (head == nullptr) return;
    Node* current = head;
    do {
        cout << current->data << " ";
        current = current->next;
    } while (current != head);
    cout << endl;
}`;

const traversePython = `def display(self):
    if self.head is None: return
    current = self.head
    while True:
        print(current.data, end=" ")
        current = current.next
        if current == self.head: break
    print()`;

function generateTraverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0 },
    },
    explanation: `Traverse circular linked list once around the ring.`,
  });

  const visited = [];
  for (let i = 0; i < baseNodes.length; i++) {
    visited.push(i);
    push({
      event: EVENT_TYPES.VISIT,
      line: { cpp: 5, python: 5 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [...visited],
      },
      explanation: `Visit node at index ${i}: ${baseNodes[i]}.`,
    });
  }

  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 8, python: 8 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0 },
      highlightIndexes: [...visited],
    },
    explanation: `Circular traversal complete!`,
  });

  return steps;
}

export const circularTraverse = {
  id: "circular-traverse",
  category: "Linked List",
  name: "Circular Linked List - Traverse",
  description: "Traverse every node in the circular list until returning to head.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: traverseCpp, readOnly: true },
    python: { code: traversePython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-trav-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [10, 20, 30, 40],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateTraverseSteps,
  lineMap: {
    cpp: { initialize: 1, visit: 5, complete: 8 },
    python: { initialize: 1, visit: 5, complete: 8 },
  },
};

// ==========================================
// 9. Circular Linked List - Reverse
// ==========================================
const reverseCpp = `void reverse(Node*& head) {
    if (head == nullptr || head->next == head) return;
    Node* previous = nullptr;
    Node* current = head;
    Node* nextNode;
    do {
        nextNode = current->next;
        current->next = previous; // Reverse next link
        previous = current;
        current = nextNode;
    } while (current != head);
    head->next = previous; // Re-link old head to new head (previous)
    head = previous;       // Update head pointer
}`;

const reversePython = `def reverse(self):
    if self.head is None or self.head.next == self.head: return
    previous = None
    current = self.head
    while True:
        next_node = current.next
        current.next = previous # Reverse next link
        previous = current
        current = next_node
        if current == self.head: break
    self.head.next = previous # Re-link old head to new head
    self.head = previous       # Update head pointer`;

function generateReverseSteps(input) {
  const baseNodes = Array.isArray(input?.nodes) ? [...input.nodes] : [10, 20, 30, 40];
  const { steps, push } = withStepFactory();

  push({
    event: EVENT_TYPES.INITIALIZE,
    line: { cpp: 1, python: 1 },
    state: {
      nodes: [...baseNodes],
      listType: "circular",
      pointers: { head: 0, curr: 0 },
    },
    explanation: `Initial circular list: Head -> ${baseNodes.join(" -> ")} -> (↺ Head).`,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    push({
      event: EVENT_TYPES.SET_NEXT,
      line: { cpp: 8, python: 7 },
      state: {
        nodes: [...baseNodes],
        listType: "circular",
        pointers: { head: 0, curr: i },
        highlightIndexes: [i],
      },
      explanation: `Reverse next link for node ${baseNodes[i]}.`,
    });
  }

  const reversed = [...baseNodes].reverse();
  push({
    event: EVENT_TYPES.COMPLETE,
    line: { cpp: 14, python: 12 },
    state: {
      nodes: reversed,
      listType: "circular",
      pointers: { head: 0 },
      result: reversed,
    },
    explanation: `Circular linked list reversal complete! Head is now ${reversed[0]}.`,
  });

  return steps;
}

export const circularReverse = {
  id: "circular-reverse",
  category: "Linked List",
  name: "Circular Linked List - Reverse",
  description: "Reverse all link directions around the cycle in-place.",
  complexity: { time: "O(n)", space: "O(1)" },
  languages: {
    cpp: { code: reverseCpp, readOnly: true },
    python: { code: reversePython, readOnly: true },
  },
  testCases: [
    {
      id: "cll-rev-1",
      name: "Example 1",
      input: { nodes: [10, 20, 30, 40] },
      expectedOutput: [40, 30, 20, 10],
    },
  ],
  visualizationType: "linked-list",
  generateSteps: generateReverseSteps,
  lineMap: {
    cpp: { initialize: 1, set_next: 8, complete: 14 },
    python: { initialize: 1, set_next: 7, complete: 12 },
  },
};
