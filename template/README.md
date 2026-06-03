# SvelteKit 5 Enterprise Application

A production-ready, fully-featured SvelteKit 5 application with Runes, Tailwind CSS v3, TypeScript, multi-language support (i18n), dark/light theming, authentication, and more.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── app.css              # Global styles + Tailwind directives
├── app.html             # HTML template (theme init script)
├── app.d.ts             # TypeScript app-level declarations
├── hooks.server.ts      # Server hooks: auth, security headers, route protection
├── hooks.client.ts      # Client hooks: error handling
│
├── lib/
│   ├── components/
│   │   ├── ui/          # Reusable UI components (Button, Input, IToast, etc.)
│   │   ├── layout/      # Layout components (Sidebar, Header)
│   │   └── forms/       # Form-specific components
│   │
│   ├── stores/          # Svelte 5 Runes stores (reactive state)
│   │   ├── auth.store.svelte.ts    # User authentication state
│   │   ├── theme.store.svelte.ts   # Dark/light mode + accent color
│   │   ├── i18n.store.svelte.ts    # Language / translations
│   │   ├── toast.store.svelte.ts   # IToast notifications
│   │   └── ui.store.svelte.ts      # UI state (sidebar, modals)
│   │
│   ├── types/           # TypeScript types, interfaces, enums
│   │   ├── auth.types.ts
│   │   ├── api.types.ts
│   │   ├── ui.types.ts
│   │   └── user.types.ts
│   │
│   ├── constants/       # App-wide constants (routes, config)
│   ├── utils/           # Utility functions (cn, format, validation)
│   ├── services/        # API service layer
│   └── i18n/            # Translations (en, ar, fr, de, es)
│
└── routes/
    ├── +layout.svelte            # Root layout (theme init, toast container)
    ├── +layout.ts                # Root layout load
    ├── +layout.server.ts         # Root layout server load (auth)
    ├── +page.svelte              # Landing page
    ├── +error.svelte             # Global error page
    │
    ├── (auth)/                   # Auth route group (login, register)
    │   ├── +layout.svelte        # Auth layout (centered card)
    │   ├── login/
    │   ├── register/
    │   └── forgot-password/
    │
    ├── (app)/                    # App route group (requires auth)
    │   ├── +layout.svelte        # App layout (sidebar + header)
    │   ├── +layout.server.ts     # Auth guard
    │   ├── dashboard/
    │   ├── profile/
    │   └── settings/
    │
    └── api/                      # API endpoints
        └── auth/
            └── logout/
```

---

## ✨ Features

### 🔐 Authentication
- Login with email + password
- Registration with validation
- Forgot password flow
- ISession cookies (HTTP-only, secure)
- Auto-redirect (protected routes → login, auth routes → dashboard)
- Role-based access control (RBAC) with `EUserRole` enum

### 🌍 Internationalization (i18n)
- 5 languages: English, Arabic (RTL!), French, German, Spanish
- Auto-detects browser language
- Persists to `localStorage`
- RTL layout support (Arabic)
- Reactive via `i18nStore`

### 🌙 Theming
- Light / Dark / System theme
- 4 accent colors: Blue, Purple, Green, Rose
- CSS custom properties (easy to extend)
- Persists to `localStorage`
- FOUC prevention script in `app.html`

### 📦 State Management (Svelte 5 Runes)
- `$state` for reactive variables
- `$derived` for computed values
- `$effect` for side effects
- No external state library needed

### 🛡️ Security
- CSRF protection (SvelteKit built-in)
- HTTP-only session cookies
- Security headers (X-Frame-Options, etc.)
- Input validation with Zod schemas
- Server-side auth guards

### 📐 TypeScript
- Strict mode enabled
- Full type coverage
- Enums: `EUserRole`, `Theme`, `ESnackType`, `ColorVariant`, etc.
- Interfaces for all data shapes
- Zod schemas for runtime validation

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript + Svelte checks |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## 🔧 Adding New Pages

### 1. Public page
```
src/routes/about/+page.svelte
```

### 2. Protected page (requires login)
```
src/routes/(app)/reports/+page.svelte
src/routes/(app)/reports/+page.server.ts
```

### 3. API endpoint
```
src/routes/api/users/+server.ts
```

---

## 🌐 Adding a New Language

1. Create `src/lib/i18n/locales/de.ts` (copy from `en.ts`)
2. Add translations
3. Import in `src/lib/i18n/index.ts`:
   ```ts
   import de from './locales/de';
   const locales = { en, ar, fr, de };
   ```
4. Add to `SUPPORTED_LANGUAGES` in `src/lib/constants/index.ts`

---

## 🎨 Changing Theme Colors

Edit `THEME_COLORS` in `src/lib/constants/index.ts` and add RGB values.
The settings page automatically shows all available colors.

---

## 🚀 Deployment

This app uses `@sveltejs/adapter-auto` which auto-detects:
- **Vercel** → serverless functions
- **Netlify** → edge functions
- **Node.js** → node server

For specific targets, replace `adapter-auto` with:
- `@sveltejs/adapter-node`
- `@sveltejs/adapter-vercel`
- `@sveltejs/adapter-netlify`
- `@sveltejs/adapter-static` (for SSG)

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_APP_NAME` | App display name |
| `PUBLIC_APP_URL` | App URL |
| `AUTH_SECRET` | Secret for session signing (min 32 chars) |

---

## 🏗️ Production Checklist

- [ ] Replace demo auth with real database
- [ ] Use JWT or DB-backed sessions instead of base64 cookies
- [ ] Set `AUTH_SECRET` to a strong random string
- [ ] Enable HTTPS
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add rate limiting to auth endpoints
- [ ] Configure proper CORS if needed
- [ ] Remove demo data from dashboard

---

## 📚 Prerender
📝 Prerendering (SvelteKit)
SvelteKit can prerender routes, generating static HTML at build time.
export const prerender = true;   // enable prerender
export const prerender = false;  // disable prerender
export const prerender = 'auto'; // prerender if possible, otherwise SSR
A route can be prerendered only if all users receive the same content. Pages with actions, user‑specific data, or server‑only logic cannot be prerendered.

## 🌍 Paraglide (i18n) — How It Works
Paraglide adds simple multilingual support to SvelteKit. When you run npx sv add paraglide, it automatically sets up everything needed for translations:
Creates src/lib/paraglide/ → contains the translation engine and helper functions.
Adds i18n runtime + server middleware → detects the user’s language on each request.
Updates app.html → adds %paraglide.lang% so the correct <html lang=""> is injected.
Configures hooks.server.ts → connects Paraglide to SvelteKit’s request pipeline.
Creates a translation project → where your en.json, ar.json, etc. live.
Installs required dependencies → so translations work on both server and client.
Workflow:  
Add your messages → import t() in components → Paraglide auto‑detects the user’s language and shows the right text.
