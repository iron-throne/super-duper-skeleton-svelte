<script lang="ts">
	import type { IGenericObject } from '@aryagg/types';

	let { colors }: { colors: IGenericObject | undefined } = $props();

	let styleVars = $derived(
		colors
			? Object.entries(colors)
					.map(([k, v]) => `${k}:${v}`)
					.join(';')
			: '',
	);
</script>

<div
	style={styleVars}
	class="bg-surface-secondary text-primary flex h-full flex-col gap-3 overflow-y-auto p-4 pt-0 text-sm"
>
	<!-- Metric Card -->
	<div class="card bg-surface-secondary/30!">
		<p class="text-tertiary mb-4 text-[10px] font-bold tracking-widest uppercase">Card</p>
		<div class="flex flex-col gap-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-tertiary mb-1 text-xs">Total Revenue</p>
					<p class="text-[26px] font-bold leading-none tracking-tight">$48,295</p>
					<p class="text-success mt-1.5 text-xs font-medium">↑ 8.2% this month</p>
				</div>
				<div class="bg-accent text-on-accent flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold">$</div>
			</div>
			<div>
				<div class="mb-1.5 flex items-center justify-between">
					<p class="text-tertiary text-[10px]">Goal progress</p>
					<p class="text-primary text-[10px] font-semibold">72%</p>
				</div>
				<div class="bg-surface-secondary h-1.5 overflow-hidden rounded-full">
					<div class="bg-accent h-full w-[72%] rounded-full"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Form Controls -->
	<div class="card bg-surface-secondary/30!">
		<p class="text-tertiary mb-3 text-[10px] font-bold tracking-widest uppercase">Form Controls</p>
		<div class="mb-3 grid grid-cols-2 gap-3">
			<div class="form-group"><label for="pv-name">Full name *</label><input id="pv-name" type="text" placeholder="Alex Bennett" /></div>
			<div class="form-group">
				<label for="pv-email">Email</label>
				<input id="pv-email" type="email" data-state="success" placeholder="alex@example.com" />
				<small class="text-success pl-0.5">Looks good!</small>
			</div>
			<div class="form-group">
				<label for="pv-err">Error state</label>
				<input id="pv-err" type="text" data-state="error" value="bad@value" />
				<small class="text-error pl-0.5">Invalid format</small>
			</div>
			<div class="form-group">
				<label for="pv-role">Role</label>
				<select id="pv-role"><option>Designer</option><option>Developer</option><option>Manager</option></select>
			</div>
			<div class="flex flex-wrap gap-x-5 gap-y-2">
				<label class="flex cursor-pointer items-center gap-1.5 text-xs" style="text-transform:none;letter-spacing:normal;color:var(--text-primary)">
					<input type="checkbox" checked /> Remember me
				</label>
				<label class="flex cursor-pointer items-center gap-1.5 text-xs" style="text-transform:none;letter-spacing:normal;color:var(--text-primary)">
					<input type="checkbox" disabled /> Disabled
				</label>
			</div>
			<div class="flex flex-wrap gap-x-5 gap-y-2">
				<label class="flex cursor-pointer items-center gap-1.5 text-xs" style="text-transform:none;letter-spacing:normal;color:var(--text-primary)">
					<input type="radio" name="pv-r" checked /> Option A
				</label>
				<label class="flex cursor-pointer items-center gap-1.5 text-xs" style="text-transform:none;letter-spacing:normal;color:var(--text-primary)">
					<input type="radio" name="pv-r" /> Option B
				</label>
			</div>
		</div>
	</div>

	<!-- Buttons -->
	<div class="card bg-surface-secondary/30!">
		<p class="text-tertiary mb-3 text-[10px] font-bold tracking-widest uppercase">Buttons</p>
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary btn-sm">Primary</button>
			<button class="btn btn-secondary btn-sm">Secondary</button>
			<button class="btn btn-muted btn-sm">Muted</button>
			<button class="btn btn-ghost btn-sm">Ghost</button>
			<button class="btn btn-outline btn-sm">Outline</button>
			<button class="btn btn-success btn-sm">Success</button>
			<button class="btn btn-danger btn-sm">Danger</button>
			<button class="btn btn-info btn-sm">Info</button>
			<button class="btn btn-primary btn-sm" disabled>Disabled</button>
		</div>
	</div>

	<!-- Badges -->
	<div class="card bg-surface-secondary/30!">
		<p class="text-tertiary mb-3 text-[10px] font-bold tracking-widest uppercase">Badges</p>
		<div class="flex flex-wrap gap-2">
			<span data-badge="success"><i></i>Active</span>
			<span data-badge="warning"><i></i>Pending</span>
			<span data-badge="error"><i></i>Failed</span>
			<span data-badge="info"><i></i>Info</span>
			<span data-badge="accent">Accent</span>
			<span data-badge="outline">Draft</span>
			<span data-badge>Archived</span>
		</div>
	</div>

	<!-- Alerts -->
	<div class="card bg-surface-secondary/30!">
		<p class="text-tertiary mb-3 text-[10px] font-bold tracking-widest uppercase">Alerts</p>
		<div class="grid grid-cols-2 gap-2">
			<div data-alert="success"><i>✓</i> Saved successfully.</div>
			<div data-alert="warning"><i>⚠</i> Low contrast detected.</div>
			<div data-alert="error"><i>✕</i> Failed to apply theme.</div>
			<div data-alert="info"><i>ℹ</i> 2 variables have no on-color.</div>
		</div>
	</div>
</div>
