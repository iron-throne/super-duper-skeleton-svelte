export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/** Request timeout in milliseconds (30 s). Applies to all axios requests. */
export const API_TIMEOUT = 30_000; // ms

/** Query param that signals the service worker to cache the response. */
export const URL_PARAM_CACHE="sw-cache";
export const SW_CACHE_PARAM = URL_PARAM_CACHE + '=true';
export const SW_CACHE_PARAM_FALSE = URL_PARAM_CACHE + '=false';

export enum HttpMethod {
    GET    = 'GET',
    POST   = 'POST',
    PUT    = 'PUT',
    PATCH  = 'PATCH',
    DELETE = 'DELETE'
}

export interface IApiResult<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
  status?: number;
  queued?: boolean;
}
export interface ApiOptions {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  showToast?: boolean;
  queue?: boolean;
  signal?: AbortSignal;
}