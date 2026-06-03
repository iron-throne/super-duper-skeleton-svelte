<script lang="ts">
	import { Save, ArrowClockwise, X } from 'svelte-bootstrap-icons';
	import type { IFormField } from '$lib/types';
	import Input from '$lib/components/customInput/Input.svelte';

	let {
		fields = $bindable(),
		class: gridClass = '',
		submitLabel = 'Submit',
		resetLabel = 'Reset',
		cancelLabel = 'Cancel',
		hideSubmit = false,
		hideReset = false,
		hideCancel = false,
		onSubmit,
		onReset,
		onCancel,
	}: {
		fields: IFormField[];
		class?: string;
		submitLabel?: string;
		resetLabel?: string;
		cancelLabel?: string;
		hideSubmit?: boolean;
		hideReset?: boolean;
		hideCancel?: boolean;
		onSubmit?: (fields: IFormField[]) => void;
		onReset?: () => void;
		onCancel?: () => void;
	} = $props();

	const showActions = $derived(!hideSubmit || !hideReset || !hideCancel);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSubmit?.(fields);
	}
</script>

<form onsubmit={handleSubmit} novalidate class="flex flex-col gap-6">
	<div class="grid gap-x-6 gap-y-5 {gridClass}">
		{#each fields as field, fInd (field.key)}
			<Input bind:field={fields[fInd]!} />
		{/each}
	</div>

	{#if showActions}
		<div class="flex items-center gap-2 pt-1">
			{#if !hideCancel}
				<button type="button" onclick={onCancel} class="btn btn-sm">
					<X width="13" />
					{cancelLabel}
				</button>
			{/if}
			{#if !hideReset}
				<button type="button" onclick={onReset} class="btn btn-sm">
					<ArrowClockwise width="13" />
					{resetLabel}
				</button>
			{/if}
			{#if !hideSubmit}
				<button type="submit" class="btn btn-primary btn-sm ml-auto">
					<Save width="13" />
					{submitLabel}
				</button>
			{/if}
		</div>
	{/if}
</form>
