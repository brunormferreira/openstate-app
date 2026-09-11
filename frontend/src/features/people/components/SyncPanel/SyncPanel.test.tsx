import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@/styles/theme';
import { SyncProvider } from '@/context/SyncContext';
import { getLastSync, recordSync } from '@/utils/syncHistory';
import { toast } from 'sonner';
import { runSync } from '@/api/people.api';
import { SyncPanel } from './SyncPanel';

vi.mock('@/api/people.api', () => ({
  runSync: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockRunSync = vi.mocked(runSync);
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError = vi.mocked(toast.error);

const GA_JURISDICTION = 'ocd-jurisdiction/country:us/state:ga/government';

function renderPanel() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <SyncProvider>
          <SyncPanel />
        </SyncProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('SyncPanel', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the panel title', () => {
    renderPanel();
    expect(screen.getByText('Sync a jurisdiction')).toBeInTheDocument();
  });

  it('renders jurisdiction input', () => {
    renderPanel();
    expect(screen.getByRole('textbox', { name: 'Jurisdiction to sync' })).toBeInTheDocument();
  });

  it('renders sync button as disabled initially', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: 'Sync' })).toBeDisabled();
  });

  it('enables sync button when input has value', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), 'GA');
    expect(screen.getByRole('button', { name: 'Sync' })).toBeEnabled();
  });

  it('renders preset buttons', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: 'Georgia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'California' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New York' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Texas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Florida' })).toBeInTheDocument();
  });

  it('fills input when preset is clicked', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: 'Georgia' }));
    expect(screen.getByRole('textbox', { name: 'Jurisdiction to sync' })).toHaveValue(
      GA_JURISDICTION,
    );
  });

  it('shows hint text', () => {
    renderPanel();
    expect(screen.getByText(/Pulls the latest people/)).toBeInTheDocument();
  });

  it('syncs a jurisdiction and shows a success toast', async () => {
    const user = userEvent.setup();
    mockRunSync.mockResolvedValue({
      jurisdiction: GA_JURISDICTION,
      peopleUpserted: 5,
      durationMs: 1000,
    });
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), GA_JURISDICTION);
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    await waitFor(() =>
      expect(mockRunSync).toHaveBeenCalledWith(GA_JURISDICTION, expect.anything()),
    );
    await waitFor(() =>
      expect(mockToastSuccess).toHaveBeenCalledWith(
        expect.stringContaining('5 people synced in 1.0s'),
      ),
    );
  });

  it('records the sync in local history', async () => {
    const user = userEvent.setup();
    mockRunSync.mockResolvedValue({
      jurisdiction: GA_JURISDICTION,
      peopleUpserted: 12,
      durationMs: 2000,
    });
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), GA_JURISDICTION);
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    await waitFor(() => expect(getLastSync(GA_JURISDICTION)?.peopleCount).toBe(12));
  });

  it('shows an error toast when sync fails', async () => {
    const user = userEvent.setup();
    mockRunSync.mockRejectedValue(new Error('Network down'));
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), GA_JURISDICTION);
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Network down'));
  });

  it('does not sync when the input is blank or whitespace', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), '   ');
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    expect(mockRunSync).not.toHaveBeenCalled();
  });

  it('does nothing when Enter is pressed with an empty input', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), '{Enter}');

    expect(mockRunSync).not.toHaveBeenCalled();
  });

  it('syncs when Enter is pressed with a value', async () => {
    const user = userEvent.setup();
    mockRunSync.mockResolvedValue({ jurisdiction: 'GA', peopleUpserted: 1, durationMs: 500 });
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), `GA{Enter}`);

    await waitFor(() =>
      expect(mockRunSync).toHaveBeenCalledWith('GA', expect.anything()),
    );
  });

  it('opens a confirm dialog for a previously synced jurisdiction and resyncs on confirm', async () => {
    const user = userEvent.setup();
    recordSync(GA_JURISDICTION, 3);
    mockRunSync.mockResolvedValue({
      jurisdiction: GA_JURISDICTION,
      peopleUpserted: 7,
      durationMs: 1500,
    });
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), GA_JURISDICTION);
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    expect(screen.getByText('Re-sync jurisdiction?')).toBeInTheDocument();
    expect(mockRunSync).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Sync anyway' }));

    await waitFor(() =>
      expect(mockRunSync).toHaveBeenCalledWith(GA_JURISDICTION, expect.anything()),
    );
    await waitFor(() => expect(mockToastSuccess).toHaveBeenCalled());
    expect(getLastSync(GA_JURISDICTION)?.peopleCount).toBe(7);
  });

  it('cancels the confirm dialog without syncing', async () => {
    const user = userEvent.setup();
    recordSync(GA_JURISDICTION, 3);
    renderPanel();

    await user.type(screen.getByRole('textbox', { name: 'Jurisdiction to sync' }), GA_JURISDICTION);
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    expect(screen.getByText('Re-sync jurisdiction?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockRunSync).not.toHaveBeenCalled();
    expect(screen.queryByText('Re-sync jurisdiction?')).not.toBeInTheDocument();
  });

  it('syncs a preset jurisdiction directly from the preset button', async () => {
    const user = userEvent.setup();
    mockRunSync.mockResolvedValue({
      jurisdiction: GA_JURISDICTION,
      peopleUpserted: 4,
      durationMs: 800,
    });
    renderPanel();

    await user.click(screen.getByRole('button', { name: 'Georgia' }));
    await user.click(screen.getByRole('button', { name: 'Sync' }));

    await waitFor(() =>
      expect(mockRunSync).toHaveBeenCalledWith(GA_JURISDICTION, expect.anything()),
    );
  });
});