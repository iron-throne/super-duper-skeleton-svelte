<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import Topbar from '$components/core/Topbar.svelte';
    import { ArrowRight } from 'svelte-bootstrap-icons';
	import { resolve } from '$app/paths';

    const includedFeatures = [
        { label: 'Authentication System', tag: 'Ready' },
        { label: 'Light & Dark Theme', tag: 'Built-in' },
        { label: 'Internationalization', tag: '8 Languages' },
        { label: 'Component Library', tag: '20+ Items' },
        { label: 'PWA Support', tag: 'Service Worker' },
        { label: 'TypeScript', tag: 'Strict Mode' },
    ];
</script>

<svelte:head>
    <title>{m.home_title()}</title>
    <meta name="description" content={m.home_description()} />
</svelte:head>

<!-- Root -->
<div class="min-h-screen flex flex-col bg-surface-primary text-content-primary overflow-x-hidden">

    <Topbar />

    <!-- HERO -->
    <section class="flex-1 w-full mx-auto px-8 md:px-20 py-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

        <!-- LEFT: Copy -->
        <div class="lg:w-1/2 flex flex-col gap-8">

            <!-- Eyebrow -->
            <div class="flex items-center gap-3">
                <span class="block h-px w-10 bg-accent"></span>
                <span class="text-accent text-xs font-medium tracking-[0.2em] uppercase">{m.hero_eyebrow()}</span>
            </div>

            <!-- Headline -->
            <h1 class="text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-content-primary">
                {m.home_welcome()}
            </h1>

            <!-- Subline -->
            <p class="text-content-secondary text-lg leading-relaxed max-w-xl">
                {m.home_subtitle()}
            </p>

            <!-- CTAs -->
            <div class="flex flex-wrap items-center gap-4">
                <a href={resolve('/register',{})} class="btn btn-primary px-8 py-3.5 text-base font-semibold gap-2 hover:-translate-y-0.5 transition-transform">
                    {m.home_register_btn()}
                    <ArrowRight width={16} height={16} />
                </a>
                <a href={resolve('/login',{})} class="btn btn-secondary px-8 py-3.5 text-base font-semibold hover:-translate-y-0.5 transition-transform">
                    {m.home_login_btn()}
                </a>
            </div>

            <!-- Stats row -->
            <div class="flex gap-8 pt-4 border-t border-border-primary">
                <div>
                    <p class="text-2xl font-bold text-content-primary">{m.hero_stat1_value()}</p>
                    <p class="text-xs text-content-tertiary uppercase tracking-wide mt-0.5">{m.hero_stat1_label()}</p>
                </div>
                <div>
                    <p class="text-2xl font-bold text-content-primary">{m.hero_stat2_value()}</p>
                    <p class="text-xs text-content-tertiary uppercase tracking-wide mt-0.5">{m.hero_stat2_label()}</p>
                </div>
                <div>
                    <p class="text-2xl font-bold text-content-primary">{m.hero_stat3_value()}</p>
                    <p class="text-xs text-content-tertiary uppercase tracking-wide mt-0.5">{m.hero_stat3_label()}</p>
                </div>
            </div>
        </div>

        <!-- RIGHT: Feature preview card -->
        <div class="lg:w-1/2 relative">

            <!-- Dot grid decoration -->
            <div class="absolute -top-8 -right-8 -z-10 grid grid-cols-5 gap-2 opacity-20" aria-hidden="true">
                {#each Array(25) as _, i (i)}
                    <span class="w-1.5 h-1.5 rounded-full bg-accent block"></span>
                {/each}
            </div>

            <!-- Mock browser card -->
            <div class="relative rounded-2xl overflow-hidden shadow-2xl border rotate-1 hover:rotate-0 transition-transform duration-500 bg-surface-secondary">

                <!-- Browser chrome -->
                <div class="flex items-center gap-2 px-4 py-3 bg-surface-tertiary border-b border-border-primary">
                    <span class="w-3 h-3 rounded-full bg-semantic-error block"></span>
                    <span class="w-3 h-3 rounded-full bg-semantic-warning block"></span>
                    <span class="w-3 h-3 rounded-full bg-semantic-success block"></span>
                    <div class="flex-1 h-4 bg-surface-primary/50 rounded-full mx-6"></div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="flex items-end justify-between mb-5">
                        <div>
                            <p class="text-content-tertiary text-xs tracking-widest uppercase mb-0.5">{m.hero_featured_label()}</p>
                            <p class="text-content-primary font-semibold text-lg leading-tight">{m.hero_artwork_title()}</p>
                        </div>
                        <div class="bg-warning text-content-primary px-4 py-2 rounded-full flex flex-col items-center shadow-lg">
                            <span class="text-[0.55rem] uppercase tracking-widest opacity-70 leading-none">{m.hero_price_from()}</span>
                            <span class="font-bold text-base leading-tight">{m.hero_price()}</span>
                        </div>
                    </div>

                    <!-- Feature rows -->
                    <div class="flex flex-col">
                        {#each includedFeatures as feat, i (feat.label)}
                            <div class="flex items-center gap-3 py-2.5 {i < includedFeatures.length - 1 ? 'border-b border-border-primary' : ''}">
                                <span class="w-1.5 h-1.5 rounded-full bg-accent shrink-0 block"></span>
                                <span class="text-sm text-content-primary flex-1">{feat.label}</span>
                                <span class="text-xs bg-surface-tertiary text-content-tertiary px-2 py-0.5 rounded-full whitespace-nowrap">{feat.tag}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Floating card: auth -->
            <div class="absolute -top-5 -left-6 bg-surface-primary border rounded-xl p-4 shadow-xl flex items-center gap-3 w-44">
                <span class="text-accent text-lg shrink-0">✦</span>
                <div>
                    <p class="text-content-primary font-semibold text-sm leading-tight">{m.hero_card1_title()}</p>
                    <p class="text-content-tertiary text-xs mt-0.5">{m.hero_card1_subtitle()}</p>
                </div>
            </div>

            <!-- Floating card: theme -->
            <div class="absolute -bottom-5 -right-6 bg-surface-primary border rounded-xl p-4 shadow-xl flex items-center gap-3 w-44">
                <span class="text-warning text-lg shrink-0">◈</span>
                <div>
                    <p class="text-content-primary font-semibold text-sm leading-tight">{m.hero_card2_title()}</p>
                    <p class="text-content-tertiary text-xs mt-0.5">{m.hero_card2_subtitle()}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- FEATURES GRID -->
    <section class="w-full px-8 md:px-20 pb-20">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <!-- Auth -->
            <div class="bg-surface-secondary border rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 group">
                <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <svg class="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <h3 class="text-content-primary font-semibold mb-2">Authentication</h3>
                <p class="text-content-secondary text-sm leading-relaxed">Login, register, forgot & reset password flows with server-side session management.</p>
            </div>

            <!-- Theme -->
            <div class="bg-surface-secondary border rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 group">
                <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <svg class="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
                    </svg>
                </div>
                <h3 class="text-content-primary font-semibold mb-2">Theming System</h3>
                <p class="text-content-secondary text-sm leading-relaxed">Light and dark themes using CSS variables, with persistent user preference storage.</p>
            </div>

            <!-- i18n -->
            <div class="bg-surface-secondary border rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300 group">
                <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <svg class="size-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                </div>
                <h3 class="text-content-primary font-semibold mb-2">Internationalization</h3>
                <p class="text-content-secondary text-sm leading-relaxed">8 languages out of the box with Paraglide. RTL-aware layout support included.</p>
            </div>
        </div>
    </section>

    <!-- MARQUEE STRIP -->
    <div class="sticky flex-none bottom-0 z-40 border-t border-border-primary bg-surface-primary/80 backdrop-blur-sm overflow-hidden py-3">
        <div class="flex gap-10 w-max marquee-track items-center">
            {#each Array(8) as _, i (i)}
                <span class="text-content-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_1()}</span>
                <span class="text-accent text-xs">✦</span>
                <span class="text-content-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_2()}</span>
                <span class="text-accent text-xs">◈</span>
                <span class="text-content-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_3()}</span>
                <span class="text-accent text-xs">✦</span>
                <span class="text-content-tertiary text-xs tracking-[0.18em] uppercase whitespace-nowrap">{m.marquee_4()}</span>
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
