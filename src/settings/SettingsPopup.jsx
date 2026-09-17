import React, { useEffect, useLayoutEffect, useState } from "react";
import { getCurrentMember, disconnectMember, NOT_AUTHORIZED } from "../lib/trelloApi.js";
import { isAuthorized } from "../lib/auth.js";
import { SpinnerIcon, CheckIcon, UserPersonaIcon } from "../lib/icons.jsx";
import "./settings.css";

export default function SettingsPopup({ t }) {
  const [status, setStatus] = useState("checking"); // checking | connected | unauthenticated | error
  const [member, setMember] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    loadMemberProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMemberProfile() {
    setStatus("checking");
    setErrorDetails("");
    try {
      const authed = await isAuthorized(t);
      if (!authed) {
        setStatus("unauthenticated");
        return;
      }

      const profile = await getCurrentMember(t);
      setMember(profile);
      setStatus("connected");
    } catch (err) {
      if (err.message === NOT_AUTHORIZED) {
        setStatus("unauthenticated");
      } else {
        setStatus("error");
        setErrorDetails(err.message || "Failed to query member profile");
      }
    }
  }

  // Adjust popup iframe height to fit contents snugly
  useLayoutEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root").catch(() => {});
    }
  }, [t, status, member]);

  useEffect(() => {
    const rootEl = document.getElementById("root");
    if (!rootEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      if (t && typeof t.sizeTo === "function") {
        t.sizeTo("#root").catch(() => {});
      }
    });

    observer.observe(rootEl);
    return () => observer.disconnect();
  }, [t]);

  function openAuthPopup() {
    if (t && typeof t.popup === "function") {
      return t.popup({
        title: "Authorize User Personaa",
        url: "./auth.html",
        height: 260,
      });
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectMember(t);
      setMember(null);
      setStatus("unauthenticated");
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  }

  if (status === "checking") {
    return (
      <div className="settings-root">
        <div className="settings-loading">
          <SpinnerIcon width={24} height={24} style={{ color: "#579DFF" }} />
          <p className="settings-loading-text">Verifying Trello connection…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="settings-root">
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(87, 157, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              color: "#579DFF",
            }}
          >
            <UserPersonaIcon width={24} height={24} />
          </div>
          <h3 style={{ fontSize: 15, margin: "0 0 6px" }}>Not Connected</h3>
          <p className="settings-info-text">
            Connect your Trello account to activate User Personaa on this board.
          </p>
          <button type="button" className="settings-btn-primary" onClick={openAuthPopup}>
            Connect Trello Account
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="settings-root">
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <p style={{ color: "#f87168", fontSize: 13, marginBottom: 12 }}>
            {errorDetails || "Unable to communicate with Trello API."}
          </p>
          <button type="button" className="settings-btn-primary" onClick={openAuthPopup}>
            Reconnect Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-root">
      <div className="settings-badge-connected">
        <span className="settings-status-dot"></span>
        <span>Connected to Trello</span>
      </div>

      {member && (
        <div className="settings-profile-card">
          {member.avatarUrl ? (
            <img
              src={`${member.avatarUrl}/50.png`}
              alt={member.fullName || member.username}
              className="settings-avatar"
            />
          ) : (
            <div className="settings-avatar-fallback">
              {member.initials || (member.fullName ? member.fullName[0] : "U")}
            </div>
          )}
          <div className="settings-profile-info">
            <p className="settings-name">{member.fullName || "Trello Member"}</p>
            <p className="settings-username">@{member.username}</p>
          </div>
        </div>
      )}

      <p className="settings-info-text">
        User Personaa is authorized to manage personas and badge indicators on this board.
      </p>

      <button
        type="button"
        onClick={() => {
          if (t && typeof t.closePopup === "function") {
            t.closePopup();
          }
        }}
        className="settings-btn-primary"
      >
        Done
      </button>

      <div className="settings-action-links">
        <button type="button" onClick={openAuthPopup} className="settings-link">
          Switch account or re-authorize
        </button>
        <button
          type="button"
          onClick={handleDisconnect}
          className="settings-btn-disconnect"
        >
          Disconnect Account
        </button>
      </div>
    </div>
  );
}
