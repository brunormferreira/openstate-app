const API_BASE = import.meta.env.VITE_API_URL ?? '/api';
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Backend errors travel as { error: { code, message } }; fall back to the status line. */
async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { error?: { code?: string; message?: string } };
    if (body?.error?.message) {
      return new ApiError(body.error.message, response.status, body.error.code);
    }
  } catch {
    // Non-JSON body: fall through to the generic message.
  }
  return new ApiError(`${response.status} ${response.statusText}`.trim(), response.status);
}

export interface RequestOptions {
  method?: string;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { method: options.method, signal });
  } catch (error) {
    if (timeout.aborted) {
      throw new ApiError('The request took too long to complete.', 408, 'TIMEOUT');
    }
    throw error;
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
