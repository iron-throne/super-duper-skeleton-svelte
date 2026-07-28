import { createI18n, ELanguage } from '@aryagg/i18n';
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// Each locale's messages are split into one file per feature/page under
// messages/<locale>/<namespace>.json, so no single file grows unbounded as
// the app adds pages. Each locale folder's index.ts merges its namespace
// files back into one flat object — adding a namespace to an existing
// locale needs no change here, only a brand-new locale does.
import en from '../messages/en';
import ar from '../messages/ar';
import es from '../messages/es';

import { getItem, setItem } from '@aryagg/utils';
import { EStorageKey } from '@aryagg/types';


// ── Types ─────────────────────────────────────────────────────────────────────

// All loaded translation files
const _messages = { en, ar, es };

// "en" | "ar" | "es"
export type SupportedLocale = keyof typeof _messages;

// All translation keys from the English file
export type TranslationKey = keyof typeof en;

// ── Constants ─────────────────────────────────────────────────────────────────

// List of available locales
export const locales = Object.keys(_messages) as SupportedLocale[];

// Default language
const DEFAULT_LOCALE: SupportedLocale = ELanguage.EN;

// ── Core i18n instance ────────────────────────────────────────────────────────

// Create the i18n engine with messages + fallback logic
const i18n = createI18n({
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages: _messages,

    // Called when a translation key is missing
    missing: (key, locale) => {
        if (!browser || import.meta.env.DEV) {
            console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
        }
    },
});

// ── Reactive stores ───────────────────────────────────────────────────────────

/** Current locale as a Svelte store */
export const locale = writable<SupportedLocale>(DEFAULT_LOCALE);

/**
 * Reactive translation function.
 * Updates automatically when locale changes.
 *
 * Usage:
 *   {$t('home_title')}
 *   {$t('greeting', { name: 'Ana' })}
 */
export const t = derived(locale, ($locale) => {
    i18n.setLocale($locale);
    return (key: TranslationKey, params?: Record<string, string | number>): string =>
        i18n.t(key, params);
});

// ── Locale management ─────────────────────────────────────────────────────────

/** Get the current locale value (non‑reactive) */
export function getLocale(): SupportedLocale {
    return get(locale);
}
/**
 * Change the active locale.
 * Saves to localStorage and updates <html lang> + <html dir>.
 */
export function setLocale(next: string): void {
    if (!locales.includes(next as SupportedLocale)) return;

    const l = next as SupportedLocale;

    // Update i18n engine + Svelte store
    i18n.setLocale(l);
    locale.set(l);

    // Update browser state
    if (browser) {
        setItem(EStorageKey.LANGUAGE, l)
        document.documentElement.lang = l;
        document.documentElement.dir = i18n.dir();
    }
}

/**
 * Initialize locale on first page load.
 * Priority: localStorage → serverLocale → default
 */
export function initLocale(serverLocale?: string): void {
    if (!browser) return;

    const stored = getItem(EStorageKey.LANGUAGE);
    setLocale(stored ?? serverLocale ?? DEFAULT_LOCALE);
}

/**
 * Lazy‑load a locale at runtime.
 * Useful for large apps where you don't want to load all languages upfront.
 *
 * Example:
 *   await loadLocale('fr', () => import('../../../messages/fr.json'));
 */
export async function loadLocale(
    l: string,
    loader: () => Promise<{ default: Record<string, string> }>,
): Promise<void> {
    const mod = await loader();
    i18n.addMessages(l, mod.default);
}
