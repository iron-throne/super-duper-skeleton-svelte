<script lang="ts">
	import type { ThemeEntry } from '../types';

	let { currentTheme }: { currentTheme: ThemeEntry | undefined } = $props();
</script>

<div class="mt-4 overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-[11px] leading-relaxed text-primary">
	<code>
		{#if currentTheme}
			<span class="text-accent font-semibold">:root</span> &#123;<br />
			{#each Object.entries(currentTheme.colors) as [k, v] (k)}
				<span class="text-info pl-4">{k}</span><span class="text-tertiary">: </span><span class="text-success">{v}</span><span class="text-tertiary">;</span><br />
			{/each}
			&#125;
		{/if}
	</code>
</div>
