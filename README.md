# DSA Pattern Visualizer

DSA Pattern Visualizer is an educational web application designed to help students understand Data Structures and Algorithms through step-by-step visual execution.

The main idea is to connect:

**Source Code → Executing Line → Data Structure Change → Explanation**

Instead of only reading an algorithm, students can see what is happening at each step.

---

## Features

- Step-by-step DSA visualization
- Read-only C++ and Python source code
- Current source-code line highlighting
- Visual representation of data-structure changes
- Test-case based execution
- Play, pause, next, previous, and restart controls
- Beginner-friendly explanations
- Responsive UI
- Light and dark theme
- Interactive UI animations

---

## DSA Categories

The project is designed to support the following categories:

- Arrays
- Sorting
- Linked Lists
- Stack & Queue
- Trees
- Graphs
- Dynamic Programming

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS
- Tailwind CSS
- Framer Motion
- Lucide React
- GSAP

### Backend

- Node.js
- Express.js

### Database

No database is used.

### Authentication

No authentication or user accounts are used.

---

## Project Structure

```text
DSAPattern_Visualizer/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── package.json
│   └── ...
│
└── README.md
