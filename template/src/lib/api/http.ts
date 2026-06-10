import { isAxiosError } from "axios";
import { snackStore } from "$lib/stores/snackbar.svelte";
import type { IApiResponse, IApiResult } from "@aryagg/types";

const { error: showError } = snackStore;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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