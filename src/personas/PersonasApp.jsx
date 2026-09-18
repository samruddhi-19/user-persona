import React, { useState, useEffect, useMemo } from "react";
import {
  SearchIcon,
  PlusIcon,
  SparklesIcon,
  EditPencilIcon,
  TrashIcon,
  CardsStackIcon,
  XCloseIcon,
  EmptyPersonaIllustration,
  CheckIcon,
  MailIcon,
  PinIcon,
} from "../lib/icons.jsx";
import "./personas.css";

// The reference sample personas matching the user's design screenshot
export const SAMPLE_PERSONAS = [
  {
    id: "persona-maya-lin",
    name: "Maya Lin",
    role: "Senior Product Designer",
    age: 31,
    category: "Core Designer",
    avatar: "./avatars/maya.jpg",
    quote: '"If engineering doesn\'t know who they are building for, the feature is already at risk."',
    painPoints: [
      "Disconnected user feedback scattered across Jira, Slack, and emails",
      "Features getting built without clear user empathy or target audience context",
      "Lack of quick persona visibility inside day-to-day sprint cards",
      "Misalignment between UX wireframes and delivered engineering releases",
    ],
    motivations: [
      "Advocating for the end-user throughout every engineering ticket",
      "Streamlining cross-functional handoffs with clear persona anchors",
      "Validating design iterations with quantitative survey evidence",
      "Fostering shared customer understanding across product and dev teams",
    ],
    attachedCardsCount: 3,
    attachedMembers: ["CCO", "JD", "ML"],
  },
  {
    id: "persona-marcus-vance",
    name: "Marcus Vance",
    role: "Engineering Team Lead",
    age: 42,
    category: "Technical Leader",
    avatar: "./avatars/marcus.jpg",
    quote: '"Clear context in the card means fewer meetings and faster commits."',
    painPoints: [
      "Vague user stories with no indication of why a feature matters to users",
      "Scope creep caused by shifting requirements mid-sprint",
      "Complex tool switching between analytics dashboards and ticket boards",
      "Late-stage rework due to ambiguous acceptance criteria",
    ],
    motivations: [
      "Shipping clean, maintainable architecture on predictable timelines",
      "Empowering engineers with high-context task descriptions",
      "Eliminating ambiguity in bug tickets and user story cards",
      "Reducing sync meetings through self-documenting agile workflows",
    ],
    attachedCardsCount: 2,
    attachedMembers: ["CO", "MV"],
  },
  {
    id: "persona-chloe-nguyen",
    name: "Chloe Nguyen",
    role: "Growth Marketer & Customer Success",
    age: 26,
    category: "Growth & CS",
    avatar: "./avatars/chloe.jpg",
    quote: '"Customers don\'t churn because of missing code, they churn because of unresolved friction."',
    painPoints: [
      "User frustration with slow onboarding and hidden settings",
      "Difficulty relaying customer churn feedback directly to dev cards",
      "Time-consuming data consolidation from survey spreadsheets",
      "Slow turnaround on small usability bug fixes impacting retention",
    ],
    motivations: [
      "Boosting retention through delightfully intuitive user experiences",
      "Championing customer survey insights into actionable board items",
      "Tracking user engagement uplift from newly released features",
      "Bridging marketing campaign expectations with core product flows",
    ],
    attachedCardsCount: 2,
    attachedMembers: ["CO", "CN"],
  },
];

