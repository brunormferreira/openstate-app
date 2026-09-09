import { ApiError } from '@/services/api';

/** Turns transport/HTTP failures into something a user can act on. */
export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'TIMEOUT') return 'The server took too long to respond. Please try again.';
    if (error.status === 400) {
      return 'That jurisdiction is not valid. Use a state name or an "ocd-jurisdiction/..." id.';
    }
    if (error.code === 'RATE_LIMITED') return 'Too many requests. Wait a moment and try again.';
    if (error.code === 'UPSTREAM_RATE_LIMITED') {
      return 'The OpenStates API is rate limiting us. Try again in a minute.';
    }
    if (error.code === 'UPSTREAM_UNAUTHORIZED') {
      return 'The OpenStates API token is invalid. Check the backend configuration.';
    }
    if (error.status >= 500) return 'The server could not complete the request. Try again shortly.';
    return error.message;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'The request was cancelled. Please try again.';
  }

  if (error instanceof TypeError) {
    return 'Cannot reach the server. Check that the backend is running.';
  }

  return error instanceof Error ? error.message : 'Unexpected error.';
}
