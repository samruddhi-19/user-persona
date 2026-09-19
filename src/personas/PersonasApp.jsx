import React, { useState, useEffect, useMemo } from "react";
import {
  SearchIcon,
  ArrowLeftIcon,
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
  UserPersonaIcon,
  ImageIcon,
  FileSpreadsheetIcon,
} from "../lib/icons.jsx";
import "./personas.css";

// 10 Curated Competitor-Style Flat Vector Avatars with Long Shadow (Matching Design Spec)
export const FLAT_AVATARS_PACK = [
  { id: "flat-1", name: "Maya Lin (Amber / Ponytail)", url: "./avatars/avatar-3.png" },
  { id: "flat-2", name: "Marcus Vance (Salmon / Tech Lead)", url: "./avatars/avatar-2.png" },
  { id: "flat-3", name: "Chloe Chen (Teal / Glasses)", url: "./avatars/avatar-9.png" },
  { id: "flat-4", name: "Alex Rivera (Cyan / Beard & Glasses)", url: "./avatars/avatar-8.png" },
  { id: "flat-5", name: "Elena Rostova (Blue / Curly Hair)", url: "./avatars/avatar-12.png" },
  { id: "flat-6", name: "David Kim (Blue / Short Hair)", url: "./avatars/avatar-11.png" },
  { id: "flat-7", name: "Sarah Jenkins (Sky Blue / Bob)", url: "./avatars/avatar-5.png" },
  { id: "flat-8", name: "Jordan Lee (Purple / Blond Beard)", url: "./avatars/avatar-4.png" },
  { id: "flat-9", name: "Sophia Martinez (Mint / Bangs)", url: "./avatars/avatar-14.png" },
  { id: "flat-10", name: "Robert Vance (Slate / Suit)", url: "./avatars/avatar-16.png" },
];

export const PRESET_AVATARS = FLAT_AVATARS_PACK;
export const REAL_FACES_PACK = FLAT_AVATARS_PACK;

