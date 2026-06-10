<script lang="ts">
	import { ArrowClockwise } from 'svelte-bootstrap-icons';
	import { snackStore } from '$lib/stores/snackbar.svelte';
	import Topbar from '$components/core/Topbar.svelte';
	import { THEME_INPUTS } from '$constants';
	import type { IFormField } from '@aryagg/types';
	import {Form} from '@aryagg/ui-kit';


	let fields = $state<IFormField[]>(structuredClone(THEME_INPUTS));

	function saveTheme() {
		snackStore.success('Theme applied to page');
	}

	function resetTheme() {
		fields = structuredClone(THEME_INPUTS);
		snackStore.info('Theme reset to saved state');
	}
</script>

<div class="bg-surface-secondary flex size-full flex-col overflow-hidden">
	<Topbar />
	<!-- ── Page Title Strip ── -->
	<div class="bg-surface-secondary shrink-0 px-10 py-2.5">
		<div class="flex items-center gap-4">
			<div>
				<h1 class="text-primary text-3xl font-bold tracking-widest">Settings</h1>
				<p class="text-tertiary pl-2 text-xs leading-tight">
					Title · description · logo · favicon
				</p>
			</div>

			<div class="ml-auto flex items-center gap-1.5">
				<button onclick={resetTheme} class="btn btn-sm">
					<ArrowClockwise width="13" />
					Reset
				</button>
			</div>
		</div>
	</div>

	<!-- ── Main Grid ── -->
	<div class="container mx-auto max-w-5xl flex-1 px-10 pt-2.5 pb-4">
		<div class="card">
			<h1 class="text-accent uppercase tracking-wide text-sm mb-4">Branding</h1>
			<Form
				bind:fields
				class="grid-cols-1 sm:grid-cols-2"
				hideReset
				hideCancel
				submitLabel="Save & Apply"
				onSubmit={saveTheme}
			/>
		</div>
	</div>
</div>
