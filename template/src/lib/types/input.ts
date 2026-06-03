import type { Component } from "svelte";

export interface IFormField {
    key: string; // uniq
    id: string; // for html 'id' attribute
    label: string;
    hideLabel?: boolean;
    placeholder?: string;
    type: EInputType;
    value?: InputValue;
    icon?: Component;
    helperText?: string;
    required?: boolean;
    rules?: Array<IValidationRule>;
    attributes?: Record<string, string | number | boolean>;
    disabled?: boolean;
    readOnly?: boolean;
    classes?: string;
    options?: Array<ISelectOption>; // for select, radio, etc.
    multiple?: boolean; // file or select
    errorMsg?: string; // validation error message
    onChange?: (value: any) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onInput?: () => void;
}

export interface ISelectOption {
    label: string; value: any, icon?: any
}
export interface IValidationRule {
    regex: RegExp; message: string
}


export enum EInputType {
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    NUMBER = "number",
    SEARCH = "search",
    TEL = "tel",
    URL = "url",
    DATE = "date",
    TIME = "time",
    DATETIME_LOCAL = "datetime-local",
    MONTH = "month",
    WEEK = "week",
    FILE = "file",
    IMAGE = "image",
    COLOR = "color",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    RANGE = "range",
    HIDDEN = "hidden",
    SELECT = "select",
    MULTISELECT = "multiselect",
    MULTISELECT_ADDNEW = "multiselect_add_new",
    SELECT_ADDNEW = "select_add_new",
    RICHTEXT = "richtext",
}

export type InputValue = string | number | boolean | File | File[] | null;

