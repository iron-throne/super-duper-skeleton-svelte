<script lang="ts">
	import '../app.css';
	import { updated } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { snackStore, loaderStore, configStore } from '@aryagg/ui-kit';
	import { SnackBar, Loader } from '@aryagg/ui-kit';
	import { ESnackType } from '@aryagg/types';
	import { initLocale } from '$shared/i18n';

	let { children, data } = $props();

	onMount(() => initLocale());

	$effect(() => {
		// Set synchronously so children have config available on first render (SSR + CSR)
		if (data.configError) {
			snackStore.show({ type: ESnackType.DANGER, message: data.configError });
		}
		if (data.config) {
			configStore.set(data.config);
		}
	});

	// When a new build is deployed, force a full-page reload on the next navigation
	// so the user always runs the latest code without a manual refresh.
	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>

{#if snackStore.current}<SnackBar />{/if}
{#if loaderStore.isVisible}<Loader />{/if}

<div class="h-screen w-screen">
	{@render children()}
</div>
