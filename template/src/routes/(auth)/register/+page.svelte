<script lang="ts">
    import { t } from '$shared/i18n'
    import { Eye, EyeSlash } from 'svelte-bootstrap-icons';
    import { resolve } from '$app/paths';

    let name = $state('');
    let email = $state('');
    let password = $state('');
    let confirm = $state('');
    let showPassword = $state(false);
    let showConfirm = $state(false);

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        // TODO: wire up registration logic
    };
</script>

<svelte:head>
    <title>{$t('register_title')}</title>
</svelte:head>

<div class="min-h-screen bg-surface-tertiary flex items-center justify-center px-4 py-12">

    <!-- Ambient blobs -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute w-96 h-96 rounded-full bg-accent/5 -top-32 -right-32 blur-3xl"></div>
        <div class="absolute w-80 h-80 rounded-full bg-warning/5 -bottom-24 -left-24 blur-3xl"></div>
    </div>

    <div class="w-full max-w-md">

        <!-- Logo -->
        <a href={resolve("/",{})} class="flex items-center justify-center gap-2 mb-8">
            <span class="text-accent text-xl leading-none">✦</span>
            <span class="font-semibold text-content-primary tracking-wide text-lg">{$t('app_name')}</span>
        </a>

        <!-- Card -->
        <div class="bg-surface-primary rounded-2xl shadow-xl border  p-8">

            <!-- Heading -->
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold text-content-primary mb-1">{$t('register_title')}</h1>
                <p class="text-sm text-content-secondary">{$t('register_subtitle')}</p>
            </div>

            <form onsubmit={handleSubmit} class="flex flex-col gap-5">

                <!-- Full Name -->
                <div class="flex flex-col gap-1.5">
                    <label for="name" class="text-sm font-medium text-content-primary">
                        {$t('register_name_label')}
                    </label>
                    <input
                        id="name"
                        type="text"
                        bind:value={name}
                        placeholder={$t('register_name_placeholder')}
                        required
                        autocomplete="name"
                        class="w-full px-4 py-2.5 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                </div>

                <!-- Email -->
                <div class="flex flex-col gap-1.5">
                    <label for="email" class="text-sm font-medium text-content-primary">
                        {$t('register_email_label')}
                    </label>
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder={$t('register_email_placeholder')}
                        required
                        autocomplete="email"
                        class="w-full px-4 py-2.5 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                </div>

                <!-- Password -->
                <div class="flex flex-col gap-1.5">
                    <label for="password" class="text-sm font-medium text-content-primary">
                        {$t('register_password_label')}
                    </label>
                    <div class="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            bind:value={password}
                            placeholder={$t('register_password_placeholder')}
                            required
                            autocomplete="new-password"
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

                <!-- Confirm Password -->
                <div class="flex flex-col gap-1.5">
                    <label for="confirm" class="text-sm font-medium text-content-primary">
                        {$t('register_confirm_label')}
                    </label>
                    <div class="relative">
                        <input
                            id="confirm"
                            type={showConfirm ? 'text' : 'password'}
                            bind:value={confirm}
                            placeholder={$t('register_confirm_placeholder')}
                            required
                            autocomplete="new-password"
                            class="w-full px-4 py-2.5 pr-11 rounded-lg border  bg-surface-secondary text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                        />
                        <button
                            type="button"
                            onclick={() => showConfirm = !showConfirm}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition"
                            aria-label="Toggle confirm password visibility"
                        >
                            {#if showConfirm}
                                <EyeSlash width={16} height={16} />
                            {:else}
                                <Eye width={16} height={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-primary w-full py-3 text-base font-semibold mt-1">
                    {$t('register_submit')}
                </button>

            </form>

            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-border-primary"></div>
                </div>
                <div class="relative flex justify-center text-xs">
                    <span class="px-3 bg-surface-primary text-content-tertiary">{$t('divider_text')}</span>
                </div>
            </div>

            <!-- Sign in link -->
            <p class="text-center text-sm text-content-secondary">
                {$t('register_have_account')}
                <a href={resolve("/login",{})} class="text-accent font-medium hover:underline ml-1">{$t('register_sign_in')}</a>
            </p>

        </div>
    </div>
</div>
