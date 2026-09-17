# User Personaa — Trello Power-Up

User Personaa is a Trello Power-Up that enables product managers, UX designers, and agile teams to define, assign, and visualize User Personas directly on Trello cards and boards.

---

## File & Project Layout

```
User_Personaa/
├── index.html            # Dev sandbox & live iframe preview workbench
├── powerup.html          # Main iframe connector registered with Trello
├── auth.html             # Authorization popup entry point
├── settings.html         # Power-Up settings & account management popup
├── public/
│   ├── authorized.html   # OAuth return page (captures #token=...)
│   ├── authorized.js     # Extracts token, postMessages to opener, closes window
│   ├── manifest.json     # Trello Power-Up manifest & capabilities declaration
│   └── icons/
│       └── icon.svg      # Power-Up SVG icon
├── src/
│   ├── auth/
│   │   ├── AuthPopup.jsx # Interactive authorization state machine & UI
│   │   ├── auth.css      # Atlassian dark-themed auth styling
│   │   └── main.jsx      # React mounting for auth.html
│   ├── settings/
│   │   ├── SettingsPopup.jsx # Account info, sync status, disconnect/switch
│   │   ├── settings.css  # Settings popup styling
│   │   └── main.jsx      # React mounting for settings.html
│   ├── lib/
│   │   ├── auth.js       # Scoped token storage & OAuth URL generator
│   │   ├── trelloApi.js  # REST client with auto-invalidation on 401
│   │   ├── icons.jsx     # Shared SVG icons
│   │   └── ui.js         # Design tokens & theme constants
│   └── powerup/
│       └── main.js       # TrelloPowerUp.initialize capabilities declaration
├── .env.example          # Environment variable template
├── .env                  # Local environment file
├── vercel.json           # Content Security Policy (CSP) & frame ancestors
├── vite.config.js        # Multi-page build configuration
└── package.json          # Node scripts and dependencies
```

---

## Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your Trello API Key
1. Visit the [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin).
2. Create or select your **User Personaa** Power-Up.
3. Under **API Key**, generate and copy your public API key.
4. Copy `.env.example` to `.env` (if not already done) and set:
   ```env
   VITE_TRELLO_APP_KEY=your_trello_api_key_here
   ```

### 3. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` to view the interactive developer workbench.

---

## Configuring with Trello

When testing inside Trello or deploying to production (e.g. Vercel):

1. **Iframe connector URL**:
   Set to `https://<your-domain>/powerup.html`
2. **Allowed Origins**:
   Add `https://<your-domain>` (and your local tunnel URL if testing locally, e.g. via ngrok or cloudflare tunnel).
   > **Note**: Trello strictly requires the origin to be in Allowed Origins for the OAuth redirect to `authorized.html` to succeed.
3. **Capabilities**:
   Ensure the following capabilities are enabled in the Trello admin dashboard:
   - `authorization-status`
   - `show-authorization`
   - `show-settings`
   - `board-buttons`
   - `card-buttons`
   - `card-badges`
   - `card-detail-badges`
   - `card-back-section`

---

## How Authentication Works

1. **Status Check**: Trello invokes the `authorization-status` capability in `src/powerup/main.js`. It checks whether a token exists in Trello's member-private plugin storage:
   ```javascript
   t.get("member", "private", "token");
   ```
2. **Popup Prompt**: If not authorized, Trello triggers `show-authorization`, opening `./auth.html`.
3. **Connect Action**: The user clicks **Connect Trello Account**. A popup opens to:
   ```
   https://trello.com/1/authorize?expiration=never&name=User+Personaa&scope=read,write&response_type=token&key=...&return_url=.../authorized.html
   ```
4. **Token Delivery**: Upon granting approval, Trello redirects the popup to `authorized.html#token=...`.
5. **Secure Handoff**:
   - `authorized.js` removes the hash from the browser address bar immediately (`history.replaceState`).
   - It sends the token back to `auth.html` using origin-pinned `window.opener.postMessage({ source: 'user-personaa-auth', token }, window.location.origin)`.
   - The popup automatically calls `window.close()`.
6. **Scoped Storage**: `AuthPopup.jsx` receives the token, validates the origin and source, and stores it via `t.set('member', 'private', 'token', token)`.
7. **Auto 401 Eviction**: If the user later revokes access in Trello settings, `trelloApi.js` catches the `401 Unauthorized` and clears the stored token so the Power-Up gracefully requests re-authorization.
