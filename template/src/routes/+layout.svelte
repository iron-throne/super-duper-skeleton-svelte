<script lang="ts">
	import '../app.css';
	import { updated } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { snackStore, loaderStore, configStore } from '@aryagg/ui-kit';
	import { SnackBar, Loader } from '@aryagg/ui-kit';
	import { ESnackType } from '@aryagg/types';
	import { initLocale } from '$shared/i18n';

	let { children, data } = $props();

	// +layout.ts's load already resolved `data` before this component was created,
	// so set the store here (top-level script, not $effect) — $effect runs after
	// the DOM (incl. children) has rendered, which is too late for consumers that
	// read configStore during their own first render/onMount.
	if (data.config) {
		configStore.set(data.config);
	}

	onMount(() => initLocale());

	$effect(() => {
		if (data.configError) {
			snackStore.show({ type: ESnackType.DANGER, message: data.configError });
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
