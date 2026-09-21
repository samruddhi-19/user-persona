import React, { useState, useEffect } from "react";
import { UserPersonaIcon, XCloseIcon, PlusIcon } from "../lib/icons.jsx";
import { SAMPLE_PERSONAS } from "../personas/PersonasApp.jsx";
import "./card-section.css";

export default function CardSectionApp({ t }) {
  const [boardPersonas, setBoardPersonas] = useState([]);
  const [attachedIds, setAttachedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      let bPersonas = await t.get("board", "shared", "personas");
      if (!bPersonas || !Array.isArray(bPersonas) || bPersonas.length === 0) {
        bPersonas = SAMPLE_PERSONAS;
      }

      let cardAttached = await t.get("card", "shared", "attachedPersonaIds");
      // Default to Maya Lin and Marcus Vance for initial demo preview matching screenshot
      if (!cardAttached || !Array.isArray(cardAttached)) {
        cardAttached = ["persona-maya-lin", "persona-marcus-vance"];
        await t.set("card", "shared", "attachedPersonaIds", cardAttached);
      }

      setBoardPersonas(bPersonas);
      setAttachedIds(cardAttached);
    } catch (err) {
      console.error("Error loading card section data:", err);
      setBoardPersonas(SAMPLE_PERSONAS);
      setAttachedIds(["persona-maya-lin", "persona-marcus-vance"]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // Listen for cross-iframe sync events
    const handleAttachmentChanged = (e) => {
      if (e?.detail?.attachedPersonaIds) {
        setAttachedIds(e.detail.attachedPersonaIds);
      } else {
        loadData();
      }
    };

    const handleStorage = (e) => {
      if (e.key === "trello_card_shared_attachedPersonaIds" || e.key === "trello_board_shared_personas") {
        loadData();
      }
    };

    window.addEventListener("persona-attachment-changed", handleAttachmentChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("persona-attachment-changed", handleAttachmentChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [t]);

  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      // Small timeout to ensure DOM has rendered before sizing
      const timer = setTimeout(() => {
        t.sizeTo("#root");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [attachedIds, boardPersonas]);

  function openAttachPopup(e) {
    if (e) e.preventDefault();
    if (t && typeof t.popup === "function") {
      t.popup({
        title: "Attach Personas",
        url: "./attach-popup.html",
        height: 380,
      });
    }
  }

  async function handleDetach(personaId, e) {
    if (e) e.stopPropagation();
    const nextAttached = attachedIds.filter((id) => id !== personaId);
    setAttachedIds(nextAttached);
    try {
      await t.set("card", "shared", "attachedPersonaIds", nextAttached);
      localStorage.setItem("trello_card_shared_attachedPersonaIds", JSON.stringify(nextAttached));
    } catch (err) {
      console.error("Failed to detach persona:", err);
    }
  }

  // Resolve attached personas
  const attachedPersonas = attachedIds
    .map((id) => boardPersonas.find((p) => p.id === id))
    .filter(Boolean);

  if (loading) {
    return (
      <div className="card-section-wrapper" id="root">
        <div style={{ color: "var(--ads-text-subtle)", fontSize: "12.5px" }}>Loading personas...</div>
      </div>
    );
  }

  return (
    <div className="card-section-wrapper" id="root">
      {/* Header */}
      <div className="card-section-header">
        <div className="card-section-title-group">
          <span className="card-section-title-icon">
            <UserPersonaIcon width={16} height={16} strokeWidth={2.2} />
          </span>
          <h3 className="card-section-heading">
            TARGET USER PERSONAS <span className="card-section-count">({attachedPersonas.length})</span>
          </h3>
        </div>

        <button type="button" className="btn-add-persona-pill" onClick={openAttachPopup}>
          <PlusIcon width={13} height={13} strokeWidth={2.5} />
          <span>Add Persona</span>
        </button>
      </div>

      {/* Persona Cards */}
      {attachedPersonas.length === 0 ? (
        <div className="card-section-empty">
          <p className="card-section-empty-text">
            No target user personas attached to this card yet.
          </p>
          <button type="button" className="btn-attach-empty" onClick={openAttachPopup}>
            <PlusIcon width={14} height={14} />
            <span>Attach Target Persona</span>
          </button>
        </div>
      ) : (
        <div className="attached-personas-list">
          {attachedPersonas.map((persona) => {
            const painPoint =
              (persona.painPoints && persona.painPoints[0]) ||
              "Disconnected user feedback scattered across tools";
            const motivation =
              (persona.motivations && persona.motivations[0]) ||
              "Advocating for the end-user throughout every ticket";

            return (
              <div key={persona.id} className="attached-persona-card">
                {/* Top Row: Avatar, Name, Age, Role, Remove */}
                <div className="persona-card-top-row">
                  <div className="persona-card-meta-left">
                    <img
                      src={persona.avatar || "./avatars/avatar-3.png"}
                      alt={persona.name}
                      className="persona-card-avatar"
                    />
                    <div className="persona-card-headings">
                      <div className="persona-card-name-row">
                        <span className="persona-card-name">{persona.name}</span>
                        {persona.age && (
                          <span className="persona-card-age-badge">Age {persona.age}</span>
                        )}
                      </div>
                      <div className="persona-card-role-sub">
                        {persona.role} {persona.category ? `• ${persona.category}` : ""}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="persona-card-remove-btn"
                    onClick={(e) => handleDetach(persona.id, e)}
                    title={`Detach ${persona.name}`}
                  >
                    <XCloseIcon width={14} height={14} />
                  </button>
                </div>

                {/* 2-Column Callout Grid: Key Pain Point & Primary Motivation */}
                <div className="persona-callout-grid">
                  <div className="persona-callout-box pain-box">
                    <span className="callout-box-title pain-title">KEY PAIN POINT:</span>
                    <p className="callout-box-content">{painPoint}</p>
                  </div>

                  <div className="persona-callout-box mot-box">
                    <span className="callout-box-title mot-title">PRIMARY MOTIVATION:</span>
                    <p className="callout-box-content">{motivation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
