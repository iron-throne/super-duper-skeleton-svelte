<script lang="ts">
    import { page } from '$app/state';
    import { ChevronRight, ChevronLeft, ChevronDown } from 'svelte-bootstrap-icons';
    import type { INavItem } from '$lib/types';

    let {
        items = [],
        collapsed = $bindable(false),
    }: {
        items: INavItem[];
        collapsed?: boolean;
    } = $props();

    // Which parent item has its sub-menu open
    let openGroup = $state<string | null>(null);

    const isActive = (href: string) =>
        page.url.pathname === href || page.url.pathname.startsWith(href + '/');

    function toggleGroup(label: string) {
        openGroup = openGroup === label ? null : label;
    }
</script>

<!-- ── Sidebar shell ─────────────────────────────────────────────── -->
<aside
    class="flex flex-col h-full bg-surface-primary border-r  transition-all duration-300 {collapsed ? 'w-16' : 'w-60'}"
>

    <!-- ── Collapse toggle ── -->
    <div class="flex items-center {collapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b ">
        {#if !collapsed}
            <span class="font-semibold text-content-primary text-sm tracking-wide truncate">Menu</span>
        {/if}
        <button
            onclick={() => collapsed = !collapsed}
            class="p-1.5 rounded-md text-content-tertiary hover:text-content-primary hover:bg-surface-secondary transition"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
            {#if collapsed}
                <ChevronRight width={16} height={16} />
            {:else}
                <ChevronLeft width={16} height={16} />
            {/if}
        </button>
    </div>

    <!-- ── Nav items ── -->
    <nav class="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {#each items as item}

            {#if item.children?.length}
                <!-- ── Group with sub-items ── -->
                <div>
                    <button
                        onclick={() => toggleGroup(item.label)}
                        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            {isActive(item.href)
                                ? 'bg-accent/10 text-accent'
                                : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'}"
                        aria-expanded={openGroup === item.label}
                    >
                        {#if item.icon}
                            <item.icon width={18} height={18} class="shrink-0" />
                        {:else}
                            <span class="w-4.5 h-4.5 shrink-0"></span>
                        {/if}

                        {#if !collapsed}
                            <span class="flex-1 truncate text-left">{item.label}</span>
                            {#if item.badge != null}
                                <span class="ml-auto text-xs bg-accent text-white px-1.5 py-0.5 rounded-full leading-none">
                                    {item.badge}
                                </span>
                            {/if}
                            <!-- chevron indicator -->
                            <ChevronDown width={12} height={12} class="shrink-0 transition-transform {openGroup === item.label ? 'rotate-180' : ''}" />
                        {/if}
                    </button>

                    {#if !collapsed && openGroup === item.label}
                        <div class="ml-4 mt-0.5 flex flex-col gap-0.5 border-l  pl-3">
                            {#each item.children as child}
                                <a
                                    href={child.href}
                                    class="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                                        {isActive(child.href)
                                            ? 'text-accent font-semibold'
                                            : 'text-content-secondary hover:text-content-primary'}"
                                >
                                    {#if child.icon}
                                        <child.icon width={14} height={14} class="shrink-0" />
                                    {/if}
                                    <span class="truncate">{child.label}</span>
                                    {#if child.badge != null}
                                        <span class="ml-auto text-xs bg-accent text-white px-1.5 py-0.5 rounded-full leading-none">
                                            {child.badge}
                                        </span>
                                    {/if}
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>

            {:else}
                <!-- ── Plain nav link ── -->
                <a
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        {isActive(item.href)
                            ? 'bg-accent/10 text-accent'
                            : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'}"
                >
                    {#if item.icon}
                        <item.icon width={18} height={18} class="shrink-0" />
                    {:else}
                        <span class="w-[18px] h-[18px] shrink-0"></span>
                    {/if}

                    {#if !collapsed}
                        <span class="flex-1 truncate">{item.label}</span>
                        {#if item.badge != null}
                            <span class="ml-auto text-xs bg-accent text-white px-1.5 py-0.5 rounded-full leading-none">
                                {item.badge}
                            </span>
                        {/if}
                    {/if}
                </a>
            {/if}

        {/each}
    </nav>

</aside>
