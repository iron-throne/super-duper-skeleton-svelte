import { ESnackType, type ISnackData } from '$lib/types';

let _snackbar = $state<ISnackData | null>(null);

const DEFAULT_TIMEOUT = 3000;

function show(data: ISnackData): void {
    _snackbar = data;
}

function error(message: string, timeOut = DEFAULT_TIMEOUT): void {
    _snackbar = { message, type: ESnackType.DANGER, timeOut };
}

function warning(message: string, timeOut = DEFAULT_TIMEOUT): void {
    _snackbar = { message, type: ESnackType.WARNING, timeOut };
}

function success(message: string, timeOut = DEFAULT_TIMEOUT): void {
    _snackbar = { message, type: ESnackType.SUCCESS, timeOut };
}

function info(message: string, timeOut = DEFAULT_TIMEOUT): void {
    _snackbar = { message, type: ESnackType.INFO, timeOut };
}

function close(): void {
    _snackbar = null;
}

export const snackStore = {
    get current() {
        return _snackbar;
    },
    show,
    error,
    warning,
    success,
    info,
    close
};