const AI_TEMPLATES = [
  {
    role: "Senior Product Designer",
    name: "Maya Lin",
    age: 31,
    category: "Core Designer",
    avatar: "./avatars/maya.jpg",
    quote: '"If engineering doesn\'t know who they are building for, the feature is already at risk."',
    painPoints: [
      "Disconnected user feedback scattered across Jira, Slack, and emails",
      "Features getting built without clear user empathy or target audience context",
      "Lack of quick persona visibility inside day-to-day sprint cards",
      "Misalignment between UX wireframes and engineering delivery",
    ],
    motivations: [
      "Advocating for the end-user throughout every engineering ticket",
      "Streamlining cross-functional handoffs with clear persona anchors",
      "Validating design iterations with quantitative survey evidence",
      "Fostering shared customer understanding across squads",
    ],
  },
  {
    role: "Engineering Team Lead",
    name: "Marcus Vance",
    age: 42,
    category: "Technical Leader",
    avatar: "./avatars/marcus.jpg",
    quote: '"Clear context in the card means fewer meetings and faster commits."',
    painPoints: [
      "Vague user stories with no indication of why a feature matters to users",
      "Scope creep caused by shifting requirements mid-sprint",
      "Complex tool switching between analytics dashboards and ticket boards",
      "Late-stage rework due to ambiguous acceptance criteria",
    ],
    motivations: [
      "Shipping clean, maintainable architecture on predictable timelines",
      "Empowering engineers with high-context task descriptions",
      "Eliminating ambiguity in bug tickets and user story cards",
      "Reducing sync meetings through self-documenting agile workflows",
    ],
  },
  {
    role: "Growth Marketer & CS",
    name: "Chloe Nguyen",
    age: 26,
    category: "Growth & CS",
    avatar: "./avatars/chloe.jpg",
    quote: '"Customers don\'t churn because of missing code, they churn because of unresolved friction."',
    painPoints: [
      "User frustration with slow onboarding and hidden settings",
      "Difficulty relaying customer churn feedback directly to dev cards",
      "Time-consuming data consolidation from survey spreadsheets",
      "Slow turnaround on small usability bug fixes impacting retention",
    ],
    motivations: [
      "Boosting retention through delightfully intuitive user experiences",
      "Championing customer survey insights into actionable board items",
      "Tracking user engagement uplift from newly released features",
      "Bridging marketing campaign expectations with core product flows",
    ],
  },
  {
    role: "Enterprise IT Administrator",
    name: "David Kim",
    age: 38,
    category: "Security & Ops",
    avatar: "",
    quote: '"Compliance and permission governance can never be an afterthought."',
    painPoints: [
      "Lack of granular role-based permissions and audit logs",
      "Tedious manual provisioning and deprovisioning of seats",
      "Opaque data residency and third-party security integration",
    ],
    motivations: [
      "Zero-downtime integrations with enterprise SSO providers",
      "Centralized oversight of all workspace board activities",
      "Enforcing strict data compliance without hindering developer velocity",
    ],
  },
];

