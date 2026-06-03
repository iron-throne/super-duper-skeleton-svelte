import { ETheme, type Tab } from "$lib/types";
import { Moon, Sun } from "svelte-bootstrap-icons";

export const DEBOUNCE_DELAY = 300;
export const REGEX = {
    SPACES: /\s+/, // One or more whitespace characters (spaces, tabs, newlines)
    HTML_TAGS: /<[^>]*>/g, // any HTML tag: <tag>, </tag>, <tag attr="...">
    NON_WORD_CHARS: /[^\w\s-]/g,// characters that are NOT letters, numbers, underscores, spaces, or hyphens
    MULTI_SPACE_OR_DASH: /[\s_-]+/g, // groups of spaces, underscores, or hyphens (for collapsing into a single "-")
    NUMBER: /^-?\d+(\.\d+)?$/,// integers or decimal numbers (positive or negative)
    POSITIVE_NUMBER: /^\d+(\.\d+)?$/,// positive integers or decimals (no negative sign)
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,// email addresses 
    PHONE: /^[+\d]?(?:[\d\s-().]{7,})$/, // phone numbers (digits, spaces, +, -, parentheses)
    URL: /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i, // URLs (http, https, www)
    ALPHA: /^[A-Za-z]+$/,// only alphabetic characters (A–Z, a–z)
    ALPHANUM: /^[A-Za-z0-9]+$/,// alphanumeric characters (letters + numbers)
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, // UUID (v4)
    DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,    // ISO date (YYYY-MM-DD)
    TIME: /^\d{2}:\d{2}(:\d{2})?$/, // time (HH:MM or HH:MM:SS)
    HEX_COLOR: /^#(?:[0-9a-fA-F]{3}){1,2}$/, // hex color (#fff or #ffffff)
    PASSWORD_BASIC: /^[A-Za-z0-9]{8,}$/,// Password must be at least 8 characters (letters or numbers)
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, // Strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
};
export const THEMES_TABS:Tab[] = [
    { label:"Light", id:ETheme.LIGHT, icon: Sun},
    { label:"Dark", id:ETheme.DARK, icon: Moon}
] 