/** Raw response body shape returned by the backend API */
export interface IApiResult<T = unknown> {
    status: boolean;
    message: string;
    result?: T;
}

/** Standardized response envelope returned to all callers */
export interface IApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T | null;
}

