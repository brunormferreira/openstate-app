import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SyncScheduler } from '../src/modules/sync/sync.scheduler.js';
import type { SyncService } from '../src/modules/sync/sync.service.js';

function makeServiceStub(): SyncService {
  return {
    run: vi.fn(async () => ({ jurisdiction: 'GA', peopleUpserted: 5 })),
  };
}

describe('SyncScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does nothing when jurisdiction is empty', () => {
    const service = makeServiceStub();
    const scheduler = new SyncScheduler(service, '0 0 * * *', '');

    scheduler.start();

    expect(service.run).not.toHaveBeenCalled();
  });

  it('does nothing when jurisdiction is invalid', () => {
    const service = makeServiceStub();
    const scheduler = new SyncScheduler(service, '0 0 * * *', 'INVALIDSTATE');

    scheduler.start();

    expect(service.run).not.toHaveBeenCalled();
  });

  it('does nothing when cron expression is invalid', () => {
    const service = makeServiceStub();
    const scheduler = new SyncScheduler(service, 'not-a-cron', 'GA');

    scheduler.start();

    expect(service.run).not.toHaveBeenCalled();
  });

  it('schedules sync with valid jurisdiction and cron', () => {
    const service = makeServiceStub();
    const scheduler = new SyncScheduler(service, '0 0 * * *', 'GA');

    scheduler.start();

    expect(service.run).not.toHaveBeenCalled();
  });

  it('can be stopped without error', () => {
    const service = makeServiceStub();
    const scheduler = new SyncScheduler(service, '0 0 * * *', 'GA');

    scheduler.start();
    scheduler.stop();
  });
});
