import { isAxiosError, type AxiosInstance } from "axios";
import type { IApiResult, IApiResponse, IAPIQueuePayload } from "$lib/types";
import { snackStore } from "$lib/stores/snackbar.svelte";
import { addToQueue } from "$lib/sync-queue";
import { axiosConfig } from "./axiosClient";
import { URL_PARAM_CACHE } from "./types";

const { error: showError, warning: showWarning } = snackStore;
// ─── Core response handler ────────────────────────────────────────────────────

async function handleResponse<T>(
  requestFn: Promise<any>,
  errorMsg: string,
  unwrap: (data: IApiResult<T>) => T,
): Promise<IApiResponse<T>> {
  try {
    const response = await requestFn;

    if (response.status === 200) {
      const responseData: IApiResult<T> =
        response.data?.object__ ?? response.data;

      if (!responseData.status) {
        showError(responseData.message || errorMsg);
        return {
          isSuccess: false,
          message: responseData.message || errorMsg,
          data: null,
        };
      }

      return {
        isSuccess: true,
        message: responseData.message || "Success",
        data: unwrap(responseData),
      };
    }

    showError(errorMsg);
    return { isSuccess: false, message: errorMsg, data: null };

  } catch (error: unknown) {
    if (isNetworkError(error)) throw error; // ✅ let callWithQueue handle + queue it
    return normalizeError(error);
  }
}

export function handleApiResponse<T>(
  requestFn: Promise<any>,
  errorMsg: string,
): Promise<IApiResponse<T>> {
  return handleResponse<T>(
    requestFn,
    errorMsg,
    (data) => (data.result ?? data) as T,  // unwraps nested result if present
  );
}

export function handlePlainApiResponse<T>(
  requestFn: Promise<any>,
  errorMsg: string,
): Promise<IApiResponse<T>> {
  return handleResponse<T>(
    requestFn,
    errorMsg,
    (data) => data as T,                   // returns data as-is
  );
}

// ─── Queue-aware caller ───────────────────────────────────────────────────────

export async function callWithQueue<T>(
  config: IAPIQueuePayload,
  errorMsg: string,
  axiosInstance: AxiosInstance = axiosConfig,
): Promise<IApiResponse<T>> {
  // Step 1: Append cache-bypass param
  const separator = config.url.includes("?") ? "&" : "?";
  const finalConfig: IAPIQueuePayload = {
    ...config,
    url: axiosInstance.defaults.baseURL + `${config.url}${separator}${URL_PARAM_CACHE}=false`,
  };

  // Step 2: Bail early if offline
  if (!navigator.onLine) {
    return processOfflineMode(finalConfig, "Saved offline. Will sync later.");
  }

  // Step 3: Attempt online request — only queue on network/offline errors
  try {
    const { url, method, data, headers } = finalConfig;
    const request = axiosInstance({ url, method, data, headers });
    return axiosInstance === axiosConfig
      ? await handleApiResponse<T>(request, errorMsg)
      : await handlePlainApiResponse<T>(request, errorMsg);

  } catch (err: unknown) {
    if (isNetworkError(err)) {
      return processOfflineMode(finalConfig, "Saved offline. Will retry.");
    }

    // Any other error (4xx, 5xx, etc.) — normalise and surface, do NOT queue
    return normalizeError(err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function processOfflineMode(
  config: IAPIQueuePayload,
  message: string,
): Promise<IApiResponse<never>> {
  await addToQueue(config);
  showWarning(message);
  return { isSuccess: true, message, data: null };
}

function isNetworkError(err: unknown): boolean {
  return (
    isAxiosError(err) &&
    (err.code === "ERR_NETWORK" ||
      err.code === "ECONNABORTED" ||
      !err.response)  // no response = no connectivity
  );
}

function normalizeError(err: unknown): IApiResponse<never> {
  let message: string;

  if (isAxiosError(err)) {
    message =
      err.response?.data?.message ??
      err.response?.statusText ??
      "Network error. Please check your connection.";
  } else {
    message = "An unexpected error occurred.";
  }

  showError(message);
  return { isSuccess: false, message, data: null };
}