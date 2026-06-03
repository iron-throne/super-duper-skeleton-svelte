export function enableDarkTheme() {
    const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
    if (themeLink) {
        themeLink.href = '/theme-dark.css';
    }
}

export function enableLightTheme() {
    const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
    if (themeLink) {
        themeLink.href = '/theme-light.css';
    }
}