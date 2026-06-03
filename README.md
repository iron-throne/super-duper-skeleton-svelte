# @aryagg/create-super-svelte-skeleton

A CLI scaffolding tool. Run one command and get a fully wired Svelte 5 project — auth, API layer, i18n, offline support, 20+ components — ready to `npm run dev`.

---

## Usage

```bash
npm create @aryagg/super-svelte-skeleton my-app
cd my-app
npm run dev
```

> npm's `create` command automatically prepends `create-` to the package name, so
> `@aryagg/super-svelte-skeleton` resolves to this package (`@aryagg/create-super-svelte-skeleton`).

---

## How the CLI works (`cli.js`) — step by step

```
npm create @aryagg/super-svelte-skeleton my-app
         │
         ▼
1. npm downloads @aryagg/create-super-svelte-skeleton from the registry
2. npx runs cli.js with "my-app" as argv[2]
         │
         ▼
3. cli.js checks: does "my-app" folder already exist? → exit if yes
4. cli.js checks: does the "template" folder exist inside the package? → exit if no
         │
         ▼
5. cli.js copies everything from template/ → my-app/
   (skips node_modules, .svelte-kit, .git, .claude)
6. cli.js updates my-app/package.json
   - sets "name" to "my-app"
   - removes the "private" flag
7. cli.js runs `npm install` inside my-app/
8. cli.js prints "Done!" with next steps
```

The filter in step 6 uses **relative** paths from the template root — not the absolute path — so it never accidentally matches `node_modules` from the npm cache folder itself.

---

## Repo structure

```
super-duper-skeleton-svelte/
├── cli.js          ← the scaffolding script (entry point)
├── package.json    ← npm package config (name, version, bin, files)
├── .npmignore      ← excludes template/node_modules, .git, build artifacts from publish
└── template/       ← everything here gets copied into the new project
```

### What gets published to npm

Only `cli.js` and the `template/` folder are included in the npm tarball (via the `files` field in `package.json`). Everything else (this README, `.npmignore`, etc.) stays in the repo only.

---

## What's inside `template/`

### Directory overview

```
template/
├── src/
│   ├── routes/             ← SvelteKit pages and layouts
│   │   ├── (auth)/         ← login, register, forgot/reset password
│   │   ├── (protected)/    ← dashboard + admin (auth-gated)
│   │   ├── settings/       ← app settings page
│   │   └── theme/          ← theme preview page
│   ├── lib/
│   │   ├── api/            ← HTTP client, endpoints, services, types
│   │   ├── components/     ← 20+ reusable UI components
│   │   ├── stores/         ← global state (auth, config, snackbar, loader)
│   │   ├── composables/    ← Svelte actions (autoFocus, clickOutside)
│   │   ├── constants/      ← route names, auth keys, common values
│   │   ├── utils/          ← helpers for string, date, number, URL, theme
│   │   ├── types/          ← shared TypeScript interfaces
│   │   └── styles/         ← global CSS and Tailwind config
│   ├── hooks.server.ts     ← server middleware (auth, locale, API key)
│   ├── hooks.client.ts     ← client error handling
│   ├── hooks.ts            ← universal hooks (i18n reroute)
│   ├── app.html            ← HTML shell (theme loader, font, CSP)
│   └── service-worker.ts   ← offline caching + request queue
├── messages/
│   ├── en.json             ← English translations
│   ├── es.json             ← Spanish translations
│   └── ar.json             ← Arabic translations
├── static/
│   ├── config/
│   │   ├── config.local.json   ← runtime config for local dev
│   │   └── config.prod.json    ← runtime config for production
│   ├── theme-light.css     ← light theme CSS variables
│   └── theme-dark.css      ← dark theme CSS variables
├── project.inlang/         ← Paraglide i18n project settings
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
└── .env.example
```

---

## Features

### Authentication
- Session cookie–based login (httpOnly, secure in production)
- JWT access + refresh tokens stored in cookie, auto-read by server hooks
- `/login`, `/register`, `/forgot-password`, `/reset-password` pages — all styled and wired
- Server-side form action validates and calls the backend, sets cookie on success
- Auth store with role-based helpers (`isAdmin`, `hasRole`, `hasPermission`)
- 5-level role hierarchy: `GUEST → USER → MANAGER → ADMIN → SUPER_ADMIN`
- Protected route group `(protected)/` — server layout checks auth before rendering

### API layer
Located in `src/lib/api/`:

| Folder | Purpose |
|---|---|
| `axiosClient.ts` | Configured axios instance — base URL from env, 30s timeout, auto Bearer token header, 401 handler |
| `http.ts` | Response normalizer + offline-queue-aware request wrapper |
| `endpoints/` | URL constants for auth and user routes, with a `buildUrl()` param helper |
| `services/` | Functions for every API call (`login`, `register`, `me`, `logout`, `refresh`, `list`, `get`, `update`, `remove`) |
| `types/` | TypeScript interfaces for all payloads and responses |

### Offline support
- **Service Worker** (`src/service-worker.ts`) with two cache strategies:
  - _Cache-first_ for static assets (JS/CSS chunks, fonts)
  - _Network-first_ for API calls and pages, 5-day TTL fallback
- **IndexedDB sync queue** (`src/lib/sync-queue.ts`) — requests made while offline are stored and replayed automatically when the network returns
- Background Sync API (Chrome/Edge) with postMessage fallback (Safari/Firefox)
- Service worker keeps an in-memory token mirror so queued requests replay with the latest auth token

