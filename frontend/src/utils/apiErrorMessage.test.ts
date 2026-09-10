import { describe, it, expect } from 'vitest';
import { apiErrorMessage } from './apiErrorMessage';
import { ApiError } from '@/api/client';

describe('apiErrorMessage', () => {
  it('returns error.message when present', () => {
    const error = new ApiError('Custom backend message', 400);
    expect(apiErrorMessage(error)).toBe('Custom backend message');
  });

  it('returns transport message for TIMEOUT code', () => {
    const error = new ApiError('', 408, 'TIMEOUT');
    expect(apiErrorMessage(error)).toBe(
      'The server took too long to respond. Please try again.',
    );
  });

  it('returns transport message for RATE_LIMITED code', () => {
    const error = new ApiError('', 429, 'RATE_LIMITED');
    expect(apiErrorMessage(error)).toBe(
      'Too many requests. Wait a moment and try again.',
    );
  });

  it('returns transport message for UPSTREAM_RATE_LIMITED code', () => {
    const error = new ApiError('', 429, 'UPSTREAM_RATE_LIMITED');
    expect(apiErrorMessage(error)).toBe(
      'The OpenStates API is rate limiting us. Try again in a minute.',
    );
  });

  it('returns transport message for UPSTREAM_UNAUTHORIZED code', () => {
    const error = new ApiError('', 401, 'UPSTREAM_UNAUTHORIZED');
    expect(apiErrorMessage(error)).toBe(
      'The OpenStates API token is invalid. Check the backend configuration.',
    );
  });

  it('returns generic server error for 5xx', () => {
    const error = new ApiError('', 500);
    expect(apiErrorMessage(error)).toBe(
      'The server could not complete the request. Try again shortly.',
    );
  });

  it('handles AbortError', () => {
    const error = new DOMException('aborted', 'AbortError');
    expect(apiErrorMessage(error)).toBe(
      'The request was cancelled. Please try again.',
    );
  });

  it('handles TypeError', () => {
    const error = new TypeError('Failed to fetch');
    expect(apiErrorMessage(error)).toBe(
      'Cannot reach the server. Check that the backend is running.',
    );
  });

  it('returns error.message for generic Error', () => {
    const error = new Error('something broke');
    expect(apiErrorMessage(error)).toBe('something broke');
  });

  it('returns fallback for unknown values', () => {
    expect(apiErrorMessage(null)).toBe('Unexpected error.');
    expect(apiErrorMessage(42)).toBe('Unexpected error.');
    expect(apiErrorMessage(undefined)).toBe('Unexpected error.');
  });
});
