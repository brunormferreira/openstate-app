import { ApiError } from '@/services/api';

const TRANSPORT_MESSAGES: Record<string, string> = {
  TIMEOUT: 'The server took too long to respond. Please try again.',
  RATE_LIMITED: 'Too many requests. Wait a moment and try again.',
  UPSTREAM_RATE_LIMITED: 'The OpenStates API is rate limiting us. Try again in a minute.',
  UPSTREAM_UNAUTHORIZED: 'The OpenStates API token is invalid. Check the backend configuration.',
  UPSTREAM_ERROR: 'The upstream API is unavailable. Try again shortly.',
};

/** Turns transport/HTTP failures into something a user can act on. */
export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.message) return error.message;
    if (error.code && TRANSPORT_MESSAGES[error.code]) return TRANSPORT_MESSAGES[error.code];
    if (error.status >= 500) return 'The server could not complete the request. Try again shortly.';
    return 'Unexpected error.';
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'The request was cancelled. Please try again.';
  }

  if (error instanceof TypeError) {
    return 'Cannot reach the server. Check that the backend is running.';
  }

  return error instanceof Error ? error.message : 'Unexpected error.';
}
