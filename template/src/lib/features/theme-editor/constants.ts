import { PUBLIC_BASE_PATH } from '$env/static/public';
import { ETheme, EInputType, type IFormField } from '@aryagg/types';

export const THEME_FILES = [
	{ name: 'Light', href: `${PUBLIC_BASE_PATH}/theme-light.css`, value: ETheme.LIGHT },
	{ name: 'Dark',  href: `${PUBLIC_BASE_PATH}/theme-dark.css`,  value: ETheme.DARK  },
];

export const THEME_INPUTS: IFormField[] = [
	{
		id: 'site-title', key: 'title', label: 'Site title',
		placeholder: 'Theme Studio', type: EInputType.TEXT, value: 'Theme Studio',
		required: true, helperText: 'Shown in the browser tab and shared links',
		attributes: { maxlength: 60 },
	},
	{
		id: 'meta-description', key: 'metaDescription', label: 'Meta description',
		placeholder: 'Design tokens · CSS variables · Live preview',
		type: EInputType.TEXTAREA, value: 'Design tokens · CSS variables · Live preview',
		required: true, helperText: 'Used for SEO and link previews',
		attributes: { rows: 3, maxlength: 160 },
	},
	{
		id: 'logo', key: 'logo', label: 'Logo', type: EInputType.FILE,
		required: false, helperText: 'Recommended 256×256 PNG', placeholder: 'Upload logo',
		attributes: { accept: '.png,.jpg,.jpeg,.svg,.webp' }, multiple: false,
	},
	{
		id: 'favicon', key: 'favicon', label: 'Favicon', type: EInputType.FILE,
		required: false, helperText: '32×32 PNG or ICO', placeholder: 'Upload favicon',
		attributes: { accept: '.png,.ico' }, multiple: false,
	},
];
