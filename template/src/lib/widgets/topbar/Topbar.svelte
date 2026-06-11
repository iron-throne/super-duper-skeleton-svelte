<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$paraglide/messages';
	import { MENU_ITEMS } from './nav.config';
	import { LOGOUT_ROUTE, PROFILE_ROUTE } from '$shared/config';
	import {
		Search,
		CaretDownFill,
		Person,
		BoxArrowRight,
		Sun,
		Moon,
	} from 'svelte-bootstrap-icons';
	import Globe2 from 'svelte-bootstrap-icons/lib/Globe2.svelte';
	import { page } from '$app/state';
	import { getLocale, setLocale, locales } from '$paraglide/runtime';
	import { ELocale, EStorageKey, ETheme } from '@aryagg/types';
	import { getItem, setItem, setTheme } from '@aryagg/utils';
	import { Avatar, DropdownMenu } from '@aryagg/ui-kit';

	const profileItems = [
		{ label: 'Profile', icon: Person,       onclick: () => goto(resolve(PROFILE_ROUTE, {})) },
		{ label: 'Logout',  icon: BoxArrowRight, danger: true, divider: true, onclick: () => goto(resolve(LOGOUT_ROUTE, {})) },
	];

	let currentLocale: ELocale = $state(ELocale.EN);
	let activeTheme: ETheme    = $state((getItem(EStorageKey.THEME) as ETheme) || ETheme.LIGHT);

	onMount(() => {
		if (browser) {
			const savedLocale = getItem(EStorageKey.LANGUAGE) as ELocale | null;
			currentLocale = (savedLocale ?? getLocale()) as ELocale;
			if (savedLocale) setLocale(savedLocale);
		}
	});

	const handleLanguageChange = (locale: ELocale) => {
		currentLocale = locale;
		setLocale(locale);
		setItem(EStorageKey.LANGUAGE, locale);
	};

	let languageItems = $derived(
		locales.map((locale) => ({
			label:   locale.toUpperCase(),
			onclick: () => handleLanguageChange(locale as ELocale),
		})),
	);

	function handleThemeChange() {
		activeTheme = activeTheme === ETheme.DARK ? ETheme.LIGHT : ETheme.DARK;
		setTheme(activeTheme, EStorageKey.THEME);
	}
</script>

<header class="h-14 bg-transparent px-2 shadow-2xs backdrop-blur-sm">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex flex-none items-center gap-3 py-2">
			<a href={resolve('/', {})} class="flex aspect-square size-10 items-center justify-center rounded-md transition-colors" aria-label="Home" title="Home">
				<img alt="Logo" class="size-full object-contain" src={asset('/logo.svg')} />
			</a>
			<h5 class="font-bold whitespace-nowrap">{m.app_name()}</h5>

			<div class="relative min-w-45 sm:min-w-60 md:min-w-75">
				<Search class="text-tertiary/70 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
				<input type="search" placeholder="Search..." class="text-secondary/80 rounded-2xl py-2 pl-8" />
			</div>
		</div>

		<div class="flex items-center gap-2">
			<nav class="flex items-end justify-center">
				{#each MENU_ITEMS as menu (menu.id)}
					{@const isActive = page.url.pathname === resolve(menu.href, {})}
					<a
						href={resolve(menu.href, {})}
						class="group hover:text-accent/80! relative flex flex-col items-center justify-between pb-1 text-[11px]! font-medium transition-colors {isActive ? 'text-accent' : 'text-secondary'}"
					>
						{#if isActive}
							<menu.selectedIcon class="size-5" />
						{:else}
							<menu.icon class="size-5" />
						{/if}
						<span class="hidden px-4 pt-1 sm:block">{menu.label}</span>
						<span class="absolute -bottom-1 h-0.5 w-full rounded-full transition-opacity {isActive ? 'bg-accent opacity-100' : 'bg-transparent opacity-0'}"></span>
					</a>
				{/each}
			</nav>

			<DropdownMenu items={languageItems} align="right">
				{#snippet trigger({ open, toggle })}
					<button onclick={toggle} aria-label="Switch language" aria-expanded={open} class="btn-ghost text-secondary hover:text-primary flex flex-col items-center gap-1 border-0 px-2 text-[11px] font-semibold">
						<Globe2 class="size-5" />
						<div class="hidden uppercase sm:block">{currentLocale}</div>
					</button>
				{/snippet}
			</DropdownMenu>

			<button onclick={handleThemeChange} aria-label="Toggle theme" class="btn-ghost text-secondary hover:text-primary flex flex-col items-center gap-1 border-0 px-4 py-1 text-[11px] font-semibold">
				{#if activeTheme === ETheme.LIGHT}
					<Sun class="size-5" /><span class="hidden sm:block">Light</span>
				{:else}
					<Moon class="size-5" /><span class="hidden sm:block">Dark</span>
				{/if}
			</button>

			<DropdownMenu items={profileItems} align="right">
				{#snippet trigger({ open, toggle })}
					<button onclick={toggle} aria-label="User menu" aria-expanded={open} class="group text-secondary hover:text-accent/80! flex flex-col items-center gap-1 border-0 px-4 pt-0 pb-1 text-[11px] font-medium transition-colors">
						<Avatar src={asset('/profile.avif')} name="Romeo & Juliet" size="xs" />
						<div class="flex items-center gap-1">
							<span class="hidden sm:block">Me</span>
							<CaretDownFill class="mt-0.5 size-3 transition-transform {open ? 'rotate-180' : ''}" />
						</div>
					</button>
				{/snippet}
			</DropdownMenu>
		</div>
	</div>
</header>
