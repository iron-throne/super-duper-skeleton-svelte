<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Copy } from 'svelte-bootstrap-icons';

	let {
		varName,
		hex,
		copied    = false,
		onColorChange,
		onHexInput,
		onCopy,
	}: {
		varName:       string;
		hex:           string;
		copied?:       boolean;
		onColorChange: (hex: string) => void;
		onHexInput:    (e: Event) => void;
		onCopy:        () => void;
	} = $props();
</script>

<div
	class="group border-border-primary/60 bg-surface-secondary hover:border-accent/30 flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md"
	in:fade={{ duration: 80 }}
>
	<!-- Swatch -->
	<div class="relative h-16 w-full cursor-pointer overflow-hidden">
		<div class="absolute inset-0" style="background:{hex}"></div>
		<input
			type="color"
			class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
			value={hex.startsWith('#') && hex.length <= 7 ? hex : '#000000'}
			oninput={(e) => onColorChange(e.currentTarget.value)}
		/>
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-150 group-hover:opacity-100"
			style="background:rgba(0,0,0,0.18)"
		>
			<span class="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white" style="background:rgba(0,0,0,0.45);backdrop-filter:blur(4px)">Edit</span>
		</div>
	</div>

	<!-- Info -->
	<div class="flex flex-col gap-1.5 p-2">
		<p class="text-secondary truncate font-mono text-[9.5px] leading-none">{varName.replace('--', '')}</p>
		<div class="flex items-center gap-1">
			<input
				type="text"
				class="text-tertiary bg-surface-secondary/60 border-border-primary/40 focus:border-accent/60 focus:text-primary min-w-0 flex-1 rounded-lg border px-1.5 py-0.5 font-mono text-[10px] transition-colors focus:outline-none"
				value={hex}
				onchange={onHexInput}
			/>
			<button
				class="shrink-0 rounded-lg border p-1 transition-all
					{copied ? 'border-success/30 bg-success/10 text-success' : 'border-border-primary/60 text-tertiary hover:border-primary/30 hover:text-primary'}"
				onclick={onCopy}
			>
				{#if copied}
					<span class="px-0.5 text-[9px] font-bold">✓</span>
				{:else}
					<Copy width="10" />
				{/if}
			</button>
		</div>
	</div>
</div>
