<script lang="ts">
	type FontPreset = { label: string; family: string };

	let {
		headingFontFamily = $bindable("'Inter', sans-serif"),
		bodyFontFamily = $bindable("'Inter', sans-serif"),
	}: {
		headingFontFamily?: string;
		bodyFontFamily?: string;
	} = $props();

	const FONT_PRESETS: FontPreset[] = [
		{ label: 'Inter', family: "'Inter', sans-serif" },
		{ label: 'Instrument Serif', family: "'Instrument Serif', Georgia, serif" },
		{ label: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
		{ label: 'System', family: 'system-ui, -apple-system, sans-serif' },
	];

	let selectedHeading = $derived(
		FONT_PRESETS.find((f) => f.family === headingFontFamily)?.label ?? 'Inter',
	);
	let selectedBody = $derived(
		FONT_PRESETS.find((f) => f.family === bodyFontFamily)?.label ?? 'Inter',
	);
</script>

<div
	class="border-border-primary bg-surface-primary flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm"
>
	<!-- Header -->
	<div class="border-border-primary/60 shrink-0 px-4 py-3">
		<p class="text-sm font-semibold">Typography</p>
		<p class="text-tertiary text-[11px]">Preview here · apply via Save & Apply</p>
	</div>

	<!-- Font sections -->
	<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
		<!-- Heading Font -->
		<div class="card bg-surface-secondary/30!">
			<p class="text-tertiary mb-2.5 text-[10px] font-bold tracking-widest uppercase">
				Heading Font
			</p>
			<div class="grid grid-cols-2 gap-2">
				{#each FONT_PRESETS as f (f.label)}
					<button
						onclick={() => (headingFontFamily = f.family)}
						class="flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-150
							{selectedHeading === f.label
							? 'border-accent/40 bg-accent/5 shadow-sm'
							: 'border-border-primary/60 hover:border-primary/20 hover:bg-surface-primary/60'}"
					>
						<span
							class="text-[22px] leading-none font-semibold"
							style="font-family:{f.family}">Aa</span
						>
						<span
							class="w-full truncate text-[9px] leading-none tracking-widest uppercase
								{selectedHeading === f.label ? 'text-accent font-semibold' : 'text-tertiary'}">{f.label}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<!-- Body Font -->
		<div class="card bg-surface-secondary/30!">
			<p class="text-tertiary mb-2.5 text-[10px] font-bold tracking-widest uppercase">
				Body Font
			</p>
			<div class="grid grid-cols-2 gap-2">
				{#each FONT_PRESETS as f (f.label)}
					<button
						onclick={() => (bodyFontFamily = f.family)}
						class="flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-150
							{selectedBody === f.label
							? 'border-accent/40 bg-accent/5 shadow-sm'
							: 'border-border-primary/60 hover:border-primary/20 hover:bg-surface-primary/60'}"
					>
						<span class="text-[22px] leading-none" style="font-family:{f.family}"
							>Aa</span
						>
						<span
							class="w-full truncate text-[9px] leading-none tracking-widest uppercase
								{selectedBody === f.label ? 'text-accent font-semibold' : 'text-tertiary'}">{f.label}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<!-- Live preview -->
		<div class="card bg-surface-secondary/30!">
			<p class="text-tertiary mb-2.5 text-[10px] font-bold tracking-widest uppercase">
				Preview
			</p>
			<div
				class="border-border-primary/60 bg-surface-primary flex flex-col gap-1 rounded-xl border px-4 py-3"
			>
				<p class="text-2xl leading-tight font-bold" style="font-family:{headingFontFamily}">
					Heading One
				</p>
				<p
					class="text-secondary text-lg font-semibold"
					style="font-family:{headingFontFamily}"
				>
					Heading Two
				</p>
				<p class="text-sm font-medium" style="font-family:{bodyFontFamily}">
					Body text — medium weight
				</p>
				<p
					class="text-secondary text-xs leading-relaxed"
					style="font-family:{bodyFontFamily}"
				>
					Regular body text. 
				</p>
				<p class="text-tertiary text-xs" style="font-family:{bodyFontFamily}">
					Caption · tertiary · metadata
				</p>
			</div>
		</div>
	</div>
</div>
