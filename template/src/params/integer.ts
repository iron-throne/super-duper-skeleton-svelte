import { REGEX } from "$lib/constants/common";

export const match = ((param: string) => {
    return REGEX.NUMBER.test(param);
})