export interface IToast {
    id: number;
    message: string;
    type: ESnackType;
}

export enum ESnackType {
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
    INFO = 'info',
}

export interface ISnackData {
    message: string;
    type: ESnackType;
    timeOut?: number;
    class?: string;
}

export enum ETheme {
    LIGHT = 'light',
    DARK = 'dark'
}

export interface IGenericObject {
    [key: string]: any;
}

export interface Tab {
    id: string;
    label: string;
    badge?: string | number;
    disabled?: boolean;
    icon?: any;
}
