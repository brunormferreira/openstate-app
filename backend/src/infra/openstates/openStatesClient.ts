import { AppError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import { sleep } from '../../shared/utils/sleep.js';
import type { OpenStatesPersonList } from './openStates.types.js';

export interface OpenStatesClient {
  listPeopleByJurisdiction(jurisdiction: string, page: number): Promise<OpenStatesPersonList>;
}

/** Maximum allowed by the OpenStates v3 API. */
const PER_PAGE = 50;
/** Safety cap so a single sync never walks an unbounded number of pages. */
const MAX_PAGE = 50;
/** Short retry window: the quota is daily, so a 429 means fail fast, not back off for minutes. */
const MAX_RETRIES = 2;
const RATE_LIMIT_BACKOFF_MS = 5_000;

export class HttpOpenStatesClient implements OpenStatesClient {
  constructor(
    private readonly apiUrl: string,
    private readonly apiToken: string,
  ) {}

  private async request<T>(path: string, attempt = 1): Promise<T> {
    const url = new URL(path, this.apiUrl);
    url.searchParams.set('per_page', String(PER_PAGE));

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        headers: { 'X-API-KEY': this.apiToken },
      });
    } catch (error) {
      logger('OpenStates network error', error);
      throw new AppError('Failed to reach the OpenStates API', 502, 'UPSTREAM_ERROR');
    }

    if (response.status === 429) {
      logger('OpenStates rate limited (429)');
      if (attempt < MAX_RETRIES) {
        await sleep(RATE_LIMIT_BACKOFF_MS);
        return this.request<T>(path, attempt + 1);
      }
      throw new AppError('OpenStates API rate limit exceeded', 503, 'UPSTREAM_RATE_LIMITED');
    }

    if (!response.ok) {
      const detail = await response.text();
      logger('OpenStates HTTP error', response.status, detail.slice(0, 500));
      if (response.status === 401 || response.status === 403) {
        throw new AppError('OpenStates API token is invalid', 502, 'UPSTREAM_UNAUTHORIZED');
      }
      throw new AppError(`OpenStates API error: ${response.status}`, 502, 'UPSTREAM_ERROR');
    }

    return (await response.json()) as T;
  }

  async listPeopleByJurisdiction(jurisdiction: string, page = 1): Promise<OpenStatesPersonList> {
    if (page > MAX_PAGE) {
      return {
        results: [],
        pagination: { page, max_page: page - 1, per_page: PER_PAGE, total_items: 0 },
      };
    }
    return this.request<OpenStatesPersonList>(
      `/people?jurisdiction=${encodeURIComponent(jurisdiction)}&page=${page}`,
    );
  }
}
