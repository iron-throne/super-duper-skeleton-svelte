<script lang="ts">
    import { page } from '$app/state';
	import { HttpStatus } from '$lib/api/types';
    import { LightbulbOff } from 'svelte-bootstrap-icons';

    const status = $derived(page.status);
    const message = $derived(page.error?.message ?? 'An unexpected error occurred');

    const title = $derived(
        status === HttpStatus.NOT_FOUND
            ? "LOOKS LIKE YOU'RE LOST"
            : status === HttpStatus.FORBIDDEN
            ? "ACCESS DENIED"
            : status === HttpStatus.INTERNAL_SERVER_ERROR
            ? "SOMETHING BROKE"
            : "SOMETHING WENT WRONG"
    );

    const hint = $derived(
        status === HttpStatus.NOT_FOUND
            ? "The page you are looking for is not available!"
            : status === HttpStatus.FORBIDDEN
            ? "You don't have permission to view this resource."
            : status === HttpStatus.INTERNAL_SERVER_ERROR
            ? "Our servers ran into an issue. Please try again in a moment."
            : message
    );
</script>

<svelte:head>
    <title>Error {status}</title>
</svelte:head>

<main class="flex min-h-screen flex-col bg-white">
    <!-- Main content -->
    <div class="flex flex-1 items-center justify-center px-8 pb-16">
        <div class="flex flex-col items-center gap-16 md:flex-row md:gap-24">

            <!-- Left: Icon in circle -->
            <div class="shrink-0">
                <div class="flex h-72 w-72 items-center justify-center rounded-full bg-red-50">
                    <div class="text-error opacity-90 animate-bounce duration-300" >
                        <LightbulbOff width={140} height={140} />
                    </div>
                </div>
            </div>

            <!-- Right: Text content -->
            <div class="flex flex-col gap-4 items-center ">
                <!-- Big status number -->
                <p
                    class="leading-none text-error select-none text-[clamp(6rem,15vw,11rem)] "
                >
                    {status}
                </p>

                <!-- Title -->
                <h1 class="text-lg font-bold uppercase tracking-widest text-content-secondary">
                    {title}
                </h1>

                <!-- Hint -->
                <p class="font-light italic text-gray-400" >
                    {hint}
                </p>

                <!-- CTA -->
                <div class="mt-10 flex items-center gap-8">
                    <a
                        href="/"
                        class="btn btn-primary"
                    >
                        GO TO HOME
                        <span class="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </a>

                    <button
                        onclick={() => history.back()}
                        class="btn btn-secondary"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
    }
</style>