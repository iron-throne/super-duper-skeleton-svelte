<script lang="ts">
	import { Topbar } from '$widgets/topbar';

	let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
	<Topbar />
	<main class="relative min-h-0 flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>
