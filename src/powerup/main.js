/* global TrelloPowerUp */
import { isAuthorized } from "../lib/auth.js";

const ICON_URL =
  typeof window !== "undefined" && window.location.origin
    ? `${window.location.origin}/icons/icon.svg`
    : "./icons/icon.svg";

function resolveAssetUrl(path) {
  if (!path) return ICON_URL;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (typeof window !== "undefined" && window.location.origin) {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${window.location.origin}/${cleanPath}`;
  }
  return path;
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
    const attachedIds = (await t.get("card", "shared", "attachedPersonaIds")) || [];
    const boardPersonas = (await t.get("board", "shared", "personas")) || [];
    const validCount = boardPersonas.filter((p) => attachedIds.includes(p.id)).length;
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
  },

  // Badge displayed on the front of cards in board list columns showing persona icon and name
  "card-badges": async function (t) {
    const attachedIds = (await t.get("card", "shared", "attachedPersonaIds")) || [];
    if (!attachedIds || !attachedIds.length) return [];

    const boardPersonas = (await t.get("board", "shared", "personas")) || [];
    const validPersonas = boardPersonas.filter((p) => attachedIds.includes(p.id));
    if (!validPersonas.length) return [];

    return validPersonas.map((persona) => {
      const avatarUrl = resolveAssetUrl(persona.avatar);

      return {
        text: persona.name,
        icon: avatarUrl,
        monochrome: false,
      };
    });
  },

  // Badge displayed in the card back detail section header
  "card-detail-badges": async function (t) {
    const attachedIds = (await t.get("card", "shared", "attachedPersonaIds")) || [];
    if (!attachedIds || !attachedIds.length) return [];

    const boardPersonas = (await t.get("board", "shared", "personas")) || [];
    const validPersonas = boardPersonas.filter((p) => attachedIds.includes(p.id));
    if (!validPersonas.length) return [];

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
  },
});
