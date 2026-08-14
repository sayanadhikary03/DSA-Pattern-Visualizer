You are a senior full-stack engineer, frontend architect, UI/UX designer, and DSA visualization expert.

I want you to build a complete educational web application called:

"DSA Pattern Visualizer"

The goal of this project is to help students understand common DSA patterns by connecting:

1. The actual C++/Python source code
2. The exact code line currently executing
3. The data structure state changing because of that line
4. A clear visual explanation of what is happening
5. Step-by-step execution controls

The website should be educational, clean, minimal, professional, and highly understandable.

Do NOT make it look like a typical flashy coding website.

==================================================
1. CORE IDEA
==================================================

The user selects:

Category
    ↓
Pattern
    ↓
Programming Language
    ↓
Test Case
    ↓
Run
    ↓
Step-by-step visualization

Example:

Sorting
    ↓
Bubble Sort
    ↓
C++
    ↓
Example Test Case 1
    ↓
Run
    ↓
Visualization starts

The predefined algorithm code is shown on the screen.

The user MUST NOT be able to edit, modify, overwrite, or replace the predefined source code.

The code is READ-ONLY.

The user can select predefined test cases.

Later, the user will also be able to create temporary custom test cases.

Custom test cases must NOT modify the algorithm source code.

Custom test cases must NOT be stored in a database.

Custom test cases only exist in frontend state during the current session.

==================================================
2. TECHNOLOGY STACK
==================================================

Use the following stack:

Frontend:
- React
- JavaScript
- Vite
- HTML
- CSS
- Tailwind CSS

IMPORTANT:
DO NOT use TypeScript.

Use JavaScript (.js / .jsx) only.

UI:
- Tailwind CSS
- Lucide React for icons where useful
- Framer Motion for UI transitions and micro-interactions
- GSAP only where it provides meaningful algorithm/data-structure animations

Do NOT use Three.js initially.

The visualizer should prioritize clarity and educational value over unnecessary 3D effects.

Backend:
- Node.js
- Express.js

The backend should remain simple.

Do NOT use C++ as the backend.

The C++ and Python code shown in the application are educational source-code representations, NOT the backend technology.

Database:
- NO DATABASE

Authentication:
- NO AUTHENTICATION

User accounts:
- NO USER ACCOUNTS

Deployment:
- Ignore deployment for now.
- Focus only on local development and architecture.

==================================================
3. IMPORTANT ARCHITECTURAL DECISION
==================================================

DO NOT execute arbitrary C++ or Python code supplied by users.

There is no user code editor.

There is no arbitrary code execution system.

The predefined C++ and Python code is educational/read-only code.

Instead, implement a controlled visualization execution engine.

The visualization engine should produce a sequence of execution steps representing what the algorithm does.

Conceptually:

Algorithm
    ↓
Visualization Execution Logic
    ↓
Execution Steps
    ↓
React UI
    ↓
Code Line Highlight + Visual State + Explanation

For example:

{
    step: 1,
    line: 8,
    type: "compare",

    state: {
        array: [5, 3, 8, 2, 4],
        comparing: [0, 1]
    },

    variables: {
        i: 0,
        j: 0
    },

    explanation: "Compare 5 and 3."
}

The UI consumes these execution steps.

==================================================
4. CODE LINE HIGHLIGHTING
==================================================

This is one of the MOST IMPORTANT features.

When an execution step is active, highlight the ENTIRE corresponding source-code line.

Do NOT highlight only the line number.