### i18n (multi-language)
- **Paraglide** (`@inlang/paraglide-sveltekit`) — compile-time-safe translations
- Languages: English (`en`), Spanish (`es`), Arabic (`ar`)
- Language switcher built into `Header.svelte` — persists to localStorage
- RTL support: Paraglide injects `lang` and `dir` attributes automatically
- To add a language: add a JSON file in `messages/`, register it in `project.inlang/settings.json`, run `npm run machine-translate`

### Theming
- Light / dark CSS variable themes in `static/theme-light.css` and `static/theme-dark.css`
- `app.html` loads the correct theme file from localStorage before first paint (no flash)
- Toggle in `Header.svelte` — persists preference
- Theme preview page at `/theme`

### UI components

**Shared (`src/lib/components/shared/`)**

| Component | Description |
|---|---|
| `Alert` | Dismissible alert with type variants |
| `Avatar` | Image or initials fallback |
| `Badge` | Status / label chips |
| `Breadcrumb` | Navigation breadcrumbs |
| `ConfirmDialog` | Modal confirmation with confirm/cancel |
| `DataTable` | Sortable, paginated data table |
| `DropdownMenu` | Accessible dropdown |
| `Form` | Form wrapper with validation state |
| `Header` | Language + theme toggle bar |
| `Loader` | Full-screen loading spinner |
| `Modal` | Accessible modal dialog |
| `NoData` | Empty state with icon + message |
| `Pagination` | Page control with prev/next |
| `Sidebar` | Collapsible nav with nested items and badges |
| `SkeletonLoader` | Content placeholder while loading |
| `SnackBar` | Toast notifications (success/error/warning/info) |
| `Tabs` | Tab strip with active state |
| `Tooltip` | Hover tooltip |

**Custom inputs (`src/lib/components/customInput/`)**

| Component | Description |
|---|---|
| `Input` | Enhanced text input with label, error, icon |
| `Combobox` | Searchable select dropdown |
| `DatePicker` | Calendar date picker |
| `RichTextEditor` | WYSIWYG editor |

**Settings (`src/lib/components/settings/`)**

| Component | Description |
|---|---|
| `ThemePreview` | Live preview of colour themes |
| `TypographySettings` | Font scale / family selector |

### State management
Svelte 5 Rune-based stores in `src/lib/stores/`:

| Store | State |
|---|---|
| `auth.svelte.ts` | Current user, role helpers, login/logout |
| `config.svelte.ts` | Runtime config loaded from `/config/config.{env}.json` |
| `snackbar.svelte.ts` | `show`, `error`, `warning`, `success`, `info`, `close` |
| `loader.svelte.ts` | Global loading flag |

### Developer experience
- **Auto-imports** via `unplugin-auto-import` — no need to import `onMount`, `writable`, `goto`, `fade`, etc.
- **Path aliases** — `$components`, `$stores`, `$utils`, `$lib` — configured in both `svelte.config.js` and `tsconfig.json`
- **TypeScript strict mode** — unused locals/params flagged, exact optional properties enforced
- **ESLint + Prettier** — preconfigured with Svelte and Tailwind plugins
- **VS Code** — `.vscode/extensions.json` recommends Svelte, Tailwind, ESLint, Prettier extensions; `launch.json` sets up the debugger
- **Version polling** — layout detects new deploys and reloads automatically

### Runtime config
`static/config/config.local.json` and `config.prod.json` are loaded at startup (not bundled), so environment-specific values can be changed without a rebuild. The active config file is determined by the `PUBLIC_CONFIG_ENV` env variable.

---

## How to add something to the template

All changes go inside the `template/` folder — everything there is what gets scaffolded.

### Add a new page
```
template/src/routes/your-page/+page.svelte
template/src/routes/your-page/+page.ts      ← optional data loader
```

Add the route constant to `src/lib/constants/pageRoutes.ts` and a nav entry in the `(protected)/+layout.svelte` sidebar items array.

### Add a new API resource
1. Add endpoint URLs to `src/lib/api/endpoints/your-resource.ts`
2. Add TypeScript types to `src/lib/api/types/your-resource.ts`
3. Add service functions to `src/lib/api/services/your-resource.ts`
4. Re-export from the `index.ts` files in each folder

### Add a new language
1. Add `messages/xx.json` with all translation keys (copy from `en.json`)
2. Add `"xx"` to the `locales` array in `project.inlang/settings.json`
3. Run `npm run machine-translate` (uses Inlang CLI) to auto-fill missing keys
4. The language switcher in `Header.svelte` picks it up automatically

### Add a new component
Drop a `.svelte` file into the appropriate subfolder:
- Generic UI → `src/lib/components/shared/`
- Form controls → `src/lib/components/customInput/`

Components are not auto-imported — import them explicitly in the pages that use them.

### Add a new store
Create `src/lib/stores/your-store.svelte.ts` using Svelte 5 Runes (`$state`, `$derived`), then export from `src/lib/stores/index.ts`.

---

## Publishing a new version

```bash
# 1. Make changes inside template/ or cli.js
# 2. Bump the version in package.json
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
# 3. Publish
npm publish --access public

# 4. Clear the npx cache so the new version is fetched immediately
npx clear-npx-cache
# or manually:
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx"
```
