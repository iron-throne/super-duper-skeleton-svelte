<script lang="ts">
    import { t } from '$shared/i18n';
    import { resolve } from '$app/paths';
    import { EnvelopeFill } from 'svelte-bootstrap-icons';

    let email = $state('');
    let submitted = $state(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        // TODO: call authApi.forgotPassword(email)
        submitted = true;
    };
</script>

<svelte:head>
    <title>{$t('forgot_title')}</title>
</svelte:head>

<div class="min-h-screen bg-surface-tertiary flex items-center justify-center px-4 py-12">

    <!-- Ambient blob -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute w-96 h-96 rounded-full bg-accent/5 top-0 right-0 blur-3xl"></div>
    </div>

    <div class="w-full max-w-md">

        <!-- Logo -->
        <a href={resolve("/",{})} class="flex items-center justify-center gap-2 mb-8">
            <span class="text-accent text-xl leading-none">✦</span>
            <span class="font-semibold text-content-primary tracking-wide text-lg">{$t('app_name')}</span>
        </a>

        <div class="bg-surface-primary rounded-2xl shadow-xl border  p-8">

            {#if submitted}
                <!-- Success state -->
                <div class="flex flex-col items-center gap-4 text-center py-4">
                    <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                        <EnvelopeFill width={32} height={32} class="text-success" />
                    </div>
                    <h2 class="text-xl font-bold text-content-primary">{$t('forgot_sent')}</h2>
                    <p class="text-sm text-content-secondary">{$t('forgot_sent_hint')}</p>
                    <a href={resolve("/login",{})} class="btn btn-primary mt-4 w-full py-2.5">{$t('forgot_back')}</a>
                </div>

            {:else}
                <!-- Form state -->
                <div class="mb-8 text-center">
                    <h1 class="text-2xl font-bold text-content-primary mb-1">{$t('forgot_title')}</h1>
                    <p class="text-sm text-content-secondary">{$t('forgot_subtitle')}</p>
                </div>

                <form onsubmit={handleSubmit} class="flex flex-col gap-5">
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

                    <button type="submit" class="btn btn-primary w-full py-3 text-base font-semibold mt-1">
                        {$t('forgot_submit')}
                    </button>
                </form>

                <p class="mt-6 text-center text-sm">
                    <a href={resolve("/login",{})} class="text-accent hover:underline">{$t('forgot_back')}</a>
                </p>
            {/if}

        </div>
    </div>
</div>