// The reference sample personas matching the user's design screenshot
export const SAMPLE_PERSONAS = [
  {
    id: "persona-maya-lin",
    name: "Maya Lin",
    role: "Senior Product Designer",
    age: 31,
    category: "Core Designer",
    avatar: PRESET_AVATARS[0].url,
    bio: "Senior UX architect balancing enterprise design systems with fast sprint cycles across cross-functional product squads.",
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
    goals: [
      "Deliver cohesive user flows that reduce onboarding churn by 25%",
      "Embed persona empathy directly into technical backlog planning",
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
    avatar: PRESET_AVATARS[1].url,
    bio: "Full-stack lead focusing on scalable microservices, CI/CD pipeline stability, and clean agile sprint execution.",
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
    goals: [
      "Maintain 99.9% sprint delivery accuracy with zero blocker ambiguities",
      "Reduce developer context-switching through self-contained Trello tickets",
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
    avatar: PRESET_AVATARS[2].url,
    bio: "Customer champion tracking retention funnels, user delight scores, and bridging qualitative support feedback to product roadmaps.",
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
    goals: [
      "Increase trial-to-paid conversion by fixing top 5 UI bottlenecks",
      "Unify survey feedback into weekly agile sprint prioritizations",
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
    avatar: PRESET_AVATARS[0].url,
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
    avatar: PRESET_AVATARS[1].url,
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
    avatar: PRESET_AVATARS[2].url,
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
  const [blueprintTemplateIdx, setBlueprintTemplateIdx] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [avatarStyleTab, setAvatarStyleTab] = useState("real");

  // Form fields matching the new persona fields modal
  const [formData, setFormData] = useState({
    name: "",
    age: 28,
    role: "",
    category: "Target User",
    avatar: PRESET_AVATARS[0].url,
    bio: "",
    quote: "",
    painPoints: ["", ""],
    motivations: ["", ""],
    goals: [""],
    attachedSurvey: null,
  });
  const [newPainInput, setNewPainInput] = useState("");
  const [newMotInput, setNewMotInput] = useState("");
  const [newGoalInput, setNewGoalInput] = useState("");

  const currentBlueprint = AI_TEMPLATES[blueprintTemplateIdx] || AI_TEMPLATES[0];

  // Automatically migrate legacy real-photo avatar paths or temporary test seeds
  function migrateOldAvatar(url) {
    if (!url) return PRESET_AVATARS[0].url;
    if (
      url.includes("lorelei") ||
      url.includes("notionists") ||
      url.includes("dizzy") ||
      url.includes("hearts") ||
      url.includes("unsplash.com") ||
      url.includes("maya.jpg") ||
      url.includes("marcus.jpg") ||
      url.includes("chloe.jpg")
    ) {
      return PRESET_AVATARS[0].url;
    }
    return url;
  }

  // Handle local file upload (PNG, JPG, SVG, WEBP)
  function handleAvatarFileUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({ ...prev, avatar: uploadEvent.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Load personas from Trello board shared storage
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (t && typeof t.get === "function") {
          const stored = await t.get("board", "shared", "personas");
          if (stored && Array.isArray(stored)) {
            setPersonas(stored.map((p) => ({ ...p, avatar: migrateOldAvatar(p.avatar) })));
          } else {
            // Initially, there are NO personas on the board
            setPersonas([]);
          }
        } else {
          // Local fallback: read localStorage
          const local = localStorage.getItem("trello_board_shared_personas");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              setPersonas(
                Array.isArray(parsed)
                  ? parsed.map((p) => ({ ...p, avatar: migrateOldAvatar(p.avatar) }))
                  : []
              );
            } catch {
              setPersonas([]);
            }
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

  function handleBack() {
    if (t && typeof t.closeModal === "function") {
      t.closeModal();
    } else if (t && typeof t.closePopup === "function") {
      t.closePopup();
    } else if (typeof window !== "undefined" && window.history) {
      window.history.back();
    }
  }

  // Randomize avatar generator from curated real portraits
  function handleRandomizeAvatar() {
    const randomAvatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
    setFormData((prev) => ({ ...prev, avatar: randomAvatar.url }));
  }

  // Open Create Form
  function openCreateModal() {
    setEditingPersona(null);
    setFormData({
      name: "",
      age: 28,
      role: "",
      category: "Target User",
      avatar: PRESET_AVATARS[0].url,
      bio: "",
      quote: "",
      painPoints: ["", ""],
      motivations: ["", ""],
      goals: [""],
      attachedSurvey: null,
    });
    setNewPainInput("");
    setNewMotInput("");
    setNewGoalInput("");
    setIsFormOpen(true);
  }

  // Open Edit Form
  function openEditModal(persona) {
    setEditingPersona(persona);
    setFormData({
      name: persona.name || "",
      age: persona.age || 28,
      role: persona.role || "",
      category: persona.category || "Target User",
      avatar: migrateOldAvatar(persona.avatar),
      bio: persona.bio || "",
      quote: persona.quote ? persona.quote.replace(/^"|"$/g, "") : "",
      painPoints:
        persona.painPoints && persona.painPoints.length > 0
          ? [...persona.painPoints]
          : ["", ""],
      motivations:
        persona.motivations && persona.motivations.length > 0
          ? [...persona.motivations]
          : ["", ""],
      goals:
        persona.goals && persona.goals.length > 0
          ? [...persona.goals]
          : [""],
      attachedSurvey: persona.attachedSurvey || null,
    });
    setNewPainInput("");
    setNewMotInput("");
    setNewGoalInput("");
    setIsFormOpen(true);
  }

  // Save Persona (Create or Update)
  async function handleSavePersona(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter a Full Name for the persona.");
      return;
    }

    // Clean up empty slots
    const cleanPains = formData.painPoints.filter((p) => p && p.trim());
    const cleanMots = formData.motivations.filter((m) => m && m.trim());
    const cleanGoals = formData.goals.filter((g) => g && g.trim());

    const quoteFormatted = formData.quote.trim()
      ? formData.quote.trim().startsWith('"')
        ? formData.quote.trim()
        : `"${formData.quote.trim()}"`
      : "";

    if (editingPersona) {
      const updated = personas.map((p) =>
        p.id === editingPersona.id
          ? {
              ...p,
              ...formData,
              age: parseInt(formData.age, 10) || 28,
              quote: quoteFormatted,
              painPoints: cleanPains,
              motivations: cleanMots,
              goals: cleanGoals,
            }
          : p
      );
      await persistPersonas(updated);
      showToast(`Updated "${formData.name}"`);
    } else {
      const newPersona = {
        id: `persona-${Date.now()}`,
        name: formData.name.trim(),
        role: formData.role.trim() || "Lead Product Designer",
        age: parseInt(formData.age, 10) || 28,
        category: formData.category || "Target User",
        avatar: formData.avatar || PRESET_AVATARS[0].url,
        bio: formData.bio.trim(),
        quote:
          quoteFormatted || '"I need to know the why behind every requirement."',
        painPoints:
          cleanPains.length > 0
            ? cleanPains
            : ["Difficulty navigating complex workflows"],
        motivations:
          cleanMots.length > 0
            ? cleanMots
            : ["Faster completion of core tasks"],
        goals:
          cleanGoals.length > 0
            ? cleanGoals
            : ["Streamline cross-team agile alignment"],
        attachedSurvey: formData.attachedSurvey,
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

  // Pain points slot handlers
  function handleUpdatePain(idx, val) {
    setFormData((prev) => {
      const updated = [...prev.painPoints];
      updated[idx] = val;
      return { ...prev, painPoints: updated };
    });
  }

  function handleRemovePain(idx) {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== idx),
    }));
  }

  function handleAddPain() {
    const val = newPainInput.trim();
    if (!val) return;
    setFormData((prev) => ({
      ...prev,
      painPoints: [...prev.painPoints, val],
    }));
    setNewPainInput("");
  }

  // Motivations slot handlers
  function handleUpdateMot(idx, val) {
    setFormData((prev) => {
      const updated = [...prev.motivations];
      updated[idx] = val;
      return { ...prev, motivations: updated };
    });
  }

  function handleRemoveMot(idx) {
    setFormData((prev) => ({
      ...prev,
      motivations: prev.motivations.filter((_, i) => i !== idx),
    }));
  }

  function handleAddMot() {
    const val = newMotInput.trim();
    if (!val) return;
    setFormData((prev) => ({
      ...prev,
      motivations: [...prev.motivations, val],
    }));
    setNewMotInput("");
  }

  // Primary Goals slot handlers
  function handleUpdateGoal(idx, val) {
    setFormData((prev) => {
      const updated = [...prev.goals];
      updated[idx] = val;
      return { ...prev, goals: updated };
    });
  }

  function handleRemoveGoal(idx) {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== idx),
    }));
  }

  function handleAddGoal() {
    const val = newGoalInput.trim();
    if (!val) return;
    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, val],
    }));
    setNewGoalInput("");
  }

  // Survey file attachment handler
  function handleSurveyFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachedSurvey: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.name.endsWith(".csv") ? "CSV" : "Excel",
        },
      }));
      showToast(`Attached survey: ${file.name}`);
    }
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
          avatar: PRESET_AVATARS[3].url,
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
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
            title="Back to Trello Board"
          >
            <ArrowLeftIcon width={16} height={16} />
            <span>Back</span>
          </button>

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
             OPTION 1: SPLIT 2-COLUMN HERO & LIVE PERSONA BLUEPRINT
             Balanced 50/50 landscape layout utilizing full horizontal modal width
             ========================================================================== */
          <div className="personas-split-layout">
            <div className="personas-split-container">
              {/* Left Column: Value Prop, CTAs & Quick Archetype Chips */}
              <div className="split-hero-left">
                <div className="split-badge-pill">
                  <span className="split-badge-dot"></span>
                  <span>Customer Empathy in Every Card</span>
                </div>

                <h1 className="split-hero-title">
                  Connect real user empathy <br />
                  to your sprint cards
                </h1>

                <p className="split-hero-desc">
                  Define user personas with target roles, pain points, and motivations.
                  Attach them directly to Trello cards so engineering and design stay aligned
                  on who you're building for.
                </p>

                <div className="split-hero-actions">
                  <button
                    type="button"
                    className="btn-create-hero"
                    onClick={openCreateModal}
                  >
                    <PlusIcon width={16} height={16} />
                    <span>Create Persona</span>
                  </button>

                  <button
                    type="button"
                    className="btn-draft-hero"
                    onClick={() => setIsAiModalOpen(true)}
                  >
                    <SparklesIcon width={16} height={16} />
                    <span>Draft with AI</span>
                  </button>

                  <button
                    type="button"
                    className="btn-sample-hero"
                    onClick={handleLoadDemoPersonas}
                  >
                    Load Sample Personas
                  </button>
                </div>

                <div className="split-quick-archetypes">
                  <div className="quick-archetypes-header">
                    <span className="quick-archetypes-label">Quick 1-click archetypes:</span>
                    <span className="quick-archetypes-sub">Click to preview live</span>
                  </div>
                  <div className="quick-chips-row">
                    {AI_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`quick-chip-btn ${blueprintTemplateIdx === idx ? "active" : ""}`}
                        onClick={() => {
                          setBlueprintTemplateIdx(idx);
                          setAiSelectedTemplate(idx);
                        }}
                        title={`Preview ${tmpl.name} (${tmpl.role})`}
                      >
                        {tmpl.role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Persona Blueprint Preview Card */}
              <div className="split-hero-right">
                <div className="blueprint-wrapper">
                  <div className="blueprint-header-tag">
                    <span className="blueprint-live-indicator"></span>
                    <span>Interactive Persona Blueprint</span>
                    <span className="blueprint-active-archetype-tag">{currentBlueprint.role}</span>
                  </div>

                  <div className="blueprint-card">
                    <div className="blueprint-card-top">
                      <div className="blueprint-avatar-wrapper">
                        {currentBlueprint.avatar ? (
                          <img
                            key={currentBlueprint.avatar}
                            src={currentBlueprint.avatar}
                            alt={currentBlueprint.name}
                            className="blueprint-avatar-img"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.parentElement.querySelector(".blueprint-avatar-fallback");
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="blueprint-avatar-fallback"
                          style={{ display: currentBlueprint.avatar ? "none" : "flex" }}
                        >
                          {currentBlueprint.name.charAt(0)}
                        </div>
                      </div>

                      <div className="blueprint-meta">
                        <div className="blueprint-name-row">
                          <h3 className="blueprint-name">{currentBlueprint.name}</h3>
                          <span className="blueprint-sample-badge">Sample Card</span>
                        </div>
                        <p className="blueprint-role">{currentBlueprint.role}</p>
                        <div className="blueprint-tags-row">
                          <span className="blueprint-badge-age">Age {currentBlueprint.age}</span>
                          <span className="blueprint-badge-cat">{currentBlueprint.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="blueprint-quote-box">
                      {currentBlueprint.quote}
                    </div>

                    <div className="blueprint-section">
                      <div className="blueprint-section-header">
                        <span className="section-dot pain-dot"></span>
                        <span className="blueprint-section-title pain-title">PAIN POINTS</span>
                      </div>
                      <div className="blueprint-pill pain-pill">
                        {currentBlueprint.painPoints[0]}
                      </div>
                    </div>

                    <div className="blueprint-section">
                      <div className="blueprint-section-header">
                        <span className="section-dot mot-dot"></span>
                        <span className="blueprint-section-title mot-title">MOTIVATIONS</span>
                      </div>
                      <div className="blueprint-pill mot-pill">
                        {currentBlueprint.motivations[0]}
                      </div>
                    </div>

                    <div className="blueprint-footer">
                      <div className="blueprint-attach-info">
                        <CardsStackIcon width={15} height={15} />
                        <span>Attaches directly to Trello Cards</span>
                      </div>
                      <button
                        type="button"
                        className="blueprint-adopt-btn"
                        onClick={handleLoadDemoPersonas}
                        title="Load sample personas into your board"
                      >
                        Explore Demo Personas →
                      </button>
                    </div>
                  </div>
                </div>
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

                  {/* Persona Bio */}
                  {persona.bio && (
                    <div className="persona-bio-box">
                      <p className="persona-bio-text">{persona.bio}</p>
                    </div>
                  )}

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

                  {/* PRIMARY GOALS Section */}
                  {persona.goals && persona.goals.length > 0 && (
                    <>
                      <div className="section-header" style={{ marginTop: "14px" }}>
                        <span className="section-dot goal-dot"></span>
                        <h4 className="section-title goal-title">
                          PRIMARY GOALS ({persona.goals.length})
                        </h4>
                      </div>
                      <div className="points-list">
                        {persona.goals.map((goal, idx) => (
                          <div key={idx} className="point-pill goal-pill">
                            {goal}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Footer: Attached Cards count & card avatars */}
                  <div className="persona-card-footer">
                    <div className="attached-cards-badge">
                      <CardsStackIcon width={16} height={16} />
                      <span>
                        Attached to {persona.attachedCardsCount || 0} Cards
                      </span>
                    </div>

                    {persona.attachedSurvey && (
                      <div
                        className="attached-survey-pill"
                        title={`Survey: ${persona.attachedSurvey.name}`}
                      >
                        <FileSpreadsheetIcon
                          width={13}
                          height={13}
                          style={{ color: "#10B981" }}
                        />
                        <span>{persona.attachedSurvey.name}</span>
                      </div>
                    )}

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
         Create / Edit Persona Modal (Pixel-Perfect to Reference Screenshots)
         ========================================================================== */}
      {isFormOpen && (
        <div className="persona-create-overlay" onClick={() => setIsFormOpen(false)}>
          <div
            className="persona-create-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Blue Banner Header (#0C66E4) */}
            <div className="persona-create-header">
              <div className="persona-create-header-left">
                <div className="persona-create-header-badge">
                  <UserPersonaIcon width={22} height={22} />
                </div>
                <div className="persona-create-header-titles">
                  <h2 className="persona-create-title">
                    {editingPersona ? "Edit User Persona" : "Create New User Persona"}
                  </h2>
                  <p className="persona-create-subtitle">
                    Define persona attributes, pain points, and motivations for Trello cards.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="persona-create-close-btn"
                onClick={() => setIsFormOpen(false)}
                title="Close"
              >
                <XCloseIcon width={18} height={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSavePersona} className="persona-create-form">
              <div className="persona-create-body">
                {/* 1. CHOOSE AVATAR Section (Single-row Circular Picker & Real Faces) */}
                <div className="persona-section-group" style={{ marginBottom: "18px" }}>
                  <label className="persona-section-heading">CHOOSE AVATAR</label>
                  <div className="persona-avatar-picker-row">
                    {/* Left: Large Circular Avatar Preview */}
                    <div className="persona-avatar-main-preview" title="Selected Persona Avatar">
                      <img
                        src={formData.avatar || PRESET_AVATARS[0].url}
                        alt="Selected Avatar"
                        className="persona-avatar-preview-img"
                        onError={(e) => {
                          e.currentTarget.src = PRESET_AVATARS[0].url;
                        }}
                      />
                    </div>

                    {/* Right Column: Horizontal Row of Avatars + Custom URL Input */}
                    <div className="persona-avatar-right-col">
                      {/* Row 1: Single Horizontal Row of Circular Presets */}
                      <div className="persona-avatar-preset-list">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            className={`persona-avatar-preset-btn ${
                              formData.avatar === av.url ? "selected" : ""
                            }`}
                            onClick={() => setFormData({ ...formData, avatar: av.url })}
                            title={`Select ${av.name}`}
                          >
                            <img
                              src={av.url}
                              alt={av.name}
                              className="persona-avatar-preset-img"
                              onError={(e) => {
                                e.currentTarget.src = PRESET_AVATARS[0].url;
                              }}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Row 2: Custom Image URL Box */}
                      <div className="persona-custom-avatar-box">
                        <input
                          type="file"
                          id="persona-avatar-file-upload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleAvatarFileUpload}
                        />
                        <label
                          htmlFor="persona-avatar-file-upload"
                          className="persona-custom-avatar-icon"
                          title="Click to upload an image from your computer"
                        >
                          <ImageIcon width={16} height={16} />
                        </label>
                        <input
                          type="url"
                          className="persona-custom-avatar-input"
                          placeholder="Or paste custom image URL..."
                          value={
                            PRESET_AVATARS.some((av) => av.url === formData.avatar)
                              ? ""
                              : (formData.avatar || "")
                          }
                          onChange={(e) =>
                            setFormData({ ...formData, avatar: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core Demographics Row (3 columns): Full Name *, Age, Role / Title * */}
                <div className="persona-row-3col">
                  <div className="persona-col-field flex-name">
                    <label className="persona-field-label">Full Name *</label>
                    <input
                      type="text"
                      className="persona-field-input"
                      placeholder="e.g. Maya Chen"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="persona-col-field flex-age">
                    <label className="persona-field-label">Age</label>
                    <input
                      type="number"
                      className="persona-field-input"
                      min="1"
                      max="120"
                      placeholder="28"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: parseInt(e.target.value, 10) || "",
                        })
                      }
                    />
                  </div>

                  <div className="persona-col-field flex-role">
                    <label className="persona-field-label">Role / Title *</label>
                    <input
                      type="text"
                      className="persona-field-input"
                      placeholder="e.g. Lead Product Designer"
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 3. Narrative Row (2 columns): Persona Background / Bio & User Quote (Motto) */}
                <div className="persona-row-2col">
                  <div className="persona-col-field">
                    <label className="persona-field-label">
                      Persona Background / Bio
                    </label>
                    <textarea
                      rows={3}
                      className="persona-field-textarea"
                      placeholder="Brief summary of their day-to-day context..."
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>

                  <div className="persona-col-field">
                    <label className="persona-field-label">User Quote (Motto)</label>
                    <textarea
                      rows={3}
                      className="persona-field-textarea quote-placeholder"
                      placeholder='"I need to know the why behind every requirement."'
                      value={formData.quote}
                      onChange={(e) =>
                        setFormData({ ...formData, quote: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 4. PAIN POINTS & FRUSTRATIONS (Red Card) */}
                <div className="persona-card-container red-container">
                  <div className="persona-card-header red-header">
                    <div className="persona-card-title-left">
                      <span className="persona-status-bullet red-bullet"></span>
                      <span className="persona-card-title red-title">
                        PAIN POINTS &amp; FRUSTRATIONS
                      </span>
                    </div>
                    <span className="persona-card-counter red-counter">
                      {formData.painPoints.filter((p) => p && p.trim()).length} added
                    </span>
                  </div>

                  {/* List of Pain Point Slots */}
                  <div className="persona-card-slots">
                    {formData.painPoints.map((point, idx) => (
                      <div key={idx} className="persona-item-slot-row">
                        <input
                          type="text"
                          className="persona-slot-input"
                          placeholder={`Pain point #${idx + 1}`}
                          value={point}
                          onChange={(e) => handleUpdatePain(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="persona-slot-trash-btn red-trash"
                          onClick={() => handleRemovePain(idx)}
                          title="Remove pain point"
                        >
                          <TrashIcon width={15} height={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Pain Point Row */}
                  <div className="persona-card-add-row">
                    <input
                      type="text"
                      className="persona-add-input"
                      placeholder="Add another pain point (press Enter)..."
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
                      className="persona-card-add-btn red-btn"
                      onClick={handleAddPain}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* 5. MOTIVATIONS & CORE DRIVERS (Green Card) */}
                <div className="persona-card-container green-container">
                  <div className="persona-card-header green-header">
                    <div className="persona-card-title-left">
                      <span className="persona-status-bullet green-bullet"></span>
                      <span className="persona-card-title green-title">
                        MOTIVATIONS &amp; CORE DRIVERS
                      </span>
                    </div>
                    <span className="persona-card-counter green-counter">
                      {formData.motivations.filter((m) => m && m.trim()).length} added
                    </span>
                  </div>

                  {/* List of Motivation Slots */}
                  <div className="persona-card-slots">
                    {formData.motivations.map((mot, idx) => (
                      <div key={idx} className="persona-item-slot-row">
                        <input
                          type="text"
                          className="persona-slot-input"
                          placeholder={`Motivation #${idx + 1}`}
                          value={mot}
                          onChange={(e) => handleUpdateMot(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="persona-slot-trash-btn green-trash"
                          onClick={() => handleRemoveMot(idx)}
                          title="Remove motivation"
                        >
                          <TrashIcon width={15} height={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Motivation Row */}
                  <div className="persona-card-add-row">
                    <input
                      type="text"
                      className="persona-add-input"
                      placeholder="Add another motivation (press Enter)..."
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
                      className="persona-card-add-btn green-btn"
                      onClick={handleAddMot}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* 6. PRIMARY GOALS & OBJECTIVES (Slate Card) */}
                <div className="persona-card-container slate-container">
                  <div className="persona-card-header slate-header">
                    <div className="persona-card-title-left">
                      <span className="persona-card-title slate-title">
                        PRIMARY GOALS &amp; OBJECTIVES
                      </span>
                    </div>
                  </div>

                  {/* List of Goal Slots */}
                  <div className="persona-card-slots">
                    {formData.goals.map((goal, idx) => (
                      <div key={idx} className="persona-item-slot-row">
                        <input
                          type="text"
                          className="persona-slot-input"
                          placeholder={`Goal #${idx + 1}`}
                          value={goal}
                          onChange={(e) => handleUpdateGoal(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="persona-slot-trash-btn slate-trash"
                          onClick={() => handleRemoveGoal(idx)}
                          title="Remove goal"
                        >
                          <TrashIcon width={15} height={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Goal Row */}
                  <div className="persona-card-add-row">
                    <input
                      type="text"
                      className="persona-add-input"
                      placeholder="Add another objective..."
                      value={newGoalInput}
                      onChange={(e) => setNewGoalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGoal();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="persona-card-add-btn slate-btn"
                      onClick={handleAddGoal}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="persona-create-footer">
                <div className="persona-footer-survey-group">
                  <label
                    className="persona-survey-attach-label"
                    title="Attach survey responses (.xls, .xlsx, .csv)"
                  >
                    <input
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      style={{ display: "none" }}
                      onChange={handleSurveyFileChange}
                    />
                    <FileSpreadsheetIcon
                      width={18}
                      height={18}
                      className="persona-survey-icon"
                    />
                    <span className="persona-survey-text">
                      {formData.attachedSurvey
                        ? formData.attachedSurvey.name
                        : "Attach Surveys (XLS / CSV)"}
                    </span>
                    <span className="persona-survey-status-dot"></span>
                  </label>
                  {formData.attachedSurvey && (
                    <button
                      type="button"
                      className="persona-survey-clear-btn"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, attachedSurvey: null }))
                      }
                      title="Detach survey file"
                    >
                      <XCloseIcon width={12} height={12} />
                    </button>
                  )}
                </div>

                <div className="persona-footer-actions">
                  <button
                    type="button"
                    className="persona-btn-cancel"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="persona-btn-create">
                    {editingPersona ? "Save Changes" : "Create Persona"}
                  </button>
                </div>
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
