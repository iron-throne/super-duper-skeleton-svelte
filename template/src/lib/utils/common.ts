import { REGEX } from "$lib/constants/common";

export function isEmail(value: string): boolean {
	return REGEX.EMAIL.test(value);
}

export function isPhone(value: string): boolean {
	return REGEX.PHONE.test(value);
}

export function isNumeric(value: string): boolean {
	return !isNaN(Number(value)) && value.trim() !== '';
}
export function isInRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

export function hasMinLength(value: string, min: number): boolean {
	return value.trim().length >= min;
}

export function hasMaxLength(value: string, max: number): boolean {
	return value.trim().length <= max;
}


