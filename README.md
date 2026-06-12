# @aryagg/create-super-svelte-skeleton

A CLI scaffolding tool. One command gives you a fully wired Svelte 5 + SvelteKit starter.

---

## Create a project

```bash
npm create @aryagg/super-svelte-skeleton my-app
cd my-app
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`.

> `npm create` prepends `create-` automatically, so `@aryagg/super-svelte-skeleton` resolves to this package (`@aryagg/create-super-svelte-skeleton`).

---

## Packages

### `@aryagg/types`
Shared TypeScript types, interfaces, and enums used across the entire app.

**Includes:**
- `EUserRole` — user role hierarchy (`GUEST → USER → MANAGER → ADMIN → SUPER_ADMIN`)
- `ETheme` — light / dark theme enum
- `EStorageKey` — localStorage key constants
- `ESnackType` — notification severity levels
- `IForm`, `IFormField` — form shape interfaces
- `INavItem` — navigation item interface
- `REGEX` — shared regex patterns

---

### `@aryagg/utils`
Pure utility functions with no framework dependencies.

**Includes:**
- `getItem` / `removeItem` — typed localStorage helpers
- `setTheme` — applies theme class to `<html>`
- `deepClone` — deep object clone
- `handleApiResponse` — normalizes API responses and surfaces errors

---

### `@aryagg/theme`
CSS design token package. Imported once in `app.css`:

```css
@import "@aryagg/theme";
```

Provides all CSS custom properties for colors, spacing, typography, and surfaces used by the UI kit and Tailwind config.

**Depends on:** nothing (pure CSS)

---

### `@aryagg/ui-kit`
Svelte 5 component library and reactive stores.

**Components:** `SnackBar`, `Loader`, `Form`, `Avatar`, `DropdownMenu`, `Tabs`

**Stores:** `snackStore`, `loaderStore`, `configStore`

**Usage:**
```svelte
<script lang="ts">
  import { snackStore, SnackBar } from '@aryagg/ui-kit';
  import { ESnackType } from '@aryagg/types';

  snackStore.show({ type: ESnackType.SUCCESS, message: 'Saved!' });
</script>

<SnackBar />
```

**Depends on:** `@aryagg/types`, `@aryagg/theme`

---

### `@aryagg/i18n`
Minimal i18n engine. Used to create the reactive translation instance in `src/lib/shared/i18n/index.ts`.

**Usage:**
```ts
import { createI18n } from '@aryagg/i18n';

const i18n = createI18n({ locale: 'en', messages: { en, ar, es } });
i18n.t('key');
i18n.setLocale('ar');
```

The template wraps this in a Svelte derived store so `$t('key')` is reactive across the app.

**Depends on:** nothing

---

### `@aryagg/svelte-layout-kit`
Svelte 5 layout primitives — sidebar, topbar, page shell.

**Depends on:** `@aryagg/types`, `@aryagg/theme`

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

---

## Publishing a new version

```bash
npm version patch   # bump version
npm publish --access public
npx clear-npx-cache
```

Only `cli.js` and `template/` are included in the published package.
