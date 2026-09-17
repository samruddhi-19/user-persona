import React, { useEffect, useRef, useState } from "react";
import {
  APP_NAME,
  AUTH_MESSAGE_SOURCE,
  buildAuthorizeUrl,
  saveToken,
} from "../lib/auth.js";
import {
  CheckIcon,
  SpinnerIcon,
  ShieldLockIcon,
  UserPersonaIcon,
} from "../lib/icons.jsx";
import "./auth.css";

export default function AuthPopup({ t }) {
  const [status, setStatus] = useState("idle"); // idle | waiting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const popupRef = useRef(null);

  // Listen for the postMessage dispatched by /authorized.html once the member approves
  useEffect(() => {
    async function handleMessage(event) {
      // The token is a credential: only trust messages from our own origin
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.source !== AUTH_MESSAGE_SOURCE) return;

      if (!event.data.token) {
        setStatus("error");
        setErrorMessage("No authorization token received from Trello.");
        return;
      }

      try {
        await saveToken(t, event.data.token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage("Failed to store authorization credentials: " + (err.message || "Unknown error"));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [t]);

  // Keep the popup height snugly fit to content so no scrollbars appear
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root").catch(() => {});
    }
  }, [t, status]);

  function handleAuthorize() {
    setStatus("waiting");
    setErrorMessage("");

    const returnUrl = `${window.location.origin}/authorized.html`;
    const authUrl = buildAuthorizeUrl(returnUrl);

    popupRef.current = window.open(
      authUrl,
      "trelloAuthPopup",
      "width=560,height=720,menubar=no,toolbar=no,location=no,status=no"
    );

    // If popup was blocked by browser pop-up blocker
    if (!popupRef.current || popupRef.current.closed || typeof popupRef.current.closed === "undefined") {
      setStatus("error");
      setErrorMessage("Popup was blocked by your browser. Please allow popups for this site and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="auth-popup-container auth-state-box">
        <div className="auth-success-circle">
          <CheckIcon width={26} height={26} />
        </div>
        <h3 className="auth-title">Connected to User Personaa</h3>
        <p className="auth-subtitle" style={{ marginBottom: "16px" }}>
          Your Trello account is connected. You can now define, attach, and manage personas across your board!
        </p>
        <button
          type="button"
          onClick={() => {
            if (t && typeof t.closePopup === "function") {
              t.closePopup();
            }
          }}
          className="auth-btn-primary"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="auth-popup-container">
      <div className="auth-header">
        <div className="auth-icon-badge">
          <UserPersonaIcon width={22} height={22} />
        </div>
        <div>
          <h3 className="auth-title">Connect {APP_NAME}</h3>
          <p className="auth-subtitle">Trello Authorization</p>
        </div>
      </div>

      <p className="auth-body-text">
        Connect your Trello account so {APP_NAME} can securely manage user personas, badges, and card attachments on this board.
      </p>

      <div className="auth-features-list">
        <div className="auth-feature-item">
          <span className="auth-feature-dot"></span>
          <span>Assign personas to user stories & cards</span>
        </div>
        <div className="auth-feature-item">
          <span className="auth-feature-dot"></span>
          <span>Display persona badges & demographic tags</span>
        </div>
        <div className="auth-feature-item">
          <span className="auth-feature-dot"></span>
          <span>Member-scoped private token storage</span>
        </div>
      </div>

      {status === "error" && (
        <div className="auth-error-box">
          {errorMessage || "Couldn't connect. Please verify popups are allowed and try again."}
        </div>
      )}

      <button
        type="button"
        onClick={handleAuthorize}
        disabled={status === "waiting"}
        className="auth-btn-primary"
      >
        {status === "waiting" ? (
          <>
            <SpinnerIcon width={16} height={16} />
            Waiting for approval…
          </>
        ) : (
          "Connect Trello Account"
        )}
      </button>

      {status === "waiting" && (
        <p className="auth-body-text" style={{ textAlign: "center", marginTop: "10px", fontSize: "12px" }}>
          Please complete authorization in the popup window.
        </p>
      )}

      {status === "error" && (
        <button type="button" onClick={handleAuthorize} className="auth-link-btn">
          Try again
        </button>
      )}
    </div>
  );
}
