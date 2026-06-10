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
	import ThemePreview from '$lib/components/settings/ThemePreview.svelte';
	import TypographySettings from '$lib/components/settings/TypographySettings.svelte';
	import { snackStore } from '$lib/stores/snackbar.svelte';
	import Topbar from '$components/core/Topbar.svelte';
	import { THEME_FILES } from '$constants';
	import { ETheme, type IGenericObject, THEMES_TABS } from '@aryagg/types';
	import { deepClone } from '@aryagg/utils';
	import {Tabs} from '@aryagg/ui-kit';


	type ThemeEntry = { name: string; value: ETheme; href: string; colors: IGenericObject };
	type Tab = 'css' | 'preview';
	const rightTabs = [
		{
			id: 'preview',
			label: 'App Preview',
			icon: Eye,
		},
		{
			id: 'css',
			label: 'CSS Output',
			icon: CodeSlash,
		},
	];

	const DEFAULT_FONT = "'Inter', sans-serif";

	let selectedTheme = $state<ETheme>(ETheme.LIGHT);
	let variables = $state<ThemeEntry[]>([]);
	let clonedVariables = $state<ThemeEntry[]>([]);
	let rightTab = $state<Tab>('preview');
	let copiedCss = $state(false);
	let copiedVar = $state<string | null>(null);
	let fileInput: HTMLInputElement;

	let headingFontFamily = $state(DEFAULT_FONT);
	let bodyFontFamily = $state(DEFAULT_FONT);
	let savedHeadingFont = $state(DEFAULT_FONT);
	let savedBodyFont = $state(DEFAULT_FONT);

	let currentTheme = $derived(variables.find((v) => v.value === selectedTheme));

	onMount(() => {
		const themeLink = document.getElementById('theme-style') as HTMLLinkElement | null;
		if (!themeLink) return;

		const observer = new MutationObserver(() => {
			if (themeLink.href.includes('dark')) {
				selectedTheme = ETheme.DARK;
			} else {
				selectedTheme = ETheme.LIGHT;
			}
		});

		observer.observe(themeLink, { attributes: true, attributeFilter: ['href'] });
		return () => observer.disconnect();
	});

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
			const seg = varName.replace(/^--/, '').split('-')[0] ?? 'other';
			const label = seg.charAt(0).toUpperCase() + seg.slice(1);
			if (!map.has(label)) map.set(label, []);
			map.get(label)!.push({ varName, hex: hex as string });
		}
		return [...map.entries()];
	});

	let cssText = $derived.by(() => {
		if (!currentTheme) return '';
		const lines = Object.entries(currentTheme.colors)
			.map(([k, v]) => `  ${k}: ${v};`)
			.join('\n');
		return `:root {\n${lines}\n}`;
	});

	onMount(() => getCSSVariables());

	let isModified = $derived.by(() => {
		const orig = clonedVariables.find((v) => v.value === selectedTheme);
		const curr = variables.find((v) => v.value === selectedTheme);
		if (!orig || !curr) return false;
		const colorsChanged = JSON.stringify(orig.colors) !== JSON.stringify(curr.colors);
		const fontsChanged = headingFontFamily !== savedHeadingFont || bodyFontFamily !== savedBodyFont;
		return colorsChanged || fontsChanged;
	});

	function extractCSSVariables(css: string) {
		css = css.replace(/\/\*[\s\S]*?\*\//g, '');
		const vars: Record<string, string> = {};
		const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
		let m;
		while ((m = regex.exec(css)) !== null) {
			if (m[1] && m[2]) vars[m[1].trim()] = m[2].trim();
		}
		return vars;
	}

	async function getCSSVariables() {
		await Promise.all(
			THEME_FILES.map(async (theme) => {
				const { data } = await axios.get(theme.href);
				variables.push({ ...theme, colors: extractCSSVariables(data) });
			}),
		);
		clonedVariables = deepClone(variables);
	}

	function updateColor(varName: string, hex: string) {
		variables = variables.map((v) => {
			if (v.value === selectedTheme) {
				return { ...v, colors: { ...v.colors, [varName]: hex } };
			}
			return v;
		});
	}

	function handleHexInput(varName: string, e: Event) {
		const input = e.target as HTMLInputElement;
		let val = input.value.trim();
		if (!val.startsWith('#')) val = '#' + val;
		if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) {
			updateColor(varName, val.toLowerCase());
		} else {
			const entry = variables.find((v) => v.value === selectedTheme);
			if (entry) input.value = entry.colors[varName];
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
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
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
			const entry = variables.find((v) => v.value === selectedTheme);
			if (entry) {
				for (const [k, v] of Object.entries(parsed)) {
					entry.colors[k] = v;
					updateColor(k, v);
				}
				variables = [...variables];
				snackStore.success('Theme imported successfully');
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
		clonedVariables = deepClone(variables);
		document.documentElement.style.setProperty('--font-heading', headingFontFamily);
		document.documentElement.style.setProperty('--font-family', bodyFontFamily);
		document.documentElement.style.setProperty('--font-body', bodyFontFamily);
		savedHeadingFont = headingFontFamily;
		savedBodyFont = bodyFontFamily;
		snackStore.success('Theme applied to page');
	}

	function resetTheme() {
		const original = clonedVariables.find((v) => v.value === selectedTheme);
		if (!original) return;
		variables = variables.map((v) => (v.value === selectedTheme ? deepClone(original) : v));
		headingFontFamily = savedHeadingFont;
		bodyFontFamily = savedBodyFont;
		snackStore.info('Theme reset to saved state');
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Instrument+Serif&family=JetBrains+Mono:wght@400..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<input bind:this={fileInput} type="file" accept=".css" class="hidden" onchange={handleImport} />

<div class="bg-surface-secondary flex size-full flex-col overflow-hidden">
	<Topbar />
	<!-- ── Page Title Strip ── -->
	<div class="bg-surface-secondary shrink-0 px-10 py-2.5">
		<div class="flex items-center gap-4">
			<div>
				<h1 class="text-3xl font-bold text-primary tracking-widest">Theme Studio</h1>
				<p class="text-tertiary text-xs leading-tight pl-2">
					Design tokens · CSS variables · Live preview
				</p>
			</div>

			<div class="ml-auto flex items-center gap-1.5">
				<!-- Utility group -->
				<button onclick={() => fileInput.click()} class="btn btn-sm">
					<ArrowDownUp width="13" />
					Import
				</button>
				<button
					onclick={copyCss}
					class="btn btn-sm {copiedCss ? 'border-success/30 text-success' : ''}"
				>
					<Copy width="13" />
					{copiedCss ? 'Copied!' : 'Copy CSS'}
				</button>
				<button onclick={exportCss} class="btn btn-sm">
					<Download width="13" />
					Export
				</button>

				<!-- Separator -->
				<div class="bg-border-primary/50 mx-1 h-5 w-px shrink-0"></div>

				<!-- Action group -->
				<button onclick={resetTheme} disabled={!isModified} class="btn btn-sm">
					<ArrowClockwise width="13" />
					Reset
				</button>
				<button onclick={saveTheme} disabled={!isModified} class="btn btn-primary btn-sm">
					<Save width="13" />
					Save & Apply
				</button>
			</div>
		</div>
	</div>

	<!-- ── Main Grid ── -->
	<div
		class="grid min-h-0 flex-1 grid-cols-1 gap-2.5 overflow-hidden px-10 pt-2.5 pb-4 lg:grid-cols-5"
	>
		<!-- ── TYPOGRAPHY panel ── -->
		<TypographySettings bind:headingFontFamily bind:bodyFontFamily />

		<!-- ── LEFT: Variable editor ── -->
		<div
			class="border-border-primary bg-surface-primary flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-2"
		>
			<!-- Panel header -->
			<div
				class="border-border-primary/60 flex shrink-0 items-center gap-3 px-4 py-3"
			>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-semibold">CSS Variables</p>
					<p class="text-tertiary text-[11px]">
						{allVars.length} tokens · click swatch to edit
						{#if isModified}
							<span class="text-warning font-medium"> · unsaved</span>
						{/if}
					</p>
				</div>
				<!-- Theme switcher -->
				<div
					class="bg-surface-secondary flex shrink-0 gap-0.5 rounded-xl p-0.5 text-xs"
				>
					<Tabs tabs={THEMES_TABS} bind:active={selectedTheme} />
				</div>
			</div>

			<!-- Variable grid -->
			<div class="min-h-0 flex-1 overflow-y-auto p-4 pt-0">
				{#if groupedVars.length === 0}
					<div class="flex flex-col items-center justify-center gap-3 py-16">
						<div
							class="border-border-primary border-t-accent size-8 animate-spin rounded-full border-2"
						></div>
						<p class="text-tertiary text-xs">Loading variables…</p>
					</div>
				{:else}
					<div class="flex flex-col gap-6">
						{#each groupedVars as [group, entries] (group)}
							<div class="card bg-surface-secondary/30!">
								<div class="mb-3 flex items-center gap-2">
									<p
										class="text-tertiary shrink-0 text-[10px] font-bold tracking-widest uppercase"
									>
										{group}
									</p>
									<div
										class="from-border-primary/50 h-px flex-1 bg-linear-to-r to-transparent"
									></div>
									<span
										class="bg-surface-secondary text-tertiary rounded-full px-1.5 py-0.5 text-[9px] font-medium"
										>{entries.length}</span
									>
								</div>

								<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
									{#each entries as entry (entry.varName)}
										<div
											class="group border-border-primary/60 bg-surface-secondary hover:border-accent/30 flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md"
											in:fade={{ duration: 80 }}
										>
											<!-- Swatch -->
											<div
												class="relative h-16 w-full cursor-pointer overflow-hidden"
											>
												<div
													class="absolute inset-0"
													style="background:{entry.hex}"
												></div>
												<input
													type="color"
													class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
													value={entry.hex.startsWith('#') &&
													entry.hex.length <= 7
														? entry.hex
														: '#000000'}
													oninput={(e) =>
														updateColor(
															entry.varName,
															e.currentTarget.value,
														)}
												/>
												<div
													class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-150 group-hover:opacity-100"
													style="background:rgba(0,0,0,0.18)"
												>
													<span
														class="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
														style="background:rgba(0,0,0,0.45);backdrop-filter:blur(4px)"
														>Edit</span
													>
												</div>
											</div>

											<!-- Info -->
											<div class="flex flex-col gap-1.5 p-2">
												<p
													class="text-secondary truncate font-mono text-[9.5px] leading-none"
												>
													{entry.varName.replace('--', '')}
												</p>
												<div class="flex items-center gap-1">
													<input
														type="text"
														class="text-tertiary bg-surface-secondary/60 border-border-primary/40 focus:border-accent/60 focus:text-primary min-w-0 flex-1 rounded-lg border px-1.5 py-0.5 font-mono text-[10px] transition-colors focus:outline-none"
														value={entry.hex}
														onchange={(e) =>
															handleHexInput(entry.varName, e)}
													/>
													<button
														class="shrink-0 rounded-lg border p-1 transition-all
															{copiedVar === entry.varName
															? 'border-success/30 bg-success/10 text-success'
															: 'border-border-primary/60 text-tertiary hover:border-primary/30 hover:text-primary'}"
														onclick={() =>
															copyHex(entry.varName, entry.hex)}
													>
														{#if copiedVar === entry.varName}
															<span
																class="px-0.5 text-[9px] font-bold"
																>✓</span
															>
														{:else}
															<Copy width="10" />
														{/if}
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- ── RIGHT: Preview / CSS ── -->
		<div
			class="border-border-primary bg-surface-secondary flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-2"
		>
			<!-- Tab bar -->
			<div
				class="border-border-primary/60 flex shrink-0 items-center gap-2 px-4 py-3"
			>
				<div class="bg-surface-secondary flex gap-0.5 rounded-xl p-0.5 text-xs">
					<Tabs tabs={rightTabs} bind:active={rightTab} />
				</div>

				{#if rightTab === 'css'}
					<div class="ml-auto flex items-center gap-1.5">
						<button
							onclick={copyCss}
							class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
								{copiedCss
								? 'border-success/30 bg-success/10 text-success'
								: 'border-border-primary text-secondary hover:border-primary/30 hover:text-primary'}"
						>
							<Copy/>
							{copiedCss ? 'Copied!' : 'Copy'}
						</button>
						<button
							onclick={exportCss}
							class="border-border-primary text-secondary hover:border-primary/30 hover:text-primary flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
						>
							<Download/>
							Export
						</button>
					</div>
				{/if}
			</div>

			<!-- Body -->
			<div class="min-h-0 flex-1 overflow-auto">
				{#if rightTab === 'css'}
					<div
						class="mt-4 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-[11px] leading-relaxed text-primary"
						in:fade={{ duration: 150 }}><code
							>
							{#if currentTheme}<span class="text-accent font-semibold">:root</span
								> &#123;
								<br/>
{#each Object.entries(currentTheme.colors) as [k, v] (k)}
									<span class="text-info pl-4">{k}</span><span class="text-tertiary"
										>: </span><span class="text-success">{v}</span><span
										class="text-tertiary">;</span
									>
									<br/>
								{/each}
								
								&#125;{/if}
								</code
						></div>
				{:else}
					<ThemePreview colors={currentTheme?.colors} />
				{/if}
			</div>
		</div>
	</div>
</div>
