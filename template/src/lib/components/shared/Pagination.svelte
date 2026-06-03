<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'svelte-bootstrap-icons';

  let {
    currentPage = $bindable(),
    totalPages,
    totalItems,
    pageSize = $bindable(),
    pageSizeOptions = [10, 25, 50, 100],
  }: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
  } = $props();

  // Calculate "from" index (e.g., 21–40)
  let from = $derived(
    totalItems != null && pageSize != null
      ? (currentPage - 1) * pageSize + 1
      : null
  );

  // Calculate "to" index (e.g., 21–40)
  let to = $derived(
    totalItems != null && pageSize != null
      ? Math.min(currentPage * pageSize, totalItems)
      : null
  );

  // Build page number list with ellipsis (1 … 4 5 6 … 20)
  let pageNumbers = $derived(
    (() => {
      // If few pages, show all
      if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

      // Pages near current + first + last
      const near = new Set(
        [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
          (n) => n >= 1 && n <= totalPages
        )
      );

      const sorted = [...near].sort((a, b) => a - b);
      const result: (number | '…')[] = [];

      // Insert ellipsis where gaps exist
      for (let i = 0; i < sorted.length; i++) {
        const page = sorted[i]!;
        if (i > 0 && page - sorted[i - 1]! > 1) result.push('…');
        result.push(page);
      }

      return result;
    })()
  );

  // "Go to page" input value (string for binding)
  let goToValue = $state(String(currentPage));

  // Keep input synced when currentPage changes externally
  $effect(() => {
    goToValue = String(currentPage);
  });

  // Validate and apply "Go to page"
  function handleGoTo() {
    const n = parseInt(goToValue, 10);

    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      currentPage = n;
    } else {
      // Reset if invalid
      goToValue = String(currentPage);
    }
  }

  // Change page size and reset to page 1
  function handlePageSizeChange(e: Event) {
    const newSize = parseInt((e.target as HTMLSelectElement).value, 10);
    pageSize = newSize;
    currentPage = 1;
  }
</script>

<!-- {#if totalPages > 1} -->
  <div class="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-2">

    <!-- Per-page selector -->
    {#if pageSize != null}
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-gray-400">Rows</span>
        <select
          value={pageSize}
          onchange={handlePageSizeChange}
          class="h-6 rounded-md border border-gray-200 bg-white px-1.5 text-[11px]
                 font-medium text-gray-600 shadow-none
                 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500
                 transition-colors duration-150 cursor-pointer"
        >
          {#each pageSizeOptions as size}
            <option value={size}>{size}</option>
          {/each}
        </select>
      </div>
    {/if}

    <!-- Page controls -->
    <div class="flex items-center gap-0.5">
      <!-- Prev -->
      <button
        onclick={() => (currentPage -= 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        class="h-6 w-6 flex items-center justify-center rounded-md
               text-gray-400 hover:text-gray-600 hover:bg-gray-100
               disabled:opacity-25 disabled:cursor-not-allowed
               transition-all duration-150"
      >
        <ChevronLeft class="w-3 h-3" />
      </button>

      <!-- Page numbers -->
      {#each pageNumbers as p}
        {#if p === '…'}
          <span class="w-5 text-center text-[11px] text-gray-300 select-none leading-none">·</span>
        {:else}
          <button
            onclick={() => (currentPage = p)}
            aria-label="Page {p}"
            aria-current={currentPage === p ? 'page' : undefined}
            class="h-6 min-w-4 px-1.5 rounded-md text-[11px] font-semibold transition-all duration-150
              {currentPage === p
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}"
          >
            {p}
          </button>
        {/if}
      {/each}

      <!-- Next -->
      <button
        onclick={() => (currentPage += 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        class="h-6 w-6 flex items-center justify-center rounded-md
               text-gray-400 hover:text-gray-600 hover:bg-gray-100
               disabled:opacity-25 disabled:cursor-not-allowed
               transition-all duration-150"
      >
        <ChevronRight class="w-3 h-3" />
      </button>
    </div>

    <!-- Go to page -->
    <div class="flex items-center gap-1.5">
      <span class="text-[11px] text-gray-400">Go to</span>
      <input
        type="number"
        min="1"
        max={totalPages}
        placeholder="—"
        bind:value={goToValue}
        onkeydown={(e) => e.key === 'Enter' && handleGoTo()}
        onblur={handleGoTo}
        class="h-6 w-12 rounded-md border border-gray-200 bg-white px-1.5
               text-[11px] font-medium text-gray-600 text-center
               hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500
               transition-colors duration-150
               [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>

    <!-- Item count -->
    {#if from != null && to != null && totalItems != null}
      <p class="text-[11px] text-gray-400 hidden sm:block ml-auto">
        Showing <span class="text-gray-500 font-medium">{from}–{to}</span> of {totalItems}
      </p>
    {:else}
      <p class="text-[11px] text-gray-400 hidden sm:block ml-auto">
        Page <span class="text-gray-500 font-medium">{currentPage}</span> of {totalPages}
      </p>
    {/if}

  </div>
<!-- {/if} -->
