/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";
import { SAMPLE_PERSONAS } from "../lib/samplePersonas.js";

const ICON_URL =
  typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/icons/icon.svg`
    : "./icons/icon.svg";

function resolveAssetUrl(path) {
  if (!path) return ICON_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // If user uploaded avatar data URI is excessively large, fallback to avoid Trello postMessage choke
  if (path.startsWith("data:")) {
    return path.length > 5000 ? ICON_URL : path;
  }
  try {
    if (typeof window !== "undefined" && window.location && window.location.href) {
      const cleanPath = path.replace(/^\.?\//, "");
      return new URL(cleanPath, window.location.href).href;
    }
  } catch (e) {}
  if (typeof window !== "undefined" && window.location.origin && window.location.origin !== "null") {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${window.location.origin}/${cleanPath}`;
  }
  return path;
}

// Helper to resolve attached persona objects for a given card
async function getAttachedPersonasForCard(t) {
  try {
    // 1. Check direct persona objects stored on card
    let attached = await t.get("card", "shared", "attachedPersonas");
    if (Array.isArray(attached) && attached.length > 0) {
      return attached;
    }

    // 2. Check attachedPersonaIds on card
    let attachedIds = await t.get("card", "shared", "attachedPersonaIds");

    // 3. Fallback: check board-level card attachment map if card scope is unpopulated
    if (!Array.isArray(attachedIds) || attachedIds.length === 0) {
      try {
        const cardInfo = await t.card("id");
        if (cardInfo && cardInfo.id) {
          const boardMap = await t.get("board", "shared", "cardPersonaAttachments");
          if (boardMap && Array.isArray(boardMap[cardInfo.id])) {
            attachedIds = boardMap[cardInfo.id];
          }
        }
      } catch (e) {}
    }

    if (!Array.isArray(attachedIds) || attachedIds.length === 0) {
      return [];
    }

    // Retrieve board personas, falling back to out-of-the-box SAMPLE_PERSONAS
    let boardPersonas = await t.get("board", "shared", "personas");
    if (!Array.isArray(boardPersonas) || boardPersonas.length === 0) {
      boardPersonas = SAMPLE_PERSONAS;
    }

    // Match each ID against boardPersonas and SAMPLE_PERSONAS
    return attachedIds
      .map((id) => {
        let match = boardPersonas.find((p) => p.id === id);
        if (!match) {
          match = SAMPLE_PERSONAS.find((p) => p.id === id);
        }
        if (!match) {
          // Graceful fallback for any custom or deleted ID
          const cleanName = id
            .replace(/^persona-/, "")
            .replace(/-\d+$/, "")
            .replace(/-/g, " ");
          const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          match = { id, name: capitalized || "Persona", avatar: ICON_URL };
        }
        return match;
      })
      .filter(Boolean);
  } catch (err) {
    console.error("[User Personaa] Error retrieving attached personas:", err);
    return [];
  }
}

TrelloPowerUp.initialize({
  // Trello queries this capability to decide whether to prompt the member to authorize
  "authorization-status": async function (t) {
    const authorized = await isAuthorized(t);
    return { authorized };
  },

  // Called when Trello prompts authorization
  "show-authorization": function (t) {
    return t.popup({
      title: "Authorize User Personaa",
      url: "./auth.html",
      height: 320,
    });
  },

  // Called when member opens Power-Up settings from the board menu
  "show-settings": function (t) {
    return t.popup({
      title: "User Personaa Settings",
      url: "./settings.html",
      height: 280,
    });
  },

  // Adds a User Personaa button in the top board header
  "board-buttons": function () {
    return [
      {
        icon: {
          dark: ICON_URL,
          light: ICON_URL,
        },
        text: "User Personaa",
        callback: async function (t) {
          const authorized = await isAuthorized(t);
          if (!authorized) {
            return t.popup({
              title: "Authorize User Personaa",
              url: "./auth.html",
              height: 320,
            });
          }
          return t.modal({
            title: "User Personas",
            accentColor: "#1D2125",
            url: "./personas.html",
            fullscreen: true,
          });
        },
      },
    ];
  },

  // Card Back Section: Embeds the Empathy Persona Cards directly in card details
  "card-back-section": function (t) {
    return {
      title: "Target User Personas",
      icon: ICON_URL,
      content: {
        type: "iframe",
        url: t.signUrl("./card-section.html"),
        height: 250,
      },
      action: {
        text: "+ Add Persona",
        callback: function (t) {
          return t.popup({
            title: "Attach Personas",
            url: "./attach-popup.html",
            height: 380,
          });
        },
      },
    };
  },

  // Adds a User Persona button on the back of every card with live count
  "card-buttons": async function (t) {
    try {
      const validPersonas = await getAttachedPersonasForCard(t);
      const validCount = validPersonas.length;
      return [
        {
          icon: ICON_URL,
          text: validCount > 0 ? `User Persona (${validCount})` : "User Persona",
          callback: function (t) {
            return t.popup({
              title: "Attach Personas",
              url: "./attach-popup.html",
              height: 380,
            });
          },
        },
      ];
    } catch (err) {
      console.error("[User Personaa] Error in card-buttons:", err);
      return [
        {
          icon: ICON_URL,
          text: "User Persona",
          callback: function (t) {
            return t.popup({
              title: "Attach Personas",
              url: "./attach-popup.html",
              height: 380,
            });
          },
        },
      ];
    }
  },

  // Badge displayed on the front of cards in board list columns showing persona icon and name
  "card-badges": async function (t) {
    try {
      const validPersonas = await getAttachedPersonasForCard(t);
      if (!validPersonas || validPersonas.length === 0) return [];

      return validPersonas.map((persona) => {
        const avatarUrl = resolveAssetUrl(persona.avatar);
        const firstName = persona.name ? persona.name.trim().split(/\s+/)[0] : "Persona";

        return {
          text: firstName,
          icon: avatarUrl,
          monochrome: false,
        };
      });
    } catch (err) {
      console.error("[User Personaa] Error in card-badges:", err);
      return [];
    }
  },

  // Badge displayed in the card back detail section header
  "card-detail-badges": async function (t) {
    try {
      const validPersonas = await getAttachedPersonasForCard(t);
      if (!validPersonas || validPersonas.length === 0) return [];

      return validPersonas.map((persona) => {
        const avatarUrl = resolveAssetUrl(persona.avatar);

        return {
          title: "Target Persona",
          text: persona.name,
          icon: avatarUrl,
          monochrome: false,
          callback: function (t) {
            return t.popup({
              title: "Attach Personas",
              url: "./attach-popup.html",
              height: 380,
            });
          },
        };
      });
    } catch (err) {
      console.error("[User Personaa] Error in card-detail-badges:", err);
      return [];
    }
  },
});
