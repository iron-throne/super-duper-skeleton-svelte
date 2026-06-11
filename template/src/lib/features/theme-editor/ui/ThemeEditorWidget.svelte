<script lang="ts">
	import {
		ArrowClockwise,
		CodeSlash,
		Copy,
		Download,
		Eye,
		Save,
		ArrowDownUp,
	} from 'svelte-bootstrap-icons';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { fade } from 'svelte/transition';
	import axios from 'axios';
	import { snackStore } from '@aryagg/ui-kit';
	import { Tabs } from '@aryagg/ui-kit';
	import { ETheme, THEMES_TABS } from '@aryagg/types';
	import { deepClone } from '@aryagg/utils';
	import ThemePreview      from './ThemePreview.svelte';
	import TypographySettings from './TypographySettings.svelte';
	import ColorCard          from './ColorCard.svelte';
	import CSSOutput          from './CSSOutput.svelte';
	import { THEME_FILES }          from '../constants';
	import type { ThemeEntry, Tab } from '../types';
	import { extractCSSVariables } from '../utils';

	const DEFAULT_FONT = "'Inter', sans-serif";

	let selectedTheme      = $state<ETheme>(ETheme.LIGHT);
	let variables          = $state<ThemeEntry[]>([]);
	let clonedVariables    = $state<ThemeEntry[]>([]);
	let rightTab           = $state<Tab>('preview');
	let copiedCss          = $state(false);
	let copiedVar          = $state<string | null>(null);
	let headingFontFamily  = $state(DEFAULT_FONT);
	let bodyFontFamily     = $state(DEFAULT_FONT);
	let savedHeadingFont   = $state(DEFAULT_FONT);
	let savedBodyFont      = $state(DEFAULT_FONT);
	let fileInput: HTMLInputElement;

	const rightTabs = [
		{ id: 'preview', label: 'App Preview', icon: Eye },
		{ id: 'css',     label: 'CSS Output',  icon: CodeSlash },
	];

	let currentTheme = $derived(variables.find((v) => v.value === selectedTheme));

	let allVars = $derived.by(() => {
		const colors = currentTheme?.colors;
		if (!colors) return [] as { varName: string; hex: string }[];
		return Object.entries(colors).map(([varName, hex]) => ({ varName, hex: hex as string }));
	});

	let groupedVars = $derived.by(() => {
		const colors = currentTheme?.colors;
		if (!colors) return [] as [string, { varName: string; hex: string }[]][];
		const map = new SvelteMap<string, { varName: string; hex: string }[]>();
		for (const [varName, hex] of Object.entries(colors)) {
			const seg   = varName.replace(/^--/, '').split('-')[0] ?? 'other';
			const label = seg.charAt(0).toUpperCase() + seg.slice(1);
			if (!map.has(label)) map.set(label, []);
			map.get(label)!.push({ varName, hex: hex as string });
		}
		return [...map.entries()];
	});

	let cssText = $derived.by(() => {
		if (!currentTheme) return '';
		const lines = Object.entries(currentTheme.colors).map(([k, v]) => `  ${k}: ${v};`).join('\n');
		return `:root {\n${lines}\n}`;
	});

	let isModified = $derived.by(() => {
		const orig = clonedVariables.find((v) => v.value === selectedTheme);
		const curr = variables.find((v) => v.value === selectedTheme);
		if (!orig || !curr) return false;
		return (
			JSON.stringify(orig.colors) !== JSON.stringify(curr.colors) ||
			headingFontFamily !== savedHeadingFont ||
			bodyFontFamily    !== savedBodyFont
		);
	});

	onMount(() => {
		const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
		if (!themeLink) return;
		const observer = new MutationObserver(() => {
			selectedTheme = themeLink.href.includes('dark') ? ETheme.DARK : ETheme.LIGHT;
		});
		observer.observe(themeLink, { attributes: true, attributeFilter: ['href'] });
		return () => observer.disconnect();
	});

	onMount(() => loadThemes());

	async function loadThemes() {
		await Promise.all(
			THEME_FILES.map(async (theme) => {
				const { data } = await axios.get(theme.href);
				variables.push({ ...theme, colors: extractCSSVariables(data) });
			}),
		);
		clonedVariables = deepClone(variables);
	}

	function updateColor(varName: string, hex: string) {
		variables = variables.map((v) =>
			v.value === selectedTheme ? { ...v, colors: { ...v.colors, [varName]: hex } } : v,
		);
	}

	function handleHexInput(varName: string, e: Event) {
		const input = e.target as HTMLInputElement;
		let val = input.value.trim();
		if (!val.startsWith('#')) val = '#' + val;
		if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) {
			updateColor(varName, val.toLowerCase());
		} else {
			const entry = variables.find((v) => v.value === selectedTheme);
			if (entry) input.value = entry.colors[varName] as string;
		}
	}

	async function copyHex(varName: string, hex: string) {
		await navigator.clipboard.writeText(hex);
		copiedVar = varName;
		setTimeout(() => (copiedVar = null), 1500);
	}

	async function copyCss() {
		await navigator.clipboard.writeText(cssText);
		copiedCss = true;
		setTimeout(() => (copiedCss = false), 2000);
	}

	function exportCss() {
		const blob = new Blob([cssText], { type: 'text/css' });
		const url  = URL.createObjectURL(blob);
		const a    = document.createElement('a');
		a.href     = url;
		a.download = `theme-${selectedTheme}.css`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const parsed = extractCSSVariables(ev.target?.result as string);
			const entry  = variables.find((v) => v.value === selectedTheme);
			if (entry) {
				for (const [k, v] of Object.entries(parsed)) {
					entry.colors[k] = v;
					updateColor(k, v);
				}
				variables = [...variables];
				snackStore.showSuccess('Theme imported successfully');
			}
		};
		reader.readAsText(file);
		(e.target as HTMLInputElement).value = '';
	}

	function saveTheme() {
		const theme = variables.find((v) => v.value === selectedTheme);
		if (!theme) return;
		for (const [k, v] of Object.entries(theme.colors)) {
			document.documentElement.style.setProperty(k, v as string);
		}
		document.documentElement.style.setProperty('--font-heading', headingFontFamily);
		document.documentElement.style.setProperty('--font-family',  bodyFontFamily);
		document.documentElement.style.setProperty('--font-body',    bodyFontFamily);
		clonedVariables  = deepClone(variables);
		savedHeadingFont = headingFontFamily;
		savedBodyFont    = bodyFontFamily;
		snackStore.showSuccess('Theme applied to page');
	}

	function resetTheme() {
		const original = clonedVariables.find((v) => v.value === selectedTheme);
		if (!original) return;
		variables         = variables.map((v) => (v.value === selectedTheme ? deepClone(original) : v));
		headingFontFamily = savedHeadingFont;
		bodyFontFamily    = savedBodyFont;
		snackStore.showInfo('Theme reset to saved state');
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Instrument+Serif&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet" />
</svelte:head>

<input bind:this={fileInput} type="file" accept=".css" class="hidden" onchange={handleImport} />

<div class="bg-surface-secondary flex size-full flex-col overflow-hidden">
	<!-- ── Page Title Strip ── -->
	<div class="bg-surface-secondary shrink-0 px-10 py-2.5">
		<div class="flex items-center gap-4">
			<div>
				<h1 class="text-3xl font-bold text-primary tracking-widest">Theme Studio</h1>
				<p class="text-tertiary text-xs leading-tight pl-2">Design tokens · CSS variables · Live preview</p>
			</div>
			<div class="ml-auto flex items-center gap-1.5">
				<button onclick={() => fileInput.click()} class="btn btn-sm">
					<ArrowDownUp width="13" /> Import
				</button>
				<button onclick={copyCss} class="btn btn-sm {copiedCss ? 'border-success/30 text-success' : ''}">
					<Copy width="13" /> {copiedCss ? 'Copied!' : 'Copy CSS'}
				</button>
				<button onclick={exportCss} class="btn btn-sm">
					<Download width="13" /> Export
				</button>
				<div class="bg-border-primary/50 mx-1 h-5 w-px shrink-0"></div>
				<button onclick={resetTheme} disabled={!isModified} class="btn btn-sm">
					<ArrowClockwise width="13" /> Reset
				</button>
				<button onclick={saveTheme} disabled={!isModified} class="btn btn-primary btn-sm">
					<Save width="13" /> Save & Apply
				</button>
			</div>
		</div>
	</div>

	<!-- ── Main Grid ── -->
	<div class="grid min-h-0 flex-1 grid-cols-1 gap-2.5 overflow-hidden px-10 pt-2.5 pb-4 lg:grid-cols-5">

		<!-- Typography panel -->
		<TypographySettings bind:headingFontFamily bind:bodyFontFamily />

		<!-- LEFT: Variable editor -->
		<div class="border-border-primary bg-surface-primary flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-2">
			<div class="border-border-primary/60 flex shrink-0 items-center gap-3 px-4 py-3">
				<div class="min-w-0 flex-1">
					<p class="text-sm font-semibold">CSS Variables</p>
					<p class="text-tertiary text-[11px]">
						{allVars.length} tokens · click swatch to edit
						{#if isModified}<span class="text-warning font-medium"> · unsaved</span>{/if}
					</p>
				</div>
				<div class="bg-surface-secondary flex shrink-0 gap-0.5 rounded-xl p-0.5 text-xs">
					<Tabs tabs={THEMES_TABS} bind:active={selectedTheme} />
				</div>
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto p-4 pt-0">
				{#if groupedVars.length === 0}
					<div class="flex flex-col items-center justify-center gap-3 py-16">
						<div class="border-border-primary border-t-accent size-8 animate-spin rounded-full border-2"></div>
						<p class="text-tertiary text-xs">Loading variables…</p>
					</div>
				{:else}
					<div class="flex flex-col gap-6">
						{#each groupedVars as [group, entries] (group)}
							<div class="card bg-surface-secondary/30!">
								<div class="mb-3 flex items-center gap-2">
									<p class="text-tertiary shrink-0 text-[10px] font-bold tracking-widest uppercase">{group}</p>
									<div class="from-border-primary/50 h-px flex-1 bg-linear-to-r to-transparent"></div>
									<span class="bg-surface-secondary text-tertiary rounded-full px-1.5 py-0.5 text-[9px] font-medium">{entries.length}</span>
								</div>
								<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
									{#each entries as entry (entry.varName)}
										<ColorCard
											varName={entry.varName}
											hex={entry.hex}
											copied={copiedVar === entry.varName}
											onColorChange={(hex) => updateColor(entry.varName, hex)}
											onHexInput={(e) => handleHexInput(entry.varName, e)}
											onCopy={() => copyHex(entry.varName, entry.hex)}
										/>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- RIGHT: Preview / CSS -->
		<div class="border-border-primary bg-surface-secondary flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-2">
			<div class="border-border-primary/60 flex shrink-0 items-center gap-2 px-4 py-3">
				<div class="bg-surface-secondary flex gap-0.5 rounded-xl p-0.5 text-xs">
					<Tabs tabs={rightTabs} bind:active={rightTab} />
				</div>
				{#if rightTab === 'css'}
					<div class="ml-auto flex items-center gap-1.5">
						<button
							onclick={copyCss}
							class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
								{copiedCss ? 'border-success/30 bg-success/10 text-success' : 'border-border-primary text-secondary hover:border-primary/30 hover:text-primary'}"
						>
							<Copy /> {copiedCss ? 'Copied!' : 'Copy'}
						</button>
						<button
							onclick={exportCss}
							class="border-border-primary text-secondary hover:border-primary/30 hover:text-primary flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
						>
							<Download /> Export
						</button>
					</div>
				{/if}
			</div>

			<div class="min-h-0 flex-1 overflow-auto">
				{#if rightTab === 'css'}
					<div in:fade={{ duration: 150 }}>
						<CSSOutput {currentTheme} />
					</div>
				{:else}
					<ThemePreview colors={currentTheme?.colors} />
				{/if}
			</div>
		</div>
	</div>
</div>
