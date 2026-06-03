<script lang="ts">
    import type { Snippet } from 'svelte';
    import clickOutside from '$lib/composables/clickOutside';

    type Align = 'left' | 'right';

    export interface MenuItem {
        label: string;
        icon?: any;
        onclick: () => void;
        divider?: boolean;   // render a divider BEFORE this item
        danger?: boolean;
        disabled?: boolean;
    }

    let {
        items,
        align = 'right',
        trigger,
    }: {
        items: MenuItem[];
        align?: Align;
        /** The element that opens/closes the menu */
        trigger: Snippet<[{ open: boolean; toggle: () => void }]>;
    } = $props();

    let open = $state(false);
    const toggle = () => (open = !open);
    const close  = () => (open = false);

    const alignClass: Record<Align, string> = {
        right: 'right-0',
        left:  'left-0',
    };
</script>

<div class="relative inline-block" use:clickOutside={close}>

    <!-- Trigger slot -->
    {@render trigger({ open, toggle })}

    <!-- Menu panel -->
    {#if open}
        <div
            class="absolute z-50 mt-1 min-w-44 rounded-xl border 
                   bg-surface-primary shadow-lg py-1 {alignClass[align]}"
            role="menu"
        >
            {#each items as item}
                {#if item.divider}
                    <div class="my-1 border-t "></div>
                {/if}
                <button
                    role="menuitem"
                    disabled={item.disabled}
                    onclick={() => { item.onclick(); close(); }}
                    class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed
                           {item.danger
                               ? 'text-error hover:bg-error/10'
                               : 'text-content-primary hover:bg-surface-secondary'}"
                >
                    {#if item.icon}
                        <item.icon width={15} height={15} class="shrink-0 opacity-70" />
                    {/if}
                    {item.label}
                </button>
            {/each}
        </div>
    {/if}

</div>
