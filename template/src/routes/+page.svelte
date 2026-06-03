<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import Header from '$lib/components/shared/Header.svelte';
    import { ArrowRight } from 'svelte-bootstrap-icons';
</script>

<svelte:head>
    <title>{m.home_title()}</title>
    <meta name="description" content={m.home_description()} />
</svelte:head>

<!-- Root -->
<div class="min-h-screen flex flex-col bg-surface-primary text-content-primary overflow-x-hidden">

    <Header />
    <!-- ── HERO ── -->
    <section class="flex-1 w-full mx-auto px-20 py-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

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
            <p class="text-content-secondary text-lg leading-relaxed max-w-[38ch]">
                {m.home_subtitle()}
            </p>

            <!-- CTAs -->
            <div class="flex flex-wrap items-center gap-4">
                <a href="/register" class="btn btn-primary px-8 py-3.5 text-base font-semibold gap-2 hover:-translate-y-0.5 transition-transform">
                    {m.home_register_btn()}
                    <ArrowRight width={16} height={16} />
                </a>
                <a href="/login" class="btn btn-secondary px-8 py-3.5 text-base font-semibold hover:-translate-y-0.5 transition-transform">
                    {m.home_login_btn()}
                </a>
            </div>
        </div>

        <!-- RIGHT: Artwork composition -->
        <div class="lg:w-1/2 relative">

            <!-- Dot grid decoration -->
            <div class="absolute -top-8 -right-8 -z-10 grid grid-cols-5 gap-2 opacity-20" aria-hidden="true">
                {#each Array(25) as _}
                    <span class="w-1.5 h-1.5 rounded-full bg-accent block"></span>
                {/each}
            </div>

            <!-- Main image card -->
            <div class="relative rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                    src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85"
                    alt="Abstract Art"
                    class="w-full aspect-4/5 object-cover"
                />
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-linear-to-t from-surface-tertiary/60 via-transparent to-transparent"></div>

                <!-- Bottom info on image -->
                <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                        <p class="text-surface-primary/70 text-xs tracking-widest uppercase mb-0.5">{m.hero_featured_label()}</p>
                        <p class="text-surface-primary font-semibold text-lg leading-tight">{m.hero_artwork_title()}</p>
                    </div>
                    <!-- Price badge -->
                    <div class="bg-warning text-content-primary px-4 py-2 rounded-full flex flex-col items-center shadow-lg">
                        <span class="text-[0.55rem] uppercase tracking-widest opacity-70 leading-none">{m.hero_price_from()}</span>
                        <span class="font-bold text-lg leading-tight">{m.hero_price()}</span>
                    </div>
                </div>
            </div>

            <!-- Floating card: Original -->
            <div class="absolute -top-5 -left-6 bg-surface-primary border  rounded-xl p-4 shadow-xl flex items-center gap-3 w-44">
                <span class="text-accent text-lg shrink-0">✦</span>
                <div>
                    <p class="text-content-primary font-semibold text-sm leading-tight">{m.hero_card1_title()}</p>
                    <p class="text-content-tertiary text-xs mt-0.5">{m.hero_card1_subtitle()}</p>
                </div>
            </div>

            <!-- Floating card: Edition -->
            <div class="absolute -bottom-5 -right-6 bg-surface-primary border  rounded-xl p-4 shadow-xl flex items-center gap-3 w-44">
                <span class="text-warning text-lg shrink-0">◈</span>
                <div>
                    <p class="text-content-primary font-semibold text-sm leading-tight">{m.hero_card2_title()}</p>
                    <p class="text-content-tertiary text-xs mt-0.5">{m.hero_card2_subtitle()}</p>
                </div>
            </div>
        </div>

    </section>
    <!-- ── MARQUEE STRIP ── -->
    <div class="sticky flex-none bottom-0 z-40 border-t  bg-surface-primary/80 backdrop-blur-sm overflow-hidden py-3">
        <div class="flex gap-10 w-max marquee-track items-center">
            {#each Array(8) as _}
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