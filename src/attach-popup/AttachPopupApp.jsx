import React, { useState, useEffect } from "react";
import { SearchIcon, CheckIcon, XCloseIcon } from "../lib/icons.jsx";
import { SAMPLE_PERSONAS } from "../personas/PersonasApp.jsx";
import "./attach-popup.css";

export default function AttachPopupApp({ t }) {
  const [personas, setPersonas] = useState([]);
  const [attachedIds, setAttachedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        let boardPersonas = await t.get("board", "shared", "personas");
        if (!boardPersonas || !Array.isArray(boardPersonas) || boardPersonas.length === 0) {
          boardPersonas = SAMPLE_PERSONAS;
        }

        let cardAttached = await t.get("card", "shared", "attachedPersonaIds");
        if (!cardAttached || !Array.isArray(cardAttached)) {
          cardAttached = [];
        }

        setPersonas(boardPersonas);
        setAttachedIds(cardAttached);
      } catch (err) {
        console.error("Error loading attach popup data:", err);
        setPersonas(SAMPLE_PERSONAS);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [t]);

  useEffect(() => {
    if (t && typeof t.sizeTo === "function") {
      t.sizeTo("#root");
    }
  }, [personas, search]);

  async function toggleAttach(personaId) {
    const isAttached = attachedIds.includes(personaId);
    let nextAttached;
    if (isAttached) {
      nextAttached = attachedIds.filter((id) => id !== personaId);
    } else {
      nextAttached = [...attachedIds, personaId];
    }

    setAttachedIds(nextAttached);
    try {
      await t.set("card", "shared", "attachedPersonaIds", nextAttached);
      // Dispatch an event so any open card section or parent iframe updates immediately
      window.dispatchEvent(
        new CustomEvent("persona-attachment-changed", {
          detail: { attachedPersonaIds: nextAttached },
        })
      );
      localStorage.setItem("trello_card_shared_attachedPersonaIds", JSON.stringify(nextAttached));
    } catch (err) {
      console.error("Failed to update attached personas:", err);
    }
  }

  const filtered = personas.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.role && p.role.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="attach-popup-container" id="root">
      <div className="attach-popup-header">
        <h3 className="attach-popup-title">Attach Personas</h3>
        <button
          type="button"
          className="attach-popup-close-btn"
          onClick={() => t.closePopup && t.closePopup()}
          title="Close"
        >
          <XCloseIcon width={14} height={14} />
        </button>
      </div>

      <div className="attach-popup-search-box">
        <span className="attach-popup-search-icon">
          <SearchIcon width={14} height={14} />
        </span>
        <input
          type="text"
          className="attach-popup-search-input"
          placeholder="Search personas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="attach-popup-list">
        {loading ? (
          <div className="attach-popup-empty">Loading personas...</div>
        ) : filtered.length === 0 ? (
          <div className="attach-popup-empty">
            {search ? `No personas matching "${search}"` : "No personas on board"}
          </div>
        ) : (
          filtered.map((persona) => {
            const isChecked = attachedIds.includes(persona.id);
            return (
              <div
                key={persona.id}
                className={`attach-popup-item ${isChecked ? "selected" : ""}`}
                onClick={() => toggleAttach(persona.id)}
              >
                <div className="attach-popup-item-left">
                  <img
                    src={persona.avatar || "./avatars/avatar-3.png"}
                    alt={persona.name}
                    className="attach-popup-avatar"
                  />
                  <div className="attach-popup-info">
                    <div className="attach-popup-name">{persona.name}</div>
                    <div className="attach-popup-role">{persona.role}</div>
                  </div>
                </div>

                <div className={`attach-popup-checkbox ${isChecked ? "checked" : ""}`}>
                  {isChecked && <CheckIcon width={12} height={12} strokeWidth={3} />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
