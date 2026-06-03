import { PUBLIC_BASE_PATH } from "$env/static/public";
import { EStorageKey, EThemes } from "$lib/types/storage";
import { getItem, setItem } from "./storage";

export const handleThemeToggle = () => {
    const isDarkMode = getItem(EStorageKey.THEME) === EThemes.DARK;
    if (isDarkMode) enableLightTheme();
    else enableDarkTheme();
};

export const enableDarkTheme = () => {
    const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
    if (themeLink) {
        themeLink.href = `${PUBLIC_BASE_PATH}/theme-dark.css`;
        setItem(EStorageKey.THEME, EThemes.DARK);
    }
}

export const enableLightTheme = () => {
    const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
    if (themeLink) {
        themeLink.href = `${PUBLIC_BASE_PATH}/theme-light.css`;
        setItem(EStorageKey.THEME, EThemes.LIGHT);
    }
}