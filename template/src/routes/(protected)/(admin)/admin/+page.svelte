<script lang="ts">
    import {
        PeopleFill,
        BoxSeam,
        EnvelopeFill,
        CurrencyDollar,
        ArrowUpRight,
        ArrowDownRight,
        PersonPlusFill,
        ShieldLockFill,
        FileTextFill,
        GearFill,
    } from 'svelte-bootstrap-icons';

    // ── Stat cards ──────────────────────────────────────────────────
    const stats = [
        {
            label: 'Total Users',
            value: '2,847',
            change: '+12%',
            up: true,
            icon: PeopleFill,
            color: 'text-info',
            bg: 'bg-info/10',
        },
        {
            label: 'Orders',
            value: '1,293',
            change: '+8%',
            up: true,
            icon: BoxSeam,
            color: 'text-success',
            bg: 'bg-success/10',
        },
        {
            label: 'Messages',
            value: '348',
            change: '-3%',
            up: false,
            icon: EnvelopeFill,
            color: 'text-warning',
            bg: 'bg-warning/10',
        },
        {
            label: 'Revenue',
            value: '$48,200',
            change: '+21%',
            up: true,
            icon: CurrencyDollar,
            color: 'text-accent',
            bg: 'bg-accent/10',
        },
    ] as const;

    // ── Recent activity ─────────────────────────────────────────────
    const activity = [
        { user: 'Alice Johnson',   action: 'Registered',        time: '2 min ago',   status: 'success' },
        { user: 'Bob Martinez',    action: 'Placed order #8821', time: '15 min ago',  status: 'info'    },
        { user: 'Carol White',     action: 'Sent message',       time: '32 min ago',  status: 'info'    },
        { user: 'David Kim',       action: 'Password reset',     time: '1 hr ago',    status: 'warning' },
        { user: 'Eva Nguyen',      action: 'Account suspended',  time: '3 hrs ago',   status: 'error'   },
        { user: 'Frank Schmidt',   action: 'Profile updated',    time: '5 hrs ago',   status: 'success' },
    ] as const;

    const statusClass: Record<string, string> = {
        success: 'bg-success/15 text-success',
        info:    'bg-info/15 text-info',
        warning: 'bg-warning/20 text-warning',
        error:   'bg-error/15 text-error',
    };

    // ── Quick actions ───────────────────────────────────────────────
    const actions = [
        { label: 'Add User',      icon: PersonPlusFill,  href: '/admin/users',       color: 'text-info'    },
        { label: 'Permissions',   icon: ShieldLockFill,  href: '/settings/security',  color: 'text-accent'  },
        { label: 'Content',       icon: FileTextFill,    href: '/content/pages',      color: 'text-success' },
        { label: 'Settings',      icon: GearFill,        href: '/settings',           color: 'text-warning' },
    ] as const;
</script>

<!-- ── Page heading ─────────────────────────────────────────────── -->
<div class="mb-6">
    <h2 class="text-xl font-bold text-content-primary">Admin Dashboard</h2>
    <p class="text-sm text-content-secondary mt-0.5">Overview of your application's key metrics.</p>
</div>

<!-- ── Stat cards ───────────────────────────────────────────────── -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
    {#each stats as s}
        <div class="bg-surface-primary rounded-xl border  p-5 flex items-start gap-4 shadow-sm">
            <div class="p-2.5 rounded-lg {s.bg} {s.color} shrink-0">
                <s.icon width={20} height={20} />
            </div>
            <div class="min-w-0">
                <p class="text-xs text-content-secondary font-medium truncate">{s.label}</p>
                <p class="text-2xl font-bold text-content-primary leading-tight mt-0.5">{s.value}</p>
                <span class="inline-flex items-center gap-0.5 text-xs font-medium mt-1 {s.up ? 'text-success' : 'text-error'}">
                    {#if s.up}
                        <ArrowUpRight width={12} height={12} />
                    {:else}
                        <ArrowDownRight width={12} height={12} />
                    {/if}
                    {s.change} this month
                </span>
            </div>
        </div>
    {/each}
</div>

<!-- ── Bottom grid: activity + quick actions ────────────────────── -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <!-- Recent activity (2/3 width) -->
    <div class="lg:col-span-2 bg-surface-primary rounded-xl border  shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b ">
            <h3 class="text-sm font-semibold text-content-primary">Recent Activity</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-surface-secondary/50">
                        <th class="text-left px-5 py-2.5 text-xs font-semibold text-content-secondary uppercase tracking-wide">User</th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-content-secondary uppercase tracking-wide">Action</th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-content-secondary uppercase tracking-wide">Time</th>
                        <th class="text-left px-4 py-2.5 text-xs font-semibold text-content-secondary uppercase tracking-wide">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each activity as row, i}
                        <tr class="border-t /60 {i % 2 === 1 ? 'bg-surface-secondary/20' : ''}">
                            <td class="px-5 py-3 font-medium text-content-primary whitespace-nowrap">{row.user}</td>
                            <td class="px-4 py-3 text-content-secondary">{row.action}</td>
                            <td class="px-4 py-3 text-content-tertiary whitespace-nowrap">{row.time}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-0.5 rounded-full text-xs font-medium {statusClass[row.status]}">
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Quick actions (1/3 width) -->
    <div class="bg-surface-primary rounded-xl border  shadow-sm">
        <div class="px-5 py-4 border-b ">
            <h3 class="text-sm font-semibold text-content-primary">Quick Actions</h3>
        </div>
        <div class="p-4 flex flex-col gap-2">
            {#each actions as a}
                <a
                    href={a.href}
                    class="flex items-center gap-3 px-4 py-3 rounded-lg border 
                           hover:bg-surface-secondary transition-colors group"
                >
                    <span class="{a.color} group-hover:scale-110 transition-transform">
                        <a.icon width={18} height={18} />
                    </span>
                    <span class="text-sm font-medium text-content-primary">{a.label}</span>
                    <ArrowUpRight width={13} height={13} class="ml-auto text-content-tertiary group-hover:text-content-secondary transition-colors" />
                </a>
            {/each}
        </div>
    </div>

</div>
