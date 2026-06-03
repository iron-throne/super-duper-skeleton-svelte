import { REGEX } from "$lib/constants/common";
import { EDataType } from "$lib/types";

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


export function parseInputValue(value: unknown, type?: EDataType) {
	if (!value || !type) return value; // handle null, undefined, empty string
	switch (type) {
		case EDataType.NUMBER:
			return typeof value === "number" ? value : Number(value);

		case EDataType.STRING:
			return String(value ?? "");

		case EDataType.BOOLEAN:
			return value === true || value === "true" || value === 1 || value === "1";

		case EDataType.DATE:
			return value instanceof Date ? value : new Date(value as string);

		case EDataType.ARRAY:
			return Array.isArray(value) ? value : String(value).split(",");

	}

	return value; // fallback
}