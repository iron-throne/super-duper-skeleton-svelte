<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { enhance } from '$app/forms';
    import { Eye, EyeSlash } from 'svelte-bootstrap-icons';
    import { resolve } from '$app/paths';

    let { form }: { form?: { error?: string } | null } = $props();

    let showPassword = $state(false);
    let loading      = $state(false);
</script>

<svelte:head>
    <title>{m.login_title()}</title>
</svelte:head>

<div class="min-h-screen bg-surface-tertiary flex items-center justify-center px-4 py-12">

    <!-- Ambient blobs -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute w-96 h-96 rounded-full bg-accent/5 -top-32 -left-32 blur-3xl"></div>
        <div class="absolute w-80 h-80 rounded-full bg-info/5 -bottom-24 -right-24 blur-3xl"></div>
    </div>

    <div class="w-full max-w-md">

        <!-- Logo -->
        <a href={resolve("/",{})} class="flex items-center justify-center gap-2 mb-8">
            <span class="text-accent text-xl leading-none">✦</span>
            <span class="font-semibold text-content-primary tracking-wide text-lg">{m.app_name()}</span>
        </a>

        <!-- Card -->
        <div class="bg-surface-primary rounded-2xl shadow-xl border  p-8">

            <!-- Heading -->
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold text-content-primary mb-1">{m.login_title()}</h1>
                <p class="text-sm text-content-secondary">{m.login_subtitle()}</p>
            </div>

            <!-- Server error -->
            {#if form?.error}
                <div class="mb-5 px-4 py-3 rounded-lg bg-error/10 border border-error/30 text-sm text-error">
                    {form.error}
                </div>
            {/if}

            <form
                method="POST"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
                class="flex flex-col gap-5"
            >

                <!-- Email -->
                <div class="flex flex-col gap-1.5">
                    <label for="email" class="text-sm font-medium text-content-primary">
                        {m.register_email_label()}
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={m.register_email_placeholder()}
                        required
                        autocomplete="email"
                        class="w-full px-4 py-2.5 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                </div>

                <!-- Password -->
                <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                        <label for="password" class="text-sm font-medium text-content-primary">
                            {m.register_password_label()}
                        </label>
                        <a href={resolve("/forgot-password",{})} class="text-xs text-accent hover:underline">
                            {m.login_forgot_password()}
                        </a>
                    </div>
                    <div class="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={m.register_password_placeholder()}
                            required
                            autocomplete="current-password"
                            class="w-full px-4 py-2.5 pr-11 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                        />
                        <button
                            type="button"
                            onclick={() => showPassword = !showPassword}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition"
                            aria-label="Toggle password visibility"
                        >
                            {#if showPassword}
                                <EyeSlash width={16} height={16} />
                            {:else}
                                <Eye width={16} height={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Remember me -->
                <label class="flex items-center gap-2.5 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        class="w-4 h-4 rounded  accent-accent cursor-pointer"
                    />
                    <span class="text-sm text-content-secondary group-hover:text-content-primary transition">
                        {m.login_remember_me()}
                    </span>
                </label>

                <!-- Submit -->
                <button
                    type="submit"
                    disabled={loading}
                    class="btn btn-primary w-full py-3 text-base font-semibold mt-1 disabled:opacity-60"
                >
                    {#if loading}
                        <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {/if}
                    {m.login_submit()}
                </button>

            </form>

            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-border-primary"></div>
                </div>
                <div class="relative flex justify-center text-xs">
                    <span class="px-3 bg-surface-primary text-content-tertiary">{m.divider_text()}</span>
                </div>
            </div>

            <!-- Sign up link -->
            <p class="text-center text-sm text-content-secondary">
                {m.login_no_account()}
                <a href={resolve("/register",{})} class="text-accent font-medium hover:underline ml-1">{m.login_sign_up()}</a>
            </p>

        </div>
    </div>
</div>