Example:

    if (arr[j] > arr[j + 1]) {

The entire line should receive the active highlight treatment.

The code viewer should clearly show:

- line number
- complete source line
- current execution indicator
- active line highlight

Example concept:

------------------------------------------------
7   for (...)
8   {
9      if (arr[j] > arr[j + 1]) {   ← ACTIVE
10         swap(...)
11     }
------------------------------------------------

When the active line changes, the highlight should smoothly move to the new line.

The code viewer is READ-ONLY.

==================================================
5. VISUALIZATION + CODE MUST STAY SYNCHRONIZED
==================================================

When a code line executes:

1. Highlight that entire code line.
2. Update the corresponding visual state.
3. Highlight affected data structures/elements.
4. Update variables if relevant.
5. Show a short explanation.
6. Allow the user to move to the next step.

Example:

Code:

if (arr[j] > arr[j + 1])

Visualization:

[5] [3] [8] [2] [4]
 ↑   ↑
 j   j+1

Explanation:

"Compare 5 and 3."

Next step:

swap(arr[j], arr[j + 1]);

Visualization:

[3] [5] [8] [2] [4]

Explanation:

"5 is greater than 3, so the two elements are swapped."

The relationship must always be obvious:

CODE LINE
    ↓
WHAT CODE DOES
    ↓
WHAT CHANGES VISUALLY
    ↓
WHY IT CHANGES

==================================================
6. TEST CASE ARCHITECTURE
==================================================

Test cases MUST be completely separate from the source code.

Do NOT put test cases inside the displayed C++/Python source code.

Do NOT use main() for test cases in the educational source code.

For example:

const bubbleSortTestCases = [
    {
        id: "bubble-tc-1",
        name: "Example 1",
        input: [5, 3, 8, 2, 4]
    },
    {
        id: "bubble-tc-2",
        name: "Example 2",
        input: [7, 1, 6, 3, 2]
    }
];

The user selects a test case and clicks:

[ RUN ]

That test case is passed to the visualization engine.

==================================================
7. CUSTOM TEST CASES
==================================================

Implement the architecture so that custom test cases can be added later.

For now, the application should support predefined test cases.

The architecture must make it easy to add:

[ + Add Test Case ]

The user should eventually be able to enter their own valid input.

Example:

Array:
[10, 3, 7, 2, 8]

Then:

[ Run Test Case ]

The custom test case should follow EXACTLY the same process as predefined test cases:

Custom Input
    ↓
Same Algorithm
    ↓
Same Visualization Engine
    ↓
Same Execution Steps
    ↓
Same Code Highlighting
    ↓
Same Visualization
    ↓
Same Explanation
    ↓
Final Result

Do NOT create a separate visualization system for custom test cases.

Only the input/state changes.

Custom test cases should live only in React state.

No database.

No persistence.

No authentication.

==================================================
8. SUPPORTED CATEGORIES AND PATTERNS
==================================================

The application must support the following categories and patterns.

ARRAYS
----------------------------

1. Two Pointer
   Implementation:
   Two Sum in Sorted Array

2. Sliding Window
   Implementation:
   Maximum Sum Subarray of Size K

3. Prefix Sum
   Implementation:
   Range Sum Queries

4. Kadane
   Implementation:
   Maximum Subarray Sum


SORTING
----------------------------

5. Bubble Sort
   Implementation:
   Bubble Sort

6. Selection Sort
   Implementation:
   Selection Sort

7. Insertion Sort
   Implementation:
   Insertion Sort

8. Merge Sort
   Implementation:
   Merge Sort

9. Quick Sort
   Implementation:
   Quick Sort

10. Heap Sort
    Implementation:
    Heap Sort


LINKED LIST
----------------------------

11. Singly Linked List
    Implementation:
    Insert + Traversal

12. Doubly Linked List
    Implementation:
    Insert + Traversal

13. Circular Linked List
    Implementation:
    Insert + Traversal

14. Fast/Slow Pointer
    Implementation:
    Find Middle Node


STACK
----------------------------

15. Normal Stack
    Implementation:
    Push / Pop / Peek

16. Monotonic Stack
    Implementation:
    Next Greater Element


TREES
----------------------------

17. Binary Tree
    Implementation:
    Inorder Traversal

18. BST
    Implementation:
    Search

19. Tree DFS
    Implementation:
    DFS Traversal

20. Tree BFS
    Implementation:
    Level Order Traversal


GRAPH
----------------------------

21. Graph BFS/DFS
    Implementation:
    Graph Traversal

22. Topological Sort
    Implementation:
    Kahn's Algorithm

23. DSU
    Implementation:
    Union-Find

24. Shortest Path
    Implementation:
    Dijkstra

25. MST
    Implementation:
    Kruskal


DYNAMIC PROGRAMMING
----------------------------

26. 1D DP
    Implementation:
    Climbing Stairs

27. 2D DP
    Implementation:
    Unique Paths

28. 0/1 Knapsack
    Implementation:
    0/1 Knapsack

29. LIS
    Implementation:
    Longest Increasing Subsequence

30. LCS
    Implementation:
    Longest Common Subsequence

31. Advanced DP
    Implementation:
    Matrix Chain Multiplication / Interval DP

==================================================
9. PROGRAMMING LANGUAGES
==================================================

Every pattern must have two predefined source-code versions:

C++
Python

Example:

Bubble Sort

    [ C++ ] [ Python ]

When C++ is selected:

Show predefined C++ code.

When Python is selected:

Show predefined Python code.

The code must be:

- beginner friendly
- clean
- easy to understand
- correctly formatted
- properly indented
- contain useful short comments
- not overloaded with comments
- suitable for DSA students

The code should demonstrate the actual algorithm clearly.

==================================================
10. NO CODE EDITOR
==================================================

Do NOT use Monaco Editor as a code editor.

Do NOT create a coding playground.

Do NOT allow source modification.

A syntax-highlighted READ-ONLY code viewer is enough.

A lightweight syntax-highlighting library can be used.

The student is learning the algorithm, not writing code.

==================================================
11. VISUALIZATION TYPES
==================================================

Do NOT use one visualization design for every algorithm.

Different DSA structures require different visual representations.

ARRAY ALGORITHMS:

Use:

- array cells
- indices
- pointers
- windows
- highlighted ranges
- comparison indicators
- movement animations

Example:

[ 5 ][ 3 ][ 8 ][ 2 ][ 4 ]
  ↑    ↑
 left right

SORTING:

Use array elements as cards/cells.

Do NOT make a generic boring bar-chart-only visualizer.

Show:

- comparisons
- swaps
- selected elements
- sorted regions
- current minimum
- pivot
- partitions
- heap structure where appropriate

The visualization should be easy to understand for a beginner.

LINKED LIST:

Use actual node diagrams.

Example:

HEAD
 ↓
[10] → [20] → [30] → NULL

For doubly linked list:

NULL ← [10] ⇄ [20] ⇄ [30] → NULL

For circular linked list:

      ┌───────────────┐
      ↓               │
[10] → [20] → [30] ───┘

Show pointer movement.

STACK:

Use a vertical stack.

Example:

TOP
 ↓
┌────┐
│ 30 │
├────┤
│ 20 │
├────┤
│ 10 │
└────┘

Animate push/pop/peek.

TREES:

Use actual tree diagrams.

Example:

        8
       / \
      4   12
     / \
    2   6

Highlight:

- current node
- visited nodes
- traversal path
- left/right movement
- queue where appropriate

GRAPH:

Use nodes and edges.

Example:

A ─── B
│     │
│     │
C ─── D

Show:

- visited nodes
- current node
- edges being explored
- queue
- distance values
- selected MST edges
- rejected edges
- indegrees
- connected components

DP:

Use tables/grids.

For 1D DP:

[1][2][3][5][8]

For 2D DP:

[1][1][1]
[1][2][3]
[1][3][6]

For Knapsack:

Show:

- item
- capacity
- take
- skip
- selected value

For LCS:

Show two strings and a DP grid.

For Matrix Chain Multiplication:

Show intervals and split positions.

==================================================
12. VISUALIZATION MUST BE BEGINNER FRIENDLY
==================================================

The visualizer must answer:

"What is happening?"

"Why is it happening?"

"Which code line caused it?"

"What changed?"

"What happens next?"

Every step should ideally contain:

- current code line
- current variables
- affected elements/nodes
- short explanation
- current data structure state

Example:

Step 7 / 24

Current line:

if (arr[j] > arr[j + 1])

Variables:

i = 0
j = 1

Action:

Compare 5 and 8

Result:

5 < 8

Next:

Move to the next pair.

==================================================
13. EXECUTION CONTROLS
==================================================

Provide:

[ Previous Step ]

[ Play / Pause ]

[ Next Step ]

Speed control:

Slow
Normal
Fast

Progress indicator:

Step 7 / 24

Optionally provide:

[ Restart ]

The user must be able to pause the visualization.

The user must be able to manually go step-by-step.

==================================================
14. FINAL RESULT
==================================================

When execution finishes, clearly show:

Algorithm Completed

Input:
[5, 3, 8, 2, 4]

Output:
[2, 3, 4, 5, 8]

For other algorithms, show the appropriate final result.

Examples:

Two Pointer:
Pair found: (2, 9)

Dijkstra:
Shortest distances:
[0, 4, 2, 3]

LCS:
Longest Common Subsequence:
"ace"

Knapsack:
Maximum value:
22

Do not make the final result ambiguous.

==================================================
15. UI LAYOUT
==================================================

Create a professional minimal layout.

Suggested structure:

------------------------------------------------------
HEADER
------------------------------------------------------

DSA Pattern Visualizer

Categories / navigation

------------------------------------------------------

MAIN CONTENT

LEFT / CENTER:
Pattern information

Category:
Sorting

Pattern:
Bubble Sort

Language:
[ C++ ] [ Python ]

------------------------------------------------------

CODE PANEL                     VISUALIZATION PANEL

READ-ONLY CODE                 Visualization

1  void bubbleSort...           [5][3][8][2][4]
2  {
3      int n...                       ↑ ↑
4
5      for (...)                 Comparing
6
7      for (...)                 Current State
8      if (...)  ← ACTIVE
9          swap(...)

------------------------------------------------------

STEP EXPLANATION

"5 is greater than 3, so the elements are swapped."

------------------------------------------------------

TEST CASES

Example 1                       [ RUN ]
Example 2                       [ RUN ]

+ Add Test Case

------------------------------------------------------

CONTROLS

[ Previous ] [ Play ] [ Next ] [ Restart ]

Step 8 / 24

------------------------------------------------------

FINAL RESULT

------------------------------------------------------

The exact layout can be improved during implementation, but preserve this information hierarchy.

==================================================
16. RESPONSIVE DESIGN
==================================================

The website must work on:

- desktop
- laptop
- tablet

Mobile support should be considered, but desktop is the primary target because the application contains code + visualization simultaneously.

On smaller screens:

Code and visualization may stack vertically.

==================================================
17. DESIGN LANGUAGE
==================================================

The design should be:

- minimal
- professional
- modern
- clean
- educational
- visually clear

Avoid:

- excessive gradients
- excessive glassmorphism
- excessive neon effects
- unnecessary 3D
- huge animations
- distracting backgrounds
- gaming UI
- overly decorative elements

The visualization itself can have meaningful animations.

The UI should feel like a serious educational developer tool.

==================================================
18. ANIMATION
==================================================

Use Framer Motion for:

- page transitions
- panel transitions
- active states
- UI interactions
- smooth appearance/disappearance

Use GSAP where useful for:

- swapping array elements
- pointer movement
- node movement
- graph transitions
- complex data structure animations

Animations must communicate algorithmic operations.

Do NOT animate just for decoration.

Example:

When Bubble Sort swaps:

[5] [3]

should visually exchange positions.

When a pointer moves:

left pointer should visibly move to the next index.

When a linked-list pointer moves:

the pointer should animate to the next node.

When Dijkstra updates a distance:

the distance value should visibly change.

==================================================
19. PROJECT STRUCTURE
==================================================

Use a clean React structure similar to:

src/
│
├── components/
│   ├── layout/
│   ├── code/
│   │   └── CodeViewer.jsx
│   ├── testCases/
│   │   ├── TestCasePanel.jsx
│   │   └── CustomTestCase.jsx
│   ├── execution/
│   │   ├── PlaybackControls.jsx
│   │   └── StepInfo.jsx
│   └── visualization/
│       ├── ArrayVisualizer.jsx
│       ├── LinkedListVisualizer.jsx
│       ├── StackVisualizer.jsx
│       ├── TreeVisualizer.jsx
│       ├── GraphVisualizer.jsx
│       └── DPVisualizer.jsx
│
├── algorithms/
│   ├── arrays/
│   ├── sorting/
│   ├── linkedList/
│   ├── stack/
│   ├── trees/
│   ├── graph/
│   └── dp/
│
├── data/
│   ├── testCases/
│   └── algorithms/
│
├── engine/
│   ├── executionEngine.js
│   ├── stepGenerator.js
│   └── visualizationState.js
│
├── pages/
│   ├── Home.jsx
│   └── PatternPage.jsx
│
├── hooks/
│   └── useVisualizer.js
│
├── utils/
│
├── App.jsx
└── main.jsx

You may improve this structure if you have a strong architectural reason.

==================================================
20. DATA SEPARATION
==================================================

Keep these separate:

A. Algorithm source code

B. Test case data

C. Visualization logic

D. Execution state

E. UI components

Do NOT put everything into one giant file.

For example:

algorithm:
    bubbleSort.js

test cases:
    bubbleSort.testCases.js

visualization:
    bubbleSort.visualization.js

This separation is important.

==================================================
21. EXECUTION ENGINE
==================================================

Create a reusable execution engine.

Concept:

runAlgorithm(pattern, language, testCase)

returns:

[
    step1,
    step2,
    step3,
    ...
]

Each step should contain enough information for the UI.

Recommended structure:

{
    step: 1,

    line: 5,

    type: "compare",

    state: {...},

    variables: {...},

    explanation: "...",

    affectedElements: [...]
}

Different algorithms can have different state shapes.

For example:

Array:

{
    array: [...],
    comparing: [...],
    swapping: [...]
}

Linked List:

{
    nodes: [...],
    currentNode: 2,
    pointers: {
        slow: 1,
        fast: 3
    }
}

Tree:

{
    visited: [...],
    currentNode: 4
}

Graph:

{
    visited: [...],
    currentNode: 2,
    queue: [...]
}

DP:

{
    dp: [...],
    currentCell: [2, 3],
    dependencies: [...]
}

==================================================
22. IMPORTANT: LANGUAGE INDEPENDENCE
==================================================

The visualization should not require two completely different visualization implementations for C++ and Python.

C++ and Python source code are displayed separately.

The underlying algorithmic visualization behavior should be shared.

For example:

C++ Bubble Sort
+
Python Bubble Sort

should both produce the same conceptual execution:

COMPARE
→ SWAP
→ MOVE
→ COMPARE
→ ...

Only the highlighted source line differs depending on the selected language.

Create language-specific line mappings where necessary.

Example:

{
    cpp: {
        compare: 8,
        swap: 9
    },

    python: {
        compare: 7,
        swap: 8
    }
}

==================================================
23. LINE MAPPING
==================================================

Each algorithm must have explicit line mappings.

Do NOT try to dynamically guess which line should be highlighted.

For example:

const bubbleSortLineMap = {
    initialize: {
        cpp: 5,
        python: 2
    },

    compare: {
        cpp: 8,
        python: 7
    },

    swap: {
        cpp: 9,
        python: 8
    }
};

The execution engine emits semantic actions:

"compare"

"swap"

"move_pointer"

etc.

The language-specific line mapping determines which line is highlighted.

==================================================
24. SOURCE CODE QUALITY
==================================================

All C++ and Python algorithms must:

- be correct
- be beginner friendly
- have simple variable names
- have short useful comments
- avoid unnecessarily advanced language features
- follow standard DSA implementation style

Do NOT optimize the code to the point where beginners cannot understand it.

Educational clarity is more important than micro-optimizations.

==================================================
25. TEST CASE REQUIREMENT
==================================================

Each pattern must initially have exactly 2 predefined test cases.

Test cases must be separate from the source code.

Each test case must include:

- id
- name
- input
- expected output

Example:

{
    id: "bubble-1",
    name: "Basic Example",
    input: [5, 3, 8, 2, 4],
    expectedOutput: [2, 3, 4, 5, 8]
}

==================================================
26. ERROR HANDLING
==================================================

If a custom test case is invalid, show a clear educational error.

Examples:

"Please enter at least one array element."

"Window size K cannot be greater than the array length."

"Graph contains an invalid node."

"Matrix dimensions are invalid."

Do not crash the application.

==================================================
27. PERFORMANCE
==================================================

The initial visualizer can use small inputs.

Do NOT allow huge test cases that generate thousands of animation steps.

Set sensible limits for visualization inputs.

For example:

Array visualizations:
maximum 20–30 elements.

Graphs:
maximum reasonable number of nodes.

DP:
reasonable grid size.

The goal is educational visualization, not benchmarking.

==================================================
28. NO DATABASE
==================================================

Do not install:

MongoDB
PostgreSQL
MySQL
Firebase
Supabase

No database is required.

All algorithm definitions and predefined test cases can be static JavaScript data.

Custom test cases remain in React state.

==================================================
29. NO AUTHENTICATION
==================================================

Do not add:

Login
Signup
JWT
OAuth
User profiles
Sessions

This is a completely open educational application.

==================================================
30. BACKEND
==================================================

The first version should keep backend responsibilities minimal.

Use Node.js + Express only if an API layer is useful for the project architecture.

Do NOT build a complicated backend.

The frontend should be able to work primarily from local/static algorithm data.

Do not introduce unnecessary APIs simply because the project has a backend.

If an Express backend is included, structure it so that future functionality can be added easily.

==================================================
31. HOMEPAGE
==================================================

Create a clean homepage.

Hero:

DSA Pattern Visualizer

Subtitle:

"Understand DSA by connecting every line of code to every step of execution."

Show category cards:

Arrays
Sorting
Linked List
Stack
Trees
Graph
Dynamic Programming

Each category shows the number of patterns.

Clicking a category opens its patterns.

==================================================
32. PATTERN PAGE
==================================================

Example:

/patterns/sorting/bubble-sort

Show:

Bubble Sort

Description:

"Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order."

Complexity:

Time:
O(n²)

Space:
O(1)

Then:

Language selector:

[C++] [Python]

Then code + visualization.

==================================================
33. EDUCATIONAL INFORMATION
==================================================

Each pattern should also show a small information section:

What is this pattern?

How does it work?

When is it useful?

Time Complexity

Space Complexity

But do not make the page text-heavy.

The visualization is the primary learning tool.

==================================================
34. FINAL GOAL
==================================================

The final application should feel like:

"LeetCode explanation + visual debugger + DSA animation tool"

but it should NOT be a coding platform.

The student should be able to:

1. Select a DSA category.
2. Select a pattern.
3. Select C++ or Python.
4. Read the predefined code.
5. Select a test case.
6. Click Run.
7. Watch the algorithm execute.
8. See the entire current source line highlighted.
9. See the corresponding data structure change.
10. See variable values.
11. Read a short explanation.
12. Pause.
13. Resume.
14. Go to the next step.
15. Go to the previous step.
16. Restart.
17. See the final result.
18. Eventually create a custom test case.
19. Run the custom test case through exactly the same visualization engine.

==================================================
35. DEVELOPMENT APPROACH
==================================================

Do NOT try to build all 31 algorithms immediately.

Build incrementally.

Phase 1:
- React setup
- Tailwind
- routing
- homepage
- category navigation
- pattern page
- read-only code viewer

Phase 2:
- test-case system
- execution state
- playback controls

Phase 3:
- Bubble Sort visualizer
- complete line highlighting
- step engine
- animation

Phase 4:
- Two Pointer
- Sliding Window
- Prefix Sum
- Kadane

Phase 5:
- remaining sorting algorithms

Phase 6:
- linked lists
- stacks

Phase 7:
- trees

Phase 8:
- graphs

Phase 9:
- DP

Phase 10:
- custom test cases

Do not move to the next phase until the current architecture works correctly.

==================================================
36. IMPORTANT DEVELOPMENT RULE
==================================================

Before implementing every algorithm, define:

1. Source code
2. Test cases
3. Line mapping
4. Execution events
5. Visualization state
6. Visualization component
7. Explanation messages

For example:

Bubble Sort:

Events:
- initialize
- compare
- swap
- complete

Visualization:
- array cells
- comparison highlight
- swap animation
- sorted section

Variables:
- i
- j
- n

Then implement it.

==================================================
37. CODE QUALITY
==================================================

Write maintainable code.

Avoid:

- giant components
- duplicated visualization logic
- duplicated playback logic
- hardcoded UI everywhere
- unnecessary dependencies
- unnecessary backend APIs

Use reusable components.

For example:

<CodeViewer />

<TestCasePanel />

<PlaybackControls />

<StepExplanation />

<ArrayVisualizer />

<TreeVisualizer />

<GraphVisualizer />

<DPVisualizer />

==================================================
38. IMPORTANT UX PRINCIPLE
==================================================

At every moment, the student should be able to answer:

"Which line is running?"

"What is this line doing?"

"What changed because of it?"

"Why did it change?"

"What happens next?"

If a visualization does not make these relationships clear, redesign that visualization.

Do not prioritize visual effects over comprehension.

==================================================
39. FINAL IMPLEMENTATION REQUIREMENT
==================================================

Build the application using JavaScript, not TypeScript.

Use React + Vite + Tailwind CSS.

Use Framer Motion and GSAP where useful.

Use Node.js + Express only where necessary.

No database.

No authentication.

No deployment work.

No user code editor.

No arbitrary C++/Python execution.

Predefined C++/Python code is READ-ONLY.

Test cases are separate.

Custom test cases are temporary frontend state.

Every test case uses the same visualization engine.

Every algorithm has its own appropriate visualization.

Every execution step highlights the ENTIRE source-code line and simultaneously updates the visual state.

The final result must be understandable to a student who is seeing the DSA pattern for the first time.