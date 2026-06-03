import type { EUserRole } from './auth';

export interface INavItem {
    label: string;
    href: string;
    // `any` because svelte-bootstrap-icons ships Svelte 4 class-based components
    // (SvelteComponentTyped), which are incompatible with Svelte 5's Component type.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    roles?: EUserRole[];
    badge?: string | number;
    children?: Omit<INavItem, 'children'>[];
}
