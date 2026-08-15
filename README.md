<div align="center">

<a href="#dsa-pattern-visualizer">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=3D2DF5&height=220&section=header&text=DSA%20Pattern%20Visualizer&fontSize=45&fontColor=FCF9F3&animation=fadeIn&fontAlignY=38&desc=Understand%20algorithms%20by%20watching%20code%20come%20alive&descAlignY=61&descSize=17" width="100%" alt="DSA Pattern Visualizer banner"/>
</a>

<h3>Code → Execution → Visualization → Understanding</h3>

<p><em>A visual learning playground for DSA students — connecting the exact source-code line being executed with the data-structure change it causes.</em></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-ES202x-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-Animation-EF008F?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Lucide_React-Icons-F56565?style=for-the-badge" alt="Lucide React"/>
</p>

<img src="https://readme-typing-svg.demolab.com?font=Space+Mono&weight=700&size=16&duration=2800&pause=900&color=6D5DFD&center=true&vCenter=true&width=700&lines=Read+the+code.;Watch+the+execution.;See+the+data+structure+change.;Understand+WHY+it+changed." alt="Typing animation"/>

</div>

✦ DSA Pattern Visualizer

DSA Pattern Visualizer is an educational web application designed to make algorithm execution visible.

Instead of only reading code and mentally simulating it, the student is meant to see the full relationship:

┌──────────────┐
│  Source Code │
└──────┬───────┘
       ↓
┌────────────────────┐
│ Current Line Runs  │
└────────┬───────────┘
         ↓
┌─────────────────────┐
│ Data Structure State│
│       Changes       │
└─────────┬───────────┘
          ↓
┌────────────────────┐
│ Explanation + Why  │
└────────────────────┘

The project specification defines a controlled visualization engine rather than arbitrary C++/Python execution, with read-only predefined source code and synchronized code-line highlighting, visual state, variables, and explanations. fileciteturn12file0L17-L25 fileciteturn12file0L129-L155

⚡ The Learning Loop

Category
   ↓
Pattern
   ↓
C++ / Python
   ↓
Test Case
   ↓
Run
   ↓
Step-by-step Execution
   ↓
┌─────────────────────────────────────┐
│ Active Code Line                    │
│ Data Structure Change               │
│ Variables                           │
│ Short Explanation                   │
│ Next / Previous / Play / Pause      │
└─────────────────────────────────────┘

That follows the intended product flow in the project specification. fileciteturn12file0L30-L59

🎯 Why this project?

Traditional DSA learning

Read code
   ↓
Mentally simulate
   ↓
Get confused
   ↓
Read it again

DSA Pattern Visualizer

Read code
   ↓
See active line
   ↓
Watch values move
   ↓
See state change
   ↓
Read explanation
   ↓
Understand

The intended UX principle is that the learner should always know which line is running, what it is doing, what changed, why it changed, and what happens next. fileciteturn12file1L244-L262

✨ Current Experience

🧠 Editorial Hero

The landing experience is designed as an educational developer tool with bold typography, algorithm artwork, responsive composition, and meaningful motion rather than a generic SaaS layout.

The current hero includes:

DSA / Pattern / Visualizer editorial typography

Interactive algorithm artwork

Bubble Sort array state

Complexity card

Read-only code-card artwork

Binary-tree artwork

DP / memoization artwork

Drag interactions for hero artwork

Light / dark theme support

Responsive mobile navigation

🗂️ Interactive Library

The category preview introduces:

#

Category

01

Arrays

02

Sorting

03

Linked List

04

Stack & Queue

05

Trees

06

Graph

07

Dynamic Programming

The project specification calls for structure-specific visualizations instead of one generic visual treatment for every DSA type. fileciteturn12file8L1574-L1617

🧪 Learning Flow

01  SELECT & READ CODE
          ↓
02  CONFIGURE TEST CASE
          ↓
03  STEP THROUGH EXECUTION
          ↓
04  SEE DATA STRUCTURE CHANGE

The current learning-flow component models these four stages. fileciteturn9file5L5-L36

🎬 Animation Philosophy

Animation should explain something, not simply decorate the UI.

Hover
  ↓
Micro interaction

Compare
  ↓
Affected elements highlight

Swap
  ↓
Elements move

Traversal
  ↓
Current node changes

Execution
  ↓
Active code line changes

Framer Motion is used for UI transitions and micro-interactions, while GSAP is reserved for meaningful algorithm/data-structure animation. fileciteturn12file3L668-L693

🧩 Architecture

DSA Pattern Visualizer
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar
│   │   │   │   └── Footer
│   │   │   │
│   │   │   └── landing/
│   │   │       ├── Hero
│   │   │       ├── HeroVisualization
│   │   │       ├── CategoryPreview
│   │   │       └── LearningFlow
│   │   │
│   │   ├── pages/
│   │   │   └── Home
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── ...
│
└── server/
    └── Express backend

The long-term architecture calls for reusable code viewers, test-case panels, playback controls, step explanations, and structure-specific visualizers. fileciteturn12file1L210-L242

🛠️ Tech Stack

Layer

Technology

Role

Frontend

React

Component-based UI

Tooling

Vite

Fast local development

Language

JavaScript

.js / .jsx only

Styling

Tailwind CSS

Responsive styling

Animation

Framer Motion

UI transitions

Animation

GSAP

Meaningful algorithm animation

Icons

Lucide React

UI iconography

Backend

Node.js + Express

Simple backend layer

The defined stack explicitly excludes TypeScript and Three.js initially. fileciteturn12file0L78-L104

Intentionally not included

❌ Database
❌ Authentication
❌ User accounts
❌ Arbitrary C++ execution
❌ Arbitrary Python execution
❌ User code editor
❌ Three.js

The predefined C++/Python source is educational and read-only. fileciteturn12file0L106-L127

🔍 Code ↔ Visualization Synchronization

This is one of the most important ideas in the project.

Example:

if (arr[j] > arr[j + 1])

becomes visually:

[5] [3] [8] [2] [4]
 ↑   ↑
 j  j+1

with an explanation such as:

Compare 5 and 3.

Then the next step can become:

[3] [5] [8] [2] [4]

with:

5 is greater than 3, so the elements are swapped.

The specification requires the entire source-code line to highlight while the corresponding visual state updates at the same execution step. fileciteturn12file7L1377-L1453

📚 Planned DSA Coverage

Arrays / Patterns

Two Pointer

Sliding Window

Prefix Sum

Kadane's Algorithm

Binary Search

Merge Intervals

Monotonic Stack

Fast & Slow Pointer

Sorting

Bubble Sort

Selection Sort

Insertion Sort

Merge Sort

Quick Sort

Heap Sort

Linked Lists

Singly Linked List

Doubly Linked List

Circular Linked List

Fast & Slow Pointer

Stack / Queue

Stack

Queue

Monotonic Stack

Sliding Window Maximum

Trees

DFS

BFS

Binary Search Tree

Lowest Common Ancestor

Graphs

BFS / DFS

Topological Sort

DSU

Dijkstra

MST

Dynamic Programming

1D DP

2D DP

0/1 Knapsack

LIS

LCS

Advanced DP

The current product specification contains a 31-pattern roadmap across these areas. fileciteturn12file8L1466-L1520

💻 Source Code Philosophy

Every supported pattern is intended to have:

C++
  +
Python

The source is designed to be:

Beginner-friendly

Clean

Correctly formatted

Properly indented

Concise in comments

Read-only inside the application

The specification explicitly calls for C++ and Python source-code versions for every pattern. fileciteturn12file8L1523-L1556

📱 Responsive Design

The UI is designed to adapt across:

Desktop
   ↓
Laptop
   ↓
Tablet
   ↓
Mobile

On smaller screens, code and visualization may stack vertically so the learning relationship remains readable. fileciteturn12file3L651-L665

🌗 Theme System

The landing experience supports:

☀️ Light Mode
      ↕
🌙 Dark Mode

The theme system preserves the editorial visual language while adapting page surfaces, cards, borders, typography, and category colors for the selected mode.

🚀 Getting Started

Clone

git clone <YOUR_REPOSITORY_URL>
cd DSAPattern_Visualizer

Frontend

cd client
npm install
npm run dev

Vite will print the local development URL in the terminal.

Backend

cd server
npm install

Start the backend using the script configured in server/package.json.

The backend is intentionally simple and is not a C++/Python execution environment.

🗺️ Roadmap

PHASE 1   React + Vite + Tailwind + Homepage
          Category navigation + read-only code viewer

PHASE 2   Test cases + execution state + playback controls

PHASE 3   Bubble Sort + line highlighting + step engine

PHASE 4   Two Pointer + Sliding Window + Prefix Sum + Kadane

PHASE 5   Remaining sorting algorithms

PHASE 6   Linked lists + stacks

PHASE 7   Trees

PHASE 8   Graphs

PHASE 9   Dynamic Programming

PHASE 10  Temporary custom test cases

The project is intentionally designed to be implemented incrementally rather than building all 31 algorithms at once. fileciteturn12file4L739-L791

🧪 Example Learning Session

Sorting
   ↓
Bubble Sort
   ↓
C++
   ↓
Example Test Case
   ↓
Run

Then:

┌────────────────────────────┬──────────────────────────┐
│ READ-ONLY SOURCE CODE      │ VISUALIZATION            │
│                            │                          │
│ for (...)                  │ [5] [3] [8] [2] [4]     │
│ if (...)        ← ACTIVE   │  ↑   ↑                   │
│ swap(...)                  │  j  j+1                  │
├────────────────────────────┴──────────────────────────┤
│ EXPLANATION                                            │
│ Compare 5 and 3.                                       │
├────────────────────────────────────────────────────────┤
│ PREVIOUS   ▶ PLAY   NEXT   ↻ RESTART                  │
└────────────────────────────────────────────────────────┘

The planned execution controls include previous, play/pause, next, speed control, progress, and restart. fileciteturn12file3L507-L535

🌟 Development Principles

01 — Teach, don't just animate

Every animation should communicate algorithmic meaning.

02 — Code and visuals stay synchronized

A code line should correspond to the state change it causes.

03 — Structure-specific visualization

Arrays, linked lists, stacks, trees, graphs, and DP should not all look the same.

04 — Beginner first

The visualizer should explain why something happened, not only show that it happened.

05 — Keep the architecture focused

No database, authentication, arbitrary execution, or unnecessary 3D layer.

❤️ Philosophy

See the line. See the state. Understand the reason.

DSA becomes easier when the invisible execution process becomes visible.

<div align="center">

Built for DSA learners who want to see the algorithm think.

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=3D2DF5&height=120&section=footer" width="100%" alt="Footer"/>

</div>
