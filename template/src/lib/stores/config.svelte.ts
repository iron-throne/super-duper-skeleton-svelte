import type { IConfig } from "@aryagg/types";

let _config = $state<IConfig>({} as IConfig);

const set = (cfg: IConfig) => {
    _config = cfg;
}

export const configStore = {
    get config() {
        return _config;
    },
    set,
};
