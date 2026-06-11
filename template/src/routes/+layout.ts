import { PUBLIC_CONFIG_ENV, PUBLIC_BASE_PATH } from "$env/static/public";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
    if (!PUBLIC_CONFIG_ENV) {
        console.error("PUBLIC_CONFIG_ENV is not set");
        return { config: null, configError: "Configuration environment missing" };
    }

    try {
        const res = await fetch(`${PUBLIC_BASE_PATH}/config/config.${PUBLIC_CONFIG_ENV}.json`);

        if (!res.ok) {
            throw new Error(`Failed to load config.${PUBLIC_CONFIG_ENV}.json`);
        }

        const config = await res.json();
        return { config, configError: null };

    } catch (err) {
        console.error(err);
        return { config: null, configError: "Failed to load configuration" };
    }
};