export default function PersonasApp({ t }) {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPains, setExpandedPains] = useState({});
  const [expandedMots, setExpandedMots] = useState({});
  const [activePersonaId, setActivePersonaId] = useState("persona-marcus-vance");
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSelectedTemplate, setAiSelectedTemplate] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    age: 28,
    category: "",
    avatar: "",
    quote: "",
    painPoints: [],
    motivations: [],
  });
  const [newPainInput, setNewPainInput] = useState("");
  const [newMotInput, setNewMotInput] = useState("");

  // Load personas from Trello board shared storage
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (t && typeof t.get === "function") {
          const stored = await t.get("board", "shared", "personas");
          if (stored && Array.isArray(stored)) {
            setPersonas(stored);
          } else {
            // Initially, there are NO personas on the board
            setPersonas([]);
          }
        } else {
          // Local fallback: read localStorage
          const local = localStorage.getItem("trello_board_shared_personas");
          if (local) {
            setPersonas(JSON.parse(local));
          } else {
            setPersonas([]);
          }
        }
      } catch (err) {
        console.error("Failed to load personas:", err);
        setPersonas([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [t]);

  // Persist personas to Trello board storage
  async function persistPersonas(updatedList) {
    setPersonas(updatedList);
    try {
      if (t && typeof t.set === "function") {
        await t.set("board", "shared", "personas", updatedList);
      } else {
        localStorage.setItem("trello_board_shared_personas", JSON.stringify(updatedList));
      }
    } catch (err) {
      console.error("Failed to persist personas:", err);
    }
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // Toggle expand / collapse for pain points & motivations
  function togglePain(id) {
    setExpandedPains((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleMot(id) {
    setExpandedMots((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Open Create Form
  function openCreateModal() {
    setEditingPersona(null);
    setFormData({
      name: "",
      role: "",
      age: 29,
      category: "Target User",
      avatar: "",
      quote: "",
      painPoints: ["Difficulty navigating complex workflows"],
      motivations: ["Faster completion of core tasks"],
    });
    setNewPainInput("");
    setNewMotInput("");
    setIsFormOpen(true);
  }

  // Open Edit Form
  function openEditModal(persona) {
    setEditingPersona(persona);
    setFormData({
      name: persona.name,
      role: persona.role,
      age: persona.age || 30,
      category: persona.category || "Target User",
      avatar: persona.avatar || "",
      quote: persona.quote || "",
      painPoints: [...(persona.painPoints || [])],
      motivations: [...(persona.motivations || [])],
    });
    setNewPainInput("");
    setNewMotInput("");
    setIsFormOpen(true);
  }

  // Save Persona (Create or Update)
  async function handleSavePersona(e) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingPersona) {
      const updated = personas.map((p) =>
        p.id === editingPersona.id
          ? {
              ...p,
              ...formData,
              quote: formData.quote.trim().startsWith('"')
                ? formData.quote.trim()
                : `"${formData.quote.trim()}"`,
            }
          : p
      );
      await persistPersonas(updated);
      showToast(`Updated "${formData.name}"`);
    } else {
      const newPersona = {
        id: `persona-${Date.now()}`,
        ...formData,
        quote: formData.quote.trim()
          ? formData.quote.trim().startsWith('"')
            ? formData.quote.trim()
            : `"${formData.quote.trim()}"`
          : '"Designing with empathy creates lasting product value."',
        attachedCardsCount: 0,
        attachedMembers: [],
      };
      await persistPersonas([...personas, newPersona]);
      showToast(`Created persona "${formData.name}"`);
    }
    setIsFormOpen(false);
  }

  // Delete Persona
  async function handleDeletePersona(persona) {
    if (window.confirm(`Are you sure you want to delete "${persona.name}"?`)) {
      const updated = personas.filter((p) => p.id !== persona.id);
      await persistPersonas(updated);
      showToast(`Deleted "${persona.name}"`);
    }
  }

  // Load Demo Personas (Maya Lin, Marcus Vance, Chloe Nguyen)
  async function handleLoadDemoPersonas() {
    await persistPersonas(SAMPLE_PERSONAS);
    showToast("Loaded sample personas from screenshot!");
  }

  // Clear all personas (to test empty state)
  async function handleClearAll() {
    if (window.confirm("Clear all personas to test the initial empty state?")) {
      await persistPersonas([]);
      showToast("Cleared all personas — initial state active.");
    }
  }

  // Add tag helpers in form
  function handleAddPain() {
    if (newPainInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        painPoints: [...prev.painPoints, newPainInput.trim()],
      }));
      setNewPainInput("");
    }
  }

  function handleRemovePain(idx) {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== idx),
    }));
  }

  function handleAddMot() {
    if (newMotInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        motivations: [...prev.motivations, newMotInput.trim()],
      }));
      setNewMotInput("");
    }
  }

  function handleRemoveMot(idx) {
    setFormData((prev) => ({
      ...prev,
      motivations: prev.motivations.filter((_, i) => i !== idx),
    }));
  }

  // Draft with AI submission
  async function handleGenerateAiPersona() {
    setIsAiGenerating(true);
    setTimeout(async () => {
      let selected = AI_TEMPLATES[aiSelectedTemplate];
      if (aiPrompt.trim()) {
        // Custom prompt generation
        selected = {
          role: aiPrompt.trim(),
          name: "Alex Rivera",
          age: 33,
          category: "Key Persona",
          avatar: "./avatars/chloe.jpg",
          quote: `"Streamlined workflows for ${aiPrompt.trim()} unlock maximum productivity."`,
          painPoints: [
            `Frustration with repetitive tasks in ${aiPrompt.trim()} workflows`,
            "Lack of visibility into real-time sprint blockers",
            "Slow communication between teams",
          ],
          motivations: [
            `Optimizing delivery metrics for ${aiPrompt.trim()}`,
            "Fostering collaboration with actionable board cards",
            "Continuous user feedback validation",
          ],
        };
      }

      const newAiPersona = {
        id: `persona-ai-${Date.now()}`,
        name: selected.name,
        role: selected.role,
        age: selected.age,
        category: selected.category,
        avatar: selected.avatar,
        quote: selected.quote,
        painPoints: selected.painPoints,
        motivations: selected.motivations,
        attachedCardsCount: 1,
        attachedMembers: ["AI"],
      };

      await persistPersonas([...personas, newAiPersona]);
      setIsAiGenerating(false);
      setIsAiModalOpen(false);
      setAiPrompt("");
      showToast(`AI drafted persona "${newAiPersona.name}"!`);
    }, 600);
  }

  // Filtered personas
  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) return personas;
    const q = searchQuery.toLowerCase();
    return personas.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.painPoints && p.painPoints.some((item) => item.toLowerCase().includes(q))) ||
        (p.motivations && p.motivations.some((item) => item.toLowerCase().includes(q)))
    );
  }, [personas, searchQuery]);

  return (
    <div className="personas-app">
      {/* Top Header & Search Toolbar */}
      <header className="personas-header">
        <div className="personas-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <SearchIcon width={16} height={16} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search personas by name, role, pain points, or motivations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="btn-add-persona"
              onClick={openCreateModal}
              title="Create a new user persona"
            >
              <PlusIcon width={16} height={16} />
              <span>Add Persona</span>
            </button>

            <button
              type="button"
              className="btn-draft-ai"
              onClick={() => setIsAiModalOpen(true)}
              title="Draft persona with AI generator"
            >
              <SparklesIcon width={16} height={16} />
              <span>Draft with AI</span>
            </button>

            {personas.length > 0 ? (
              <button
                type="button"
                className="btn-subtle-icon"
                onClick={handleClearAll}
                title="Reset to initial empty state"
              >
                <TrashIcon width={16} height={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-subtle-icon"
                onClick={handleLoadDemoPersonas}
                title="Load sample personas"
              >
                <SparklesIcon width={16} height={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="personas-main">
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#626F86" }}>
            <p>Loading board personas…</p>
          </div>
        ) : personas.length === 0 ? (
          /* ==========================================================================
             INITIAL EMPTY STATE: Shown when no personas exist yet
             ========================================================================== */
          <div className="personas-empty-state">
            <div className="empty-state-graphic">
              <EmptyPersonaIllustration width={130} height={130} />
            </div>
            <h2 className="empty-state-title">No User Personas Yet</h2>
            <p className="empty-state-desc">
              Bring your real users into your sprint board. Create personas to document who
              you are building for, highlight critical pain points, and attach personas
              directly to user stories and cards.
            </p>

            <div className="empty-state-actions">
              <button
                type="button"
                className="btn-add-persona"
                style={{ padding: "10px 22px", fontSize: "14px" }}
                onClick={openCreateModal}
              >
                <PlusIcon width={18} height={18} />
                <span>Create First Persona</span>
              </button>

              <button
                type="button"
                className="btn-draft-ai"
                style={{ padding: "10px 22px", fontSize: "14px" }}
                onClick={() => setIsAiModalOpen(true)}
              >
                <SparklesIcon width={18} height={18} />
                <span>Draft with AI</span>
              </button>

              <button
                type="button"
                className="btn-load-demo"
                onClick={handleLoadDemoPersonas}
              >
                Load Demo Personas
              </button>
            </div>

            {/* Feature overview cards */}
            <div className="empty-features-grid">
              <div className="empty-feature-item">
                <h4 className="empty-feature-title">
                  <span style={{ color: "#0C66E4" }}>●</span> Customer Empathy
                </h4>
                <p className="empty-feature-text">
                  Keep design and engineering teams united on real user goals throughout every sprint.
                </p>
              </div>

              <div className="empty-feature-item">
                <h4 className="empty-feature-title">
                  <span style={{ color: "#DE350B" }}>●</span> Pain Points & Motivations
                </h4>
                <p className="empty-feature-text">
                  Clearly document friction areas and what drives your users to choose your solution.
                </p>
              </div>

              <div className="empty-feature-item">
                <h4 className="empty-feature-title">
                  <span style={{ color: "#22A06B" }}>●</span> Card Badge Integration
                </h4>
                <p className="empty-feature-text">
                  Attach personas to cards with glanceable front badges and back-of-card detail sections.
                </p>
              </div>
            </div>
          </div>
        ) : filteredPersonas.length === 0 ? (
          /* Search yielded no matches */
          <div style={{ textAlign: "center", padding: "60px 0", color: "#626F86" }}>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#172B4D" }}>
              No personas matched "{searchQuery}"
            </p>
            <p style={{ fontSize: "13px" }}>Try searching by name, role, or motivation keywords.</p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: "12px" }}
              onClick={() => setSearchQuery("")}
            >
              Clear search filter
            </button>
          </div>
        ) : (
          /* ==========================================================================
             PERSONA CARDS GRID (Matches Reference Screenshot Pixel-by-Pixel)
             ========================================================================== */
          <div className="personas-grid">
            {filteredPersonas.map((persona) => {
              const painList = persona.painPoints || [];
              const motList = persona.motivations || [];
              const isPainExpanded = Boolean(expandedPains[persona.id]);
              const isMotExpanded = Boolean(expandedMots[persona.id]);

              const visiblePains = isPainExpanded ? painList : painList.slice(0, 3);
              const remainingPains = painList.length - 3;

              const visibleMots = isMotExpanded ? motList : motList.slice(0, 3);
              const remainingMots = motList.length - 3;

              return (
                <article
                  className={`persona-card ${
                    activePersonaId === persona.id ? "active-card" : ""
                  }`}
                  key={persona.id}
                  onClick={() => setActivePersonaId(persona.id)}
                >
                  {/* Card Header Profile */}
                  <div className="persona-card-top">
                    <div className="persona-avatar-wrapper">
                      {persona.avatar ? (
                        <img
                          src={persona.avatar}
                          alt={persona.name}
                          className="persona-avatar-img"
                          onError={(e) => {
                            // Fallback if image path fails
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="persona-avatar-fallback"
                        style={{ display: persona.avatar ? "none" : "flex" }}
                      >
                        {persona.name.charAt(0)}
                      </div>
                    </div>

                    <div className="persona-card-meta">
                      <div className="persona-name-row">
                        <h3 className="persona-name" title={persona.name}>
                          {persona.name}
                        </h3>
                        <div className="persona-card-actions">
                          <button
                            type="button"
                            className="card-action-btn"
                            title="Edit Persona"
                            onClick={() => openEditModal(persona)}
                          >
                            <EditPencilIcon width={14} height={14} />
                          </button>
                          <button
                            type="button"
                            className="card-action-btn delete-btn"
                            title="Delete Persona"
                            onClick={() => handleDeletePersona(persona)}
                          >
                            <TrashIcon width={14} height={14} />
                          </button>
                        </div>
                      </div>

                      <div className="persona-role-title" title={persona.role}>
                        {persona.role}
                      </div>

                      <div className="persona-badges-row">
                        <span className="badge-age">
                          <span className="badge-age-label">Age</span>
                          <span>{persona.age || 30}</span>
                        </span>
                        {persona.category && (
                          <span className="badge-category">{persona.category}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Highlight Quote Box */}
                  {persona.quote && (
                    <div className="persona-quote-box">{persona.quote}</div>
                  )}

                  {/* PAIN POINTS Section */}
                  <div className="section-header">
                    <span className="section-dot pain-dot"></span>
                    <h4 className="section-title pain-title">
                      PAIN POINTS ({painList.length})
                    </h4>
                  </div>

                  <div className="points-list">
                    {visiblePains.map((pt, idx) => (
                      <div key={idx} className="point-pill pain-pill">
                        {pt}
                      </div>
                    ))}
                  </div>

                  {remainingPains > 0 && (
                    <button
                      type="button"
                      className="btn-toggle-more"
                      onClick={() => togglePain(persona.id)}
                    >
                      {isPainExpanded
                        ? "Show fewer pain points"
                        : `+${remainingPains} more pain points`}
                    </button>
                  )}

                  {/* MOTIVATIONS Section */}
                  <div className="section-header" style={{ marginTop: "14px" }}>
                    <span className="section-dot mot-dot"></span>
                    <h4 className="section-title mot-title">
                      MOTIVATIONS ({motList.length})
                    </h4>
                  </div>

                  <div className="points-list">
                    {visibleMots.map((mot, idx) => (
                      <div key={idx} className="point-pill mot-pill">
                        {mot}
                      </div>
                    ))}
                  </div>

                  {remainingMots > 0 && (
                    <button
                      type="button"
                      className="btn-toggle-more"
                      onClick={() => toggleMot(persona.id)}
                    >
                      {isMotExpanded
                        ? "Show fewer motivations"
                        : `+${remainingMots} more motivations`}
                    </button>
                  )}

                  {/* Footer: Attached Cards count & card avatars */}
                  <div className="persona-card-footer">
                    <div className="attached-cards-badge">
                      <CardsStackIcon width={16} height={16} />
                      <span>
                        Attached to {persona.attachedCardsCount || 0} Cards
                      </span>
                    </div>

                    <div className="attached-avatars-group">
                      {(persona.attachedMembers || ["CO", "JD"]).map((initials, i) => (
                        <div key={i} className="attached-avatar-circle" title="Active card link">
                          {initials}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ==========================================================================
         Add / Edit Persona Modal
         ========================================================================== */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3 className="modal-title">
                  {editingPersona ? "Edit Persona" : "Create New Persona"}
                </h3>
              </div>
              <button
                type="button"
                className="btn-subtle-icon"
                onClick={() => setIsFormOpen(false)}
              >
                <XCloseIcon width={16} height={16} />
              </button>
            </div>

            <form onSubmit={handleSavePersona}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Maya Lin"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role / Job Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior Product Designer"
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category / Role Tag</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Core Designer, Tech Lead"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      min="16"
                      max="99"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: parseInt(e.target.value, 10) || 30,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Key Quote / Core Statement</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. If engineering does not know who they are building for, the feature is at risk."
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                  />
                </div>

                {/* Pain points list manager */}
                <div className="form-group">
                  <label className="form-label">
                    Pain Points ({formData.painPoints.length})
                  </label>
                  <div className="tag-input-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add a user pain point..."
                      value={newPainInput}
                      onChange={(e) => setNewPainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPain();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleAddPain}
                    >
                      Add
                    </button>
                  </div>
                  <div className="items-tag-list">
                    {formData.painPoints.map((pt, idx) => (
                      <div key={idx} className="item-tag-row pain-tag">
                        <span>{pt}</span>
                        <button
                          type="button"
                          className="btn-remove-tag"
                          onClick={() => handleRemovePain(idx)}
                        >
                          <XCloseIcon width={14} height={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motivations list manager */}
                <div className="form-group">
                  <label className="form-label">
                    Motivations ({formData.motivations.length})
                  </label>
                  <div className="tag-input-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add a user motivation..."
                      value={newMotInput}
                      onChange={(e) => setNewMotInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMot();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleAddMot}
                    >
                      Add
                    </button>
                  </div>
                  <div className="items-tag-list">
                    {formData.motivations.map((mot, idx) => (
                      <div key={idx} className="item-tag-row mot-tag">
                        <span>{mot}</span>
                        <button
                          type="button"
                          className="btn-remove-tag"
                          onClick={() => handleRemoveMot(idx)}
                        >
                          <XCloseIcon width={14} height={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPersona ? "Save Changes" : "Create Persona"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
         Draft with AI Modal
         ========================================================================== */}
      {isAiModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAiModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <SparklesIcon width={20} height={20} style={{ color: "#0C66E4" }} />
                <h3 className="modal-title">Draft Persona with AI</h3>
              </div>
              <button
                type="button"
                className="btn-subtle-icon"
                onClick={() => setIsAiModalOpen(false)}
              >
                <XCloseIcon width={16} height={16} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: "13px", color: "#626F86", marginTop: 0 }}>
                Select an agile product archetype or enter a custom prompt to synthesize
                a complete persona profile with motivations, pain points, and quote.
              </p>

              <div className="form-group">
                <label className="form-label">Choose Archetype</label>
                <div className="ai-template-grid">
                  {AI_TEMPLATES.map((tmpl, idx) => (
                    <div
                      key={idx}
                      className={`ai-template-card ${
                        aiSelectedTemplate === idx ? "active" : ""
                      }`}
                      onClick={() => setAiSelectedTemplate(idx)}
                    >
                      <div className="ai-template-name">{tmpl.name}</div>
                      <div className="ai-template-desc">{tmpl.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Or Custom Role / Audience</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Freelance Graphic Designer, Medical Clinic Manager..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsAiModalOpen(false)}
                disabled={isAiGenerating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-draft-ai"
                onClick={handleGenerateAiPersona}
                disabled={isAiGenerating}
              >
                <SparklesIcon width={16} height={16} />
                <span>{isAiGenerating ? "Synthesizing Persona…" : "Generate & Add Persona"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cardlytics-style Explified Footer */}
      <footer className="explified-footer">
        <div className="explified-footer-left">
          <PinIcon width={14} height={14} style={{ color: "#F87168" }} />
          <span>
            Tracking to <a href="#" onClick={(e) => e.preventDefault()}>User Personaa</a>
          </span>
        </div>
        <div className="explified-support-box">
          <MailIcon width={14} height={14} />
          <span>
            Reach out to us <a href="mailto:support@explified.com">support@explified.com</a>
          </span>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="personas-toast">
          <CheckIcon width={16} height={16} style={{ color: "#4BCE97" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
