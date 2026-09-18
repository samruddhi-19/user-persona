/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import PersonasApp from "./PersonasApp.jsx";

// Initialize Trello PowerUp iframe context or provide fallback for local dev
let t = null;
try {
  if (typeof TrelloPowerUp !== "undefined" && typeof TrelloPowerUp.iframe === "function") {
    t = TrelloPowerUp.iframe();
  }
} catch (e) {
  console.warn("TrelloPowerUp.iframe() not available in this context:", e);
}

// Robust fallback mock for local development, workbench preview, and testing
if (!t) {
  t = {
    get: (scope, visibility, key) => {
      const raw = localStorage.getItem(`trello_${scope}_${visibility}_${key}`);
      try {
        return Promise.resolve(raw ? JSON.parse(raw) : null);
      } catch {
        return Promise.resolve(raw);
      }
    },
    set: (scope, visibility, key, val) => {
      localStorage.setItem(
        `trello_${scope}_${visibility}_${key}`,
        typeof val === "string" ? val : JSON.stringify(val)
      );
      return Promise.resolve();
    },
    remove: (scope, visibility, key) => {
      localStorage.removeItem(`trello_${scope}_${visibility}_${key}`);
      return Promise.resolve();
    },
    sizeTo: () => Promise.resolve(),
    closeModal: () => {
      console.log("[Mock] t.closeModal() called");
    },
    closePopup: () => {
      console.log("[Mock] t.closePopup() called");
    },
    modal: (opts) => {
      console.log("[Mock] t.modal() called with:", opts);
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersonasApp t={t} />
  </React.StrictMode>
);
