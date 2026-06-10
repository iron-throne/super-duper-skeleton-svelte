<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import Topbar from '$components/core/Topbar.svelte';
    import {
        ArrowRight,
        LightningCharge,
        ShieldLock,
        Sun,
        Globe2,
        Grid3x3Gap,
        CodeSlash,
    } from 'svelte-bootstrap-icons';
    import { resolve } from '$app/paths';

    const features = [
        {
            title: 'Authentication',
            desc: 'Login, register, forgot & reset password flows with server-side session management.',
            tag: 'Ready',
            href: resolve('/register', {}),
            icon: ShieldLock,
        },
        {
            title: 'Theming System',
            desc: 'Light and dark themes using CSS variables with persistent user preference storage.',
            tag: 'Built-in',
            href: null,
            icon: Sun,
        },
        {
            title: 'Internationalization',
            desc: '8 languages out of the box with Paraglide. RTL-aware layout support included.',
            tag: '8 Languages',
            href: null,
            icon: Globe2,
        },
        {
            title: 'Component Library',
            desc: 'Over 20 pre-built UI components ready to use and customise across your app.',
            tag: '20+ Items',
            href: null,
            icon: Grid3x3Gap,
        },
        {
            title: 'TypeScript',
            desc: 'Strict TypeScript throughout — full type safety from routes to components.',
            tag: 'Strict Mode',
            href: null,
            icon: CodeSlash,
        },
    ];
</script>

<svelte:head>
    <title>{m.home_title()}</title>
    <meta name="description" content={m.home_description()} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-surface-primary text-primary overflow-x-hidden">

    <Topbar />

    
    <!-- HERO -->
    <section class="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        <!-- Logo mark -->
        <div class="relative mb-10">
            <div class="absolute inset-0 rounded-full bg-accent/15 blur-3xl scale-[2.5] pointer-events-none"></div>
            <div class="relative w-20 h-20 rounded-3xl bg-accent flex items-center justify-center shadow-2xl rotate-12">
                <span class="-rotate-12 text-on-accent">
                    <LightningCharge width={36} height={36} />
                </span>
            </div>
        </div>

        <!-- Eyebrow badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-[0.15em] uppercase mb-7">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            {m.hero_eyebrow()}
        </div>

        <!-- Heading -->
        <h1 class="text-5xl md:text-7xl font-bold leading-[1.06] tracking-tight text-primary mb-5 max-w-2xl">
            {m.home_welcome()}
        </h1>

        <!-- Subtitle -->
        <p class="text-secondary text-lg md:text-xl leading-relaxed max-w-md mb-10">
            {m.home_subtitle()}
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-14">
            <a
                href={resolve('/register', {})}
                class="no-underline inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-on-accent font-semibold text-base transition-all duration-200 shadow-lg hover:opacity-90 hover:-translate-y-0.5"
            >
                {m.home_register_btn()}
                <ArrowRight width={15} height={15} />
            </a>
            <a
                href={resolve('/login', {})}
                class="no-underline inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-accent/40 text-accent hover:bg-accent/10 font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
            >
                {m.home_login_btn()}
            </a>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-6 sm:gap-10">
            <div>
                <p class="text-2xl font-bold text-primary">{m.hero_stat1_value()}</p>
                <p class="text-[11px] text-tertiary uppercase tracking-widest mt-1">{m.hero_stat1_label()}</p>
            </div>
            <div class="w-px h-8 bg-border-primary"></div>
            <div>
                <p class="text-2xl font-bold text-primary">{m.hero_stat2_value()}</p>
                <p class="text-[11px] text-tertiary uppercase tracking-widest mt-1">{m.hero_stat2_label()}</p>
            </div>
            <div class="w-px h-8 bg-border-primary"></div>
            <div>
                <p class="text-2xl font-bold text-primary">{m.hero_stat3_value()}</p>
                <p class="text-[11px] text-tertiary uppercase tracking-widest mt-1">{m.hero_stat3_label()}</p>
            </div>
        </div>
    </section>

    <!-- FEATURES GRID -->
    <section class="w-full max-w-5xl mx-auto px-6 pb-24">

        <!-- Section divider label -->
        <div class="flex items-center gap-4 mb-8">
            <span class="h-px flex-1 bg-linear-to-r from-transparent to-accent/30"></span>
            <span class="section-label text-accent">What's Included</span>
            <span class="h-px flex-1 bg-linear-to-l from-transparent to-accent/30"></span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each features as f, i (i)}
                <div class="group flex items-start gap-4 p-5 rounded-2xl bg-surface-secondary border border-border-primary hover:border-accent/40 hover:bg-accent/3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">

                    <!-- Icon bubble -->
                    <div class="flex-none w-10 h-10 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors shrink-0 text-accent">
                        <svelte:component this={f.icon} width={20} height={20} />
                    </div>

                    <!-- Text -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <h3 class="text-sm font-semibold text-primary">{f.title}</h3>
                            <span class="flex-none text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">{f.tag}</span>
                        </div>
                        <p class="text-xs text-secondary leading-relaxed">{f.desc}</p>
                        {#if f.href}
                            <a href={f.href} class="no-underline inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent hover:gap-2 transition-all">
                                Get started <ArrowRight width={11} height={11} />
                            </a>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- MARQUEE STRIP — unchanged -->
    <div class="sticky flex-none bottom-0 z-40 border-t border-border-primary bg-surface-primary/80 backdrop-blur-sm overflow-hidden py-3">
        <div class="flex gap-10 w-max marquee-track items-center">
            {#each [0,1,2,3,4,5,6,7] as i (i)}
                <span class="text-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_1()}</span>
                <span class="text-accent text-xs">✦</span>
                <span class="text-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_2()}</span>
                <span class="text-accent text-xs">◈</span>
                <span class="text-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_3()}</span>
                <span class="text-accent text-xs">✦</span>
                <span class="text-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_4()}</span>
                <span class="text-accent text-xs">◈</span>
            {/each}
        </div>
    </div>

</div>

<style>
    .marquee-track {
        animation: marquee 28s linear infinite;
    }
    @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
    }
</style>
