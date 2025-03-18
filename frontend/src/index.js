import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // TailwindCSS base, utility classes, and custom styles

// Rendering the React application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
