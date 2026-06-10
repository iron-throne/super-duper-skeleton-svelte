<script lang="ts">
	import '@aryagg/theme';
	import { updated } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import SnackBar from '$lib/components/shared/SnackBar.svelte';
	import { snackStore } from '$lib/stores/snackbar.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';
	import { loaderStore } from '$lib/stores/loader.svelte';

	let { children } = $props();



	// If a new version is deployed, force a full page reload on next navigation
	// so the user gets the latest code without manually refreshing.
	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>

{#if snackStore.current}
	<SnackBar />
{/if}
{#if loaderStore.isVisible}
	<Loader/>
{/if}
<div class="h-screen w-screen">
	{@render children()}
</div>
