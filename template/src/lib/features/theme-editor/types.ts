import type { ETheme, IGenericObject } from '@aryagg/types';

export interface ThemeEntry {
	name:   string;
	value:  ETheme;
	href:   string;
	colors: IGenericObject;
}

export type Tab = 'css' | 'preview';
