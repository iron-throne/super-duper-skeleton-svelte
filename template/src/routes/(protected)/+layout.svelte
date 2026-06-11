<script lang="ts">
	import { updated } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
import { snackStore, loaderStore } from "@aryagg/ui-kit";
	import {SnackBar, Loader} from '@aryagg/ui-kit';

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
<div class="h-screen w-screen relative">
	{@render children()}
</div>
