import type { ISelectOption } from "./input";

export interface IRichTextIcon {
    title: string;
    icon: string;
    command: string;
}
export interface IFormatOptions extends IRichTextIcon {
    type: 'select' | 'color';
    options?: ISelectOption[];
    id?: string;
}
export type TextFormatKeys = 'formatBlock' | 'fontSize' | 'foreColor' | 'hiliteColor';
export interface ITextFormat {
    formatBlock: string;
    fontSize: string;
    foreColor: string;
    hiliteColor: string;
}
