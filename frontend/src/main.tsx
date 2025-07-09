// src/main.tsx or src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";


import App from "./App";
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
