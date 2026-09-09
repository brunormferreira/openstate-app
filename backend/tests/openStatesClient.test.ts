import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpOpenStatesClient } from '../src/infra/openstates/openStatesClient.js';
import { AppError } from '../src/shared/errors/AppError.js';

const API_URL = 'https://v3.openstates.org';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function emptyPage() {
  return { results: [], pagination: { per_page: 50, page: 1, max_page: 1, total_items: 0 } };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('HttpOpenStatesClient', () => {
  it('sends the api token as a header instead of a query parameter', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(emptyPage()));
    vi.stubGlobal('fetch', fetchMock);

    await new HttpOpenStatesClient(API_URL, 'secret-token').listPeopleByJurisdiction('Georgia', 1);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain('secret-token');
    expect(init.headers).toMatchObject({ 'X-API-KEY': 'secret-token' });
  });

  it('maps an unauthorized response to UPSTREAM_UNAUTHORIZED', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ detail: 'nope' }, 401)),
    );

    const client = new HttpOpenStatesClient(API_URL, 'token');

    await expect(client.listPeopleByJurisdiction('Georgia', 1)).rejects.toMatchObject({
      statusCode: 502,
      code: 'UPSTREAM_UNAUTHORIZED',
    });
  });

  it('maps a network failure to UPSTREAM_ERROR', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new Error('ECONNREFUSED'))),
    );

    const client = new HttpOpenStatesClient(API_URL, 'token');

    await expect(client.listPeopleByJurisdiction('Georgia', 1)).rejects.toBeInstanceOf(AppError);
  });

  it('retries after a rate limit and gives up once retries are exhausted', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => jsonResponse({ detail: 'slow down' }, 429));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpOpenStatesClient(API_URL, 'token');
    const pending = client.listPeopleByJurisdiction('Georgia', 1);
    const assertion = expect(pending).rejects.toMatchObject({ code: 'UPSTREAM_RATE_LIMITED' });

    await vi.runAllTimersAsync();
    await assertion;

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('stops requesting once the page cap is exceeded', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(emptyPage()));
    vi.stubGlobal('fetch', fetchMock);

    const result = await new HttpOpenStatesClient(API_URL, 'token').listPeopleByJurisdiction(
      'Georgia',
      51,
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.results).toEqual([]);
    expect(result.pagination.max_page).toBe(50);
  });
});
