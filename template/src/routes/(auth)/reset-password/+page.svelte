<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { page } from '$app/state';
    import { Eye, EyeSlash, ExclamationCircleFill } from 'svelte-bootstrap-icons';

    // Token comes from ?token=... query param (emailed link)
    const token = $derived(page.url.searchParams.get('token') ?? '');

    let password = $state('');
    let confirm = $state('');
    let showPassword = $state(false);
    let showConfirm = $state(false);
    let error = $state('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        error = '';
        if (!token) {
            error = 'Invalid or missing reset link.';
            return;
        }
        if (password !== confirm) {
            error = 'Passwords do not match.';
            return;
        }
        // TODO: call authApi.resetPassword({ token, password, confirmPassword: confirm })
    };
</script>

<svelte:head>
    <title>{m.reset_title()}</title>
</svelte:head>

<div class="min-h-screen bg-surface-tertiary flex items-center justify-center px-4 py-12">

    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute w-80 h-80 rounded-full bg-accent/5 -bottom-24 -left-24 blur-3xl"></div>
    </div>

    <div class="w-full max-w-md">

        <a href="/" class="flex items-center justify-center gap-2 mb-8">
            <span class="text-accent text-xl leading-none">✦</span>
            <span class="font-semibold text-content-primary tracking-wide text-lg">{m.app_name()}</span>
        </a>

        <div class="bg-surface-primary rounded-2xl shadow-xl border  p-8">

            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold text-content-primary mb-1">{m.reset_title()}</h1>
                <p class="text-sm text-content-secondary">{m.reset_subtitle()}</p>
            </div>

            <form onsubmit={handleSubmit} class="flex flex-col gap-5">

                <!-- New password -->
                <div class="flex flex-col gap-1.5">
                    <label for="password" class="text-sm font-medium text-content-primary">
                        {m.reset_new_label()}
                    </label>
                    <div class="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            bind:value={password}
                            placeholder={m.reset_new_placeholder()}
                            required
                            autocomplete="new-password"
                            class="w-full px-4 py-2.5 pr-11 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                        />
                        <button type="button" onclick={() => showPassword = !showPassword}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition"
                            aria-label="Toggle visibility">
                            {#if showPassword}
                                <EyeSlash width={16} height={16} />
                            {:else}
                                <Eye width={16} height={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Confirm password -->
                <div class="flex flex-col gap-1.5">
                    <label for="confirm" class="text-sm font-medium text-content-primary">
                        {m.reset_confirm_label()}
                    </label>
                    <div class="relative">
                        <input
                            id="confirm"
                            type={showConfirm ? 'text' : 'password'}
                            bind:value={confirm}
                            placeholder={m.reset_confirm_placeholder()}
                            required
                            autocomplete="new-password"
                            class="w-full px-4 py-2.5 pr-11 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                        />
                        <button type="button" onclick={() => showConfirm = !showConfirm}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition"
                            aria-label="Toggle visibility">
                            {#if showConfirm}
                                <EyeSlash width={16} height={16} />
                            {:else}
                                <Eye width={16} height={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Inline error -->
                {#if error}
                    <p class="text-xs text-error flex items-center gap-1.5">
                        <ExclamationCircleFill width={12} height={12} />
                        {error}
                    </p>
                {/if}

                <button type="submit" class="btn btn-primary w-full py-3 text-base font-semibold mt-1">
                    {m.reset_submit()}
                </button>

            </form>

        </div>
    </div>
</div>
