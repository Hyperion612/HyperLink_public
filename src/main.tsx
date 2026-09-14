import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log('HyperLink starting...');

const root = document.getElementById("root");
if (!root) {
  console.error('Root element not found!');
} else {
  ReactDOM.createRoot(root).render(<App />);
}
