import type { IMenu } from '@aryagg/types';
import {
	Grid3x3Gap, Grid3x3GapFill,
	Gear, GearFill,
	Grid, ListUl,
} from 'svelte-bootstrap-icons';

export const MENU_ITEMS: IMenu[] = [
	{ label: 'Dashboard', id: 'dashboard', href: '/', icon: Grid3x3Gap, selectedIcon: Grid3x3GapFill },
	{ label: 'Theme', id: 'theme', href: '/theme', icon: Gear, selectedIcon: GearFill },
];
