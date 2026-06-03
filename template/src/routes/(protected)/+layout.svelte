<script lang="ts">
    import { page } from '$app/state';
    import Sidebar from '$lib/components/shared/Sidebar.svelte';
    import Header from '$lib/components/shared/Header.svelte';
    import { authStore } from '$lib/stores/auth.svelte';
    import type { INavItem } from '$lib/types';
    import {
        PeopleFill,
        GearFill,
        PersonFill,
        ShieldLockFill,
        BarChartLineFill,
        FileTextFill,
        EnvelopeFill,
        BoxSeam,
        TagFill,
		Speedometer,
    } from 'svelte-bootstrap-icons';

    let { data, children } = $props();

    // Hydrate client auth store from the server-parsed session on every navigation
    $effect(() => {
        if (data.user) authStore.setUser(data.user);
    });

    let sidebarCollapsed = $state(false);

    const navItems: INavItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Speedometer,
        },
        {
            label: 'Users',
            href: '/admin/users',
            icon: PeopleFill,
            badge: 3,
        },
        {
            label: 'Analytics',
            href: '/analytics',
            icon: BarChartLineFill,
        },
        {
            label: 'Content',
            href: '/content',
            icon: FileTextFill,
            children: [
                { label: 'Pages',      href: '/content/pages',      icon: FileTextFill },
                { label: 'Categories', href: '/content/categories',  icon: TagFill },
            ],
        },
        {
            label: 'Orders',
            href: '/orders',
            icon: BoxSeam,
            badge: 12,
        },
        {
            label: 'Messages',
            href: '/messages',
            icon: EnvelopeFill,
            badge: 5,
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: GearFill,
            children: [
                { label: 'Profile',   href: '/settings/profile',   icon: PersonFill },
                { label: 'Security',  href: '/settings/security',  icon: ShieldLockFill },
            ],
        },
    ];
</script>

<div class="flex h-screen overflow-hidden bg-surface-tertiary">

    <!-- ── Sidebar ── -->
    <Sidebar items={navItems} bind:collapsed={sidebarCollapsed} />

    <!-- ── Main column ── -->
    <div class="flex flex-1 flex-col overflow-hidden">

        <!-- ── Top bar ── -->
        <header class="flex items-center justify-between gap-4 px-6 py-3 bg-surface-primary border-b  shrink-0">

            <!-- Page title (derived from route) -->
            <h1 class="text-sm font-semibold text-content-primary truncate capitalize">
                {page.url.pathname.split('/').filter(Boolean).at(-1)?.replace(/-/g, ' ') ?? 'Home'}
            </h1>

            <!-- Right side: theme + lang toggle -->
            <div class="flex items-center gap-2">
                <!-- User chip -->
                {#if authStore.user}
                    <span class="hidden sm:flex items-center gap-2 text-sm text-content-secondary">
                        {#if authStore.user.avatarUrl}
                            <img src={authStore.user.avatarUrl} alt="" class="w-7 h-7 rounded-full object-cover" />
                        {:else}
                            <span class="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center uppercase">
                                {authStore.displayName.charAt(0)}
                            </span>
                        {/if}
                        <span class="truncate max-w-32">{authStore.displayName}</span>
                    </span>
                {/if}

                <!-- Logout -->
                <a
                    href="/logout"
                    class="btn btn-tertiary text-xs px-3 py-1.5 gap-1.5"
                    aria-label="Sign out"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span class="hidden sm:inline">Sign out</span>
                </a>

                <!-- Theme + language (inline, not floating) -->
                <Header floating={false} />
            </div>
        </header>

        <!-- ── Scrollable content area ── -->
        <main class="flex-1 overflow-y-auto p-6">
            {@render children()}
        </main>

    </div>
</div>
