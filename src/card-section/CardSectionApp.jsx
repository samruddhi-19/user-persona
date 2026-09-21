import React, { useState, useEffect } from "react";
import {
  UserPersonaIcon,
  XCloseIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CompactViewIcon,
  DetailedViewIcon,
} from "../lib/icons.jsx";
import { SAMPLE_PERSONAS } from "../personas/PersonasApp.jsx";
import "./card-section.css";

export default function CardSectionApp({ t }) {
  const [boardPersonas, setBoardPersonas] = useState([]);
  const [attachedIds, setAttachedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // View density mode: "detailed" | "compact"
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("user_personaa_view_mode") || "detailed";
    } catch {
      return "detailed";
    }
  });

  // Collapsed state tracking
  const [detailedCollapsed, setDetailedCollapsed] = useState({});
  const [compactExpanded, setCompactExpanded] = useState({});

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

  // Dynamic iframe auto-resize when attached cards, view mode, or accordion states change
  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      const timer = setTimeout(() => {
        t.sizeTo("#root");
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [attachedIds, boardPersonas, viewMode, detailedCollapsed, compactExpanded]);

  function handleSetViewMode(mode) {
    setViewMode(mode);
    try {
      localStorage.setItem("user_personaa_view_mode", mode);
    } catch (err) {
      console.error("Failed to persist view mode preference:", err);
    }
  }

  function toggleDetailedPersona(personaId) {
    setDetailedCollapsed((prev) => ({
      ...prev,
      [personaId]: !prev[personaId],
    }));
  }

  function toggleCompactPersona(personaId) {
    setCompactExpanded((prev) => ({
      ...prev,
      [personaId]: !prev[personaId],
    }));
  }

  function toggleAllDetailed() {
    const allAreCollapsed = attachedPersonas.every((p) => detailedCollapsed[p.id]);
    if (allAreCollapsed) {
      // Expand all
      setDetailedCollapsed({});
    } else {
      // Collapse all
      const nextCollapsed = {};
      attachedPersonas.forEach((p) => {
        nextCollapsed[p.id] = true;
      });
      setDetailedCollapsed(nextCollapsed);
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

  const allDetailedCollapsed =
    attachedPersonas.length > 0 &&
    attachedPersonas.every((p) => detailedCollapsed[p.id]);

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
          {/* Section Toolbar: Density Toggle & Collapse All */}
          <div className="card-section-toolbar">
            <div className="section-toolbar-left">
              <span className="section-count-pill">
                {attachedPersonas.length} {attachedPersonas.length === 1 ? "Persona" : "Personas"}
              </span>
              {viewMode === "detailed" && attachedPersonas.length > 1 && (
                <button
                  type="button"
                  className="section-tool-btn"
                  onClick={toggleAllDetailed}
                  title={allDetailedCollapsed ? "Expand all persona cards" : "Collapse all persona cards"}
                >
                  {allDetailedCollapsed ? "Expand all" : "Collapse all"}
                </button>
              )}
            </div>

            {/* Density Selector */}
            <div className="view-mode-toggle" role="group" aria-label="Persona view mode">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "compact" ? "active" : ""}`}
                onClick={() => handleSetViewMode("compact")}
                title="Compact view (saves vertical card space)"
              >
                <CompactViewIcon width={12} height={12} />
                <span>Compact</span>
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "detailed" ? "active" : ""}`}
                onClick={() => handleSetViewMode("detailed")}
                title="Detailed empathy view with pain points & motivations"
              >
                <DetailedViewIcon width={12} height={12} />
                <span>Detailed</span>
              </button>
            </div>
          </div>

          {/* Cards List: Detailed View */}
          {viewMode === "detailed" ? (
            <div className="attached-personas-list detailed-list">
              {attachedPersonas.map((persona) => {
                const isCollapsed = !!detailedCollapsed[persona.id];
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
                    {/* Header Row: clickable to toggle accordion */}
                    <div
                      className="persona-card-top-row"
                      onClick={() => toggleDetailedPersona(persona.id)}
                      title={isCollapsed ? "Click to expand details" : "Click to collapse"}
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
                          aria-label={isCollapsed ? "Expand persona" : "Collapse persona"}
                        >
                          {isCollapsed ? (
                            <ChevronDownIcon width={15} height={15} />
                          ) : (
                            <ChevronUpIcon width={15} height={15} />
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

                    {/* Empathy Grid: conditionally collapsed */}
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
          ) : (
            /* Cards List: Compact View */
            <div className="attached-personas-list compact-list">
              {attachedPersonas.map((persona) => {
                const isExpanded = !!compactExpanded[persona.id];
                const painPoint =
                  (persona.painPoints && persona.painPoints[0]) ||
                  "Disconnected user feedback scattered across tools";
                const motivation =
                  (persona.motivations && persona.motivations[0]) ||
                  "Advocating for the end-user throughout every ticket";

                return (
                  <div
                    key={persona.id}
                    className={`compact-persona-item ${isExpanded ? "is-expanded" : ""}`}
                  >
                    <div
                      className="compact-persona-bar"
                      onClick={() => toggleCompactPersona(persona.id)}
                      title={isExpanded ? "Hide empathy details" : "Click to view empathy details"}
                    >
                      <div className="compact-persona-left">
                        <img
                          src={persona.avatar || "./avatars/avatar-3.png"}
                          alt={persona.name}
                          className="compact-avatar"
                        />
                        <div className="compact-info">
                          <div className="compact-title-row">
                            <span className="compact-name">{persona.name}</span>
                            {persona.age && (
                              <span className="compact-age-pill">Age {persona.age}</span>
                            )}
                          </div>
                          <span className="compact-role">
                            {persona.role}
                            {persona.category ? ` • ${persona.category}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Brief insight teaser (desktop / wide) */}
                      <div className="compact-snippet-teaser" title={painPoint}>
                        <span className="compact-snippet-tag">Pain:</span>
                        <span className="compact-snippet-text">{painPoint}</span>
                      </div>

                      <div className="compact-actions-right">
                        <button
                          type="button"
                          className="compact-chevron-btn"
                          aria-label={isExpanded ? "Hide details" : "Show details"}
                        >
                          {isExpanded ? (
                            <ChevronUpIcon width={14} height={14} />
                          ) : (
                            <ChevronDownIcon width={14} height={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          className="compact-remove-btn"
                          onClick={(e) => handleDetach(persona.id, e)}
                          title={`Detach ${persona.name}`}
                          aria-label={`Detach ${persona.name}`}
                        >
                          <XCloseIcon width={13} height={13} />
                        </button>
                      </div>
                    </div>

                    {/* Inline empathy expansion when opened in compact mode */}
                    {isExpanded && (
                      <div className="compact-expanded-details">
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
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
