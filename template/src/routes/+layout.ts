import { PUBLIC_CONFIG_ENV, PUBLIC_BASE_PATH } from "$env/static/public";
import { configStore } from "$lib/stores/config.svelte.js";
import { snackStore } from "$lib/stores/snackbar.svelte.js";
import { ESnackType } from "@aryagg/types";
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
    const configEnv = PUBLIC_CONFIG_ENV; // runtime value

    if (!configEnv) {
        console.log("PUBLIC_CONFIG_ENV not available");
        snackStore.show({
            type: ESnackType.DANGER,
            message: "Configuration environment missing"
        });
        return;
    }

    try {
        const res = await fetch(`${PUBLIC_BASE_PATH}/config/config.${configEnv}.json`);

        if (!res.ok) {
            throw new Error(`Failed to load config.${configEnv}.json`);
        }

        const json = await res.json();
        configStore.set(json);

    } catch (err) {
        console.error(err);
        snackStore.show({
            type: ESnackType.DANGER,
            message: "Failed to load configuration"
        });
    }
}