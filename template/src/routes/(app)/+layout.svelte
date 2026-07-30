<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
	<main class="relative min-h-0 flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>
