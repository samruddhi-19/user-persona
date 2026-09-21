import React, { useState, useEffect } from "react";
import {
  XCloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../lib/icons.jsx";
import { SAMPLE_PERSONAS } from "../personas/PersonasApp.jsx";
import "./card-section.css";

export default function CardSectionApp({ t }) {
  const [boardPersonas, setBoardPersonas] = useState([]);
  const [attachedIds, setAttachedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track collapsed state per persona: { [personaId]: boolean }
  const [collapsedMap, setCollapsedMap] = useState({});

  async function loadData() {
    try {
      let bPersonas = await t.get("board", "shared", "personas");
      if (!bPersonas || !Array.isArray(bPersonas) || bPersonas.length === 0) {
        bPersonas = SAMPLE_PERSONAS;
      }

      let cardAttached = await t.get("card", "shared", "attachedPersonaIds");
      if (!cardAttached || !Array.isArray(cardAttached)) {
        cardAttached = [];
      } else {
        // Sanitize: automatically purge any stale or non-existent IDs from card storage
        const cleaned = cardAttached.filter((id) => bPersonas.some((p) => p.id === id));
        if (cleaned.length !== cardAttached.length) {
          cardAttached = cleaned;
          await t.set("card", "shared", "attachedPersonaIds", cleaned);
          localStorage.setItem("trello_card_shared_attachedPersonaIds", JSON.stringify(cleaned));
        }
      }

      setBoardPersonas(bPersonas);
      setAttachedIds(cardAttached);

      try {
        const card = await t.card("id");
        if (card && card.id) {
          const boardMap = (await t.get("board", "shared", "cardPersonaAttachments")) || {};
          if (JSON.stringify(boardMap[card.id]) !== JSON.stringify(cardAttached)) {
            boardMap[card.id] = cardAttached;
            await t.set("board", "shared", "cardPersonaAttachments", boardMap);
          }
        }
      } catch (e) {}
    } catch (err) {
      console.error("Error loading card section data:", err);
      setBoardPersonas(SAMPLE_PERSONAS);
      setAttachedIds([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    const handleAttachmentChanged = (e) => {
      if (e?.detail?.attachedPersonaIds) {
        setAttachedIds(e.detail.attachedPersonaIds);
      } else {
        loadData();
      }
    };

    const handleStorage = (e) => {
      if (
        e.key === "trello_card_shared_attachedPersonaIds" ||
        e.key === "trello_board_shared_personas"
      ) {
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

  // Dynamic iframe auto-resize whenever attached personas or dropdown collapse states change
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      const timer = setTimeout(() => {
        t.sizeTo("#root");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [attachedIds, boardPersonas, collapsedMap]);

  function togglePersonaDropdown(personaId) {
    setCollapsedMap((prev) => ({
      ...prev,
      [personaId]: !prev[personaId],
    }));
  }

  function toggleAllDropdowns() {
    const allAreCollapsed = attachedPersonas.every((p) => collapsedMap[p.id]);
    if (allAreCollapsed) {
      // Expand all
      setCollapsedMap({});
    } else {
      // Collapse all
      const nextCollapsed = {};
      attachedPersonas.forEach((p) => {
        nextCollapsed[p.id] = true;
      });
      setCollapsedMap(nextCollapsed);
    }
  }

  async function handleDetach(personaId, e) {
    if (e) e.stopPropagation();
    const nextAttached = attachedIds.filter((id) => id !== personaId);
    setAttachedIds(nextAttached);
    try {
      await t.set("card", "shared", "attachedPersonaIds", nextAttached);
      localStorage.setItem("trello_card_shared_attachedPersonaIds", JSON.stringify(nextAttached));

      try {
        const card = await t.card("id");
        if (card && card.id) {
          const boardMap = (await t.get("board", "shared", "cardPersonaAttachments")) || {};
          boardMap[card.id] = nextAttached;
          await t.set("board", "shared", "cardPersonaAttachments", boardMap);
        }
      } catch (e) {}
    } catch (err) {
      console.error("Failed to detach persona:", err);
    }
  }

  // Resolve attached personas
  const attachedPersonas = attachedIds
    .map((id) => boardPersonas.find((p) => p.id === id))
    .filter(Boolean);

  const allCollapsed =
    attachedPersonas.length > 0 &&
    attachedPersonas.every((p) => collapsedMap[p.id]);

  if (loading) {
    return (
      <div className="card-section-wrapper" id="root">
        <div style={{ color: "var(--ads-text-subtle)", fontSize: "12.5px" }}>Loading personas...</div>
      </div>
    );
  }

  return (
    <div className="card-section-wrapper" id="root">
      {/* Empty State */}
      {attachedPersonas.length === 0 ? (
        <div className="card-section-empty">
          <p className="card-section-empty-text">
            No target personas attached yet. Click <b>+ Add Persona</b> above to connect user empathy to this card.
          </p>
        </div>
      ) : (
        <div className="attached-personas-container">
          {/* Section Toolbar: Count badge & Collapse all / Expand all button */}
          <div className="card-section-toolbar">
            <div className="section-toolbar-left">
              <span className="section-count-pill">
                {attachedPersonas.length} {attachedPersonas.length === 1 ? "Persona" : "Personas"} Attached
              </span>
            </div>

            <div className="section-toolbar-right">
              <button
                type="button"
                className="section-tool-btn"
                onClick={toggleAllDropdowns}
                title={allCollapsed ? "Expand all persona empathy cards" : "Collapse all persona empathy cards to save space"}
              >
                {allCollapsed ? "Expand all" : "Collapse all"}
              </button>
            </div>
          </div>

          {/* Persona Cards List with Dropdown Accordions */}
          <div className="attached-personas-list">
            {attachedPersonas.map((persona) => {
              const isCollapsed = !!collapsedMap[persona.id];
              const painPoint =
                (persona.painPoints && persona.painPoints[0]) ||
                "Disconnected user feedback scattered across tools";
              const motivation =
                (persona.motivations && persona.motivations[0]) ||
                "Advocating for the end-user throughout every ticket";

              return (
                <div
                  key={persona.id}
                  className={`attached-persona-card ${isCollapsed ? "is-collapsed" : ""}`}
                >
                  {/* Header Row: click to toggle dropdown accordion */}
                  <div
                    className="persona-card-top-row"
                    onClick={() => togglePersonaDropdown(persona.id)}
                    title={isCollapsed ? "Click to expand empathy details" : "Click to collapse card"}
                  >
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

                    <div className="persona-card-actions-right">
                      <button
                        type="button"
                        className="persona-card-chevron-btn"
                        aria-label={isCollapsed ? "Expand details" : "Collapse details"}
                      >
                        {isCollapsed ? (
                          <ChevronDownIcon width={16} height={16} />
                        ) : (
                          <ChevronUpIcon width={16} height={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        className="persona-card-remove-btn"
                        onClick={(e) => handleDetach(persona.id, e)}
                        title={`Detach ${persona.name}`}
                        aria-label={`Detach ${persona.name}`}
                      >
                        <XCloseIcon width={14} height={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Content: Empathy Callouts (hidden when collapsed) */}
                  {!isCollapsed && (
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
