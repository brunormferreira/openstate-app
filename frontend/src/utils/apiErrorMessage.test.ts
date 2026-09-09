import { describe, it, expect } from 'vitest';
import { apiErrorMessage } from './apiErrorMessage';
import { ApiError } from '@/services/api';

describe('apiErrorMessage', () => {
  it('returns timeout message for TIMEOUT code', () => {
    const error = new ApiError('timeout', 408, 'TIMEOUT');
    expect(apiErrorMessage(error)).toBe(
      'The server took too long to respond. Please try again.',
    );
  });

  it('returns 400 message for bad jurisdiction', () => {
    const error = new ApiError('bad request', 400);
    expect(apiErrorMessage(error)).toBe(
      'That jurisdiction is not valid. Use a state name or an "ocd-jurisdiction/..." id.',
    );
  });

  it('returns RATE_LIMITED message', () => {
    const error = new ApiError('rate limited', 429, 'RATE_LIMITED');
    expect(apiErrorMessage(error)).toBe(
      'Too many requests. Wait a moment and try again.',
    );
  });

  it('returns UPSTREAM_RATE_LIMITED message', () => {
    const error = new ApiError('upstream limited', 429, 'UPSTREAM_RATE_LIMITED');
    expect(apiErrorMessage(error)).toBe(
      'The OpenStates API is rate limiting us. Try again in a minute.',
    );
  });

  it('returns UPSTREAM_UNAUTHORIZED message', () => {
    const error = new ApiError('unauthorized', 401, 'UPSTREAM_UNAUTHORIZED');
    expect(apiErrorMessage(error)).toBe(
      'The OpenStates API token is invalid. Check the backend configuration.',
    );
  });

  it('returns generic server error for 5xx', () => {
    const error = new ApiError('internal error', 500);
    expect(apiErrorMessage(error)).toBe(
      'The server could not complete the request. Try again shortly.',
    );
  });

  it('falls back to error.message for other ApiError', () => {
    const error = new ApiError('custom message', 418);
    expect(apiErrorMessage(error)).toBe('custom message');
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
