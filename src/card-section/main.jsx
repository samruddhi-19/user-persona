/* global TrelloPowerUp */
import React from "react";
import ReactDOM from "react-dom/client";
import CardSectionApp from "./CardSectionApp.jsx";

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
    popup: (opts) => {
      console.log("[Mock] t.popup() called with:", opts);
      window.open(opts.url, "AttachPopup", "width=360,height=420");
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CardSectionApp t={t} />
  </React.StrictMode>
);
