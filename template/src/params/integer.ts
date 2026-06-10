import { REGEX } from "@aryagg/types";

export const match = ((param: string) => {
    return REGEX.NUMBER.test(param);
})