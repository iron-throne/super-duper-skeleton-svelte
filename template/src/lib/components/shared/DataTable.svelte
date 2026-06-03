<script lang="ts" generics="Row extends Record<string, unknown>">
    import type { Snippet } from 'svelte';
    import { SortAlphaDown, SortAlphaUp, ArrowDownUp, Search } from 'svelte-bootstrap-icons';
    import Pagination from './Pagination.svelte';
    import NoData from './NoData.svelte';
    import SkeletonLoader from './SkeletonLoader.svelte';

    interface Column<R> {
        key: keyof R & string;
        label: string;
        sortable?: boolean;
        width?: string;
        /** Custom cell renderer — receives the row, returns a string or number */
        render?: (row: R) => string | number;
    }

    let {
        columns,
        rows,
        keyField = 'id' as keyof Row & string,
        searchable = false,
        searchPlaceholder = 'Search…',
        loading = false,
        pageSize = $bindable(10),
        pageSizeOptions = [10, 25, 50],
        emptyText = 'No data found.',
        actions,
    }: {
        columns: Column<Row>[];
        rows: Row[];
        keyField?: keyof Row & string;
        searchable?: boolean;
        searchPlaceholder?: string;
        loading?: boolean;
        pageSize?: number;
        pageSizeOptions?: number[];
        emptyText?: string;
        /** Optional snippet rendered in the last cell of every row */
        actions?: Snippet<[Row]>;
    } = $props();

    // ── Sort state ────────────────────────────────────────────────
    let sortKey   = $state<string | null>(null);
    let sortDir   = $state<'asc' | 'desc'>('asc');

    function toggleSort(key: string) {
        if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDir = 'asc';
        }
        currentPage = 1;
    }

    // ── Search ────────────────────────────────────────────────────
    let query = $state('');

    // ── Pagination ────────────────────────────────────────────────
    let currentPage = $state(1);

    // Reset to page 1 when search changes
    $effect(() => { query; currentPage = 1; });

    // ── Derived: filter → sort → paginate ─────────────────────────
    const filtered = $derived.by(() => {
        if (!query.trim()) return rows;
        const q = query.toLowerCase();
        return rows.filter((row) =>
            columns.some((col) => {
                const val = col.render ? col.render(row) : row[col.key];
                return String(val ?? '').toLowerCase().includes(q);
            })
        );
    });

    const sorted = $derived.by(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const av = String(a[sortKey as keyof Row] ?? '');
            const bv = String(b[sortKey as keyof Row] ?? '');
            const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
            return sortDir === 'asc' ? cmp : -cmp;
        });
    });

    const totalPages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
    const paginated  = $derived(sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize));

    function cellValue(col: Column<Row>, row: Row): string | number {
        return col.render ? col.render(row) : (row[col.key] as string | number) ?? '';
    }
</script>

<div class="flex flex-col gap-3">

    <!-- Search bar -->
    {#if searchable}
        <div class="relative w-full max-w-xs">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary pointer-events-none">
                <Search width={14} height={14} />
            </span>
            <input
                type="search"
                placeholder={searchPlaceholder}
                bind:value={query}
                class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border 
                       bg-surface-secondary text-content-primary placeholder:text-content-tertiary
                       focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
            />
        </div>
    {/if}

    <!-- Table -->
    <div class="w-full overflow-x-auto rounded-xl border ">
        <table class="w-full text-sm">
            <thead>
                <tr class="bg-surface-secondary text-content-secondary">
                    {#each columns as col}
                        <th
                            scope="col"
                            style={col.width ? `width:${col.width}` : ''}
                            class="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase whitespace-nowrap
                                   {col.sortable ? 'cursor-pointer select-none hover:text-content-primary transition-colors' : ''}"
                            onclick={() => col.sortable && toggleSort(col.key)}
                        >
                            <span class="inline-flex items-center gap-1.5">
                                {col.label}
                                {#if col.sortable}
                                    {#if sortKey === col.key}
                                        {#if sortDir === 'asc'}
                                            <SortAlphaDown width={13} height={13} class="text-accent" />
                                        {:else}
                                            <SortAlphaUp width={13} height={13} class="text-accent" />
                                        {/if}
                                    {:else}
                                        <ArrowDownUp width={11} height={11} class="opacity-30" />
                                    {/if}
                                {/if}
                            </span>
                        </th>
                    {/each}
                    {#if actions}
                        <th scope="col" class="px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase">
                            Actions
                        </th>
                    {/if}
                </tr>
            </thead>

            <tbody class="divide-y divide-surface-secondary">
                {#if loading}
                    {#each Array(pageSize) as _, i (i)}
                        <tr>
                            {#each columns as _c}
                                <td class="px-4 py-3">
                                    <SkeletonLoader lines={1} height="0.85rem" />
                                </td>
                            {/each}
                            {#if actions}<td></td>{/if}
                        </tr>
                    {/each}
                {:else if paginated.length === 0}
                    <tr>
                        <td colspan={columns.length + (actions ? 1 : 0)} class="px-4 py-10">
                            <NoData text={emptyText} />
                        </td>
                    </tr>
                {:else}
                    {#each paginated as row (row[keyField])}
                        <tr class="hover:bg-surface-secondary/50 transition-colors">
                            {#each columns as col}
                                <td class="px-4 py-3 text-content-primary whitespace-nowrap">
                                    {cellValue(col, row)}
                                </td>
                            {/each}
                            {#if actions}
                                <td class="px-4 py-3 text-right">
                                    {@render actions(row)}
                                </td>
                            {/if}
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    {#if !loading && sorted.length > pageSize}
        <Pagination
            bind:currentPage
            bind:pageSize
            {totalPages}
            totalItems={sorted.length}
            {pageSizeOptions}
        />
    {/if}
</div>
