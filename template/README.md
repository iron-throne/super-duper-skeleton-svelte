# My App

Svelte 5 starter with auth, i18n, API layer, offline support, and UI components.

---

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`.

---

## Environment variables

Edit `.env`:

```env
PUBLIC_API_URL="https://api.myapp.com"
PUBLIC_SITE_NAME="My App"
```

Variables prefixed `PUBLIC_` are available in both browser and server. Others are server-only. Restart dev server after changes.

---

## Project structure

```
src/
├── routes/
│   ├── (auth)/          ← login, register, forgot/reset password
│   ├── (app)/           ← your app pages go here
│   └── +layout.svelte   ← root layout (locale init, snackbar, loader)
├── lib/
│   ├── api/             ← axios client, services, endpoints, types
│   ├── components/      ← reusable UI components
│   ├── shared/
│   │   ├── i18n/        ← translation store (t, locale, setLocale)
│   │   └── config/      ← app constants
│   └── stores/          ← auth, config state
├── hooks.server.ts      ← auth + locale middleware
messages/
├── en.json              ← English translations
├── ar.json              ← Arabic
└── es.json              ← Spanish
```

---

## Building a page

**1. Create the route**

```
src/routes/(app)/dashboard/+page.svelte
```

**2. Write the component**

```svelte
<script lang="ts">
  import { t } from '$shared/i18n';
</script>

<h1>{$t('dashboard_title')}</h1>
<p>{$t('dashboard_subtitle')}</p>
```

**3. Add the translation key**

`messages/en.json`:
```json
{
  "dashboard_title": "Dashboard",
  "dashboard_subtitle": "Welcome back"
}
```

Run `npm run machine-translate` to auto-fill `ar.json` and `es.json`.

---

## Calling an API

`src/lib/api/endpoints/index.ts`:
```ts
export const ENDPOINTS = {
  USERS: '/users',
};
```

`src/lib/api/services/users.ts`:
```ts
import { http } from '../http';
import { ENDPOINTS } from '../endpoints';

export const getUsers = () => http.get(ENDPOINTS.USERS);
```

Use in a component:
```svelte
<script lang="ts">
  import { getUsers } from '$lib/api/services/users';

  let users = $state([]);
  onMount(async () => {
    const res = await getUsers();
    users = res.data;
  });
</script>
```

---

## i18n

- Import `t` explicitly in each component: `import { t } from '$shared/i18n'`
- Use as `$t('key')` in templates — reactive, updates when language changes
- Change language: `setLocale('ar')` (auto-imported, persists to localStorage)
- RTL is handled automatically — `<html dir>` updates on language switch

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript + Svelte type check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run machine-translate` | Auto-fill missing translation keys |
