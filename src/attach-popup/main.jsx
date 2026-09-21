/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import AttachPopupApp from "./AttachPopupApp.jsx";

let t = null;
try {
  if (typeof TrelloPowerUp !== "undefined" && typeof TrelloPowerUp.iframe === "function") {
    t = TrelloPowerUp.iframe();
  }
} catch (e) {
  console.warn("TrelloPowerUp.iframe() not available in this context:", e);
}

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
    sizeTo: () => Promise.resolve(),
    closePopup: () => {
      console.log("[Mock] t.closePopup() called");
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AttachPopupApp t={t} />
  </React.StrictMode>
);
