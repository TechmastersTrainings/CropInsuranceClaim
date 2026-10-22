import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/base.css";
import "./styles/components.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext";
import { LocaleProvider } from "./locales";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocaleProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LocaleProvider>
  </StrictMode>
);
