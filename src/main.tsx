import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./modules/App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CirclePage from "./modules/circle/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/circle" element={<CirclePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
