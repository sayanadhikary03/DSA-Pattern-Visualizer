import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Patterns page is intentionally deferred — the CTA links here
            so routing is ready when the visualizer itself is built. */}
        <Route path="/patterns" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
