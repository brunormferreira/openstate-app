import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request } from './client';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('request', () => {
  it('returns JSON body on success', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ ok: true }));
    const result = await request<{ ok: boolean }>('/test');
    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({ method: undefined }),
    );
  });

  it('returns undefined for 204 No Content', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    const result = await request<void>('/delete');
    expect(result).toBeUndefined();
  });

  it('throws ApiError for non-ok responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ error: { code: 'NOT_FOUND', message: 'Not found' } }, 404),
    );
    await expect(request('/missing')).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    });
  });

  it('throws ApiError for 4xx with no body error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('Bad Request', { status: 400, statusText: 'Bad Request' }),
    );
    await expect(request('/bad')).rejects.toMatchObject({ status: 400 });
  });

  it('passes AbortSignal through to fetch', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ data: 1 }));
    const controller = new AbortController();
    await request('/signal', { signal: controller.signal });
    const calls = vi.mocked(fetch).mock.calls[0];
    const callSignal = calls?.[1]?.signal as AbortSignal | undefined;
    expect(callSignal).toBeDefined();
  });
});
