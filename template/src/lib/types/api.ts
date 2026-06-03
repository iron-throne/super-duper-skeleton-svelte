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

/** Serialized request stored in the offline sync queue */
export interface IAPIQueuePayload {
    url: string;
    method: string;
    data?: unknown;
    headers?: any;
    isFormData?: boolean; // Indicates if data is FormData, so it can be properly serialized/deserialized
}
