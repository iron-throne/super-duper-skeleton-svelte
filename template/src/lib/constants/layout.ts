import type { INavItem } from "$lib/types";
import {
    Grid3x3Gap,
    Grid3x3GapFill,
    Gear,
    GearFill,
    Grid,
    ListUl
} from "svelte-bootstrap-icons";

export const MENU_ITEMS: INavItem[] = [
    {
        label: "Dashboard",
        id: "dashboard",
        href: "/",
        icon: Grid3x3Gap,
        selectedIcon: Grid3x3GapFill
    },
    {
        label: "Theme",
        id: "theme",
        href: "/theme",
        icon: Gear,
        selectedIcon: GearFill
    }
];

export const VIEW_TABS = [
    { id: 'list', label: '', icon: ListUl },
    { id: 'grid', label: '', icon: Grid },
]