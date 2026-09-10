import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import styled from 'styled-components';
import { runSync } from '@/api/people.api';
import { apiErrorMessage } from '@/utils/apiErrorMessage';
import { getLastSync, recordSync, formatRelativeTime } from '@/utils/syncHistory';
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog';
import { useSync } from '@/context/SyncContext';

const PRESETS = [
  { id: 'ocd-jurisdiction/country:us/state:ga/government', label: 'Georgia' },
  { id: 'ocd-jurisdiction/country:us/state:ca/government', label: 'California' },
  { id: 'ocd-jurisdiction/country:us/state:ny/government', label: 'New York' },
  { id: 'ocd-jurisdiction/country:us/state:tx/government', label: 'Texas' },
  { id: 'ocd-jurisdiction/country:us/state:fl/government', label: 'Florida' },
];

const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space(4)};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space(1)};
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(3)};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const PrimaryButton = styled.button`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: ${({ theme }) => `background ${theme.transition}`};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`;

const PresetButton = styled.button`
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => `background ${theme.transition}, color ${theme.transition}`};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primarySoftText};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function SyncPanel() {
  const queryClient = useQueryClient();
  const { setSyncing } = useSync();
  const [jurisdiction, setJurisdiction] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingJurisdiction, setPendingJurisdiction] = useState<string | null>(null);

  const refreshPeople = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: ['people'] });
  }, [queryClient]);

  const syncMutation = useMutation({
    mutationFn: runSync,
    onMutate: () => {
      setSyncing(true);
    },
    onSuccess: (result, syncedJurisdiction) => {
      const label =
        PRESETS.find((preset) => preset.id === syncedJurisdiction)?.label ?? syncedJurisdiction;
      recordSync(syncedJurisdiction, result.peopleUpserted);
      toast.success(
        `${label}: ${result.peopleUpserted} people synced in ${(result.durationMs / 1000).toFixed(1)}s`,
      );
      void refreshPeople().finally(() => setSyncing(false));
    },
    onError: (error) => {
      setSyncing(false);
      toast.error(apiErrorMessage(error));
    },
  });

  const doSync = (value: string) => {
    syncMutation.reset();
    syncMutation.mutate(value);
  };

  const handleSync = () => {
    const value = jurisdiction.trim();
    if (!value || syncMutation.isPending) return;

    const lastSync = getLastSync(value);
    if (lastSync) {
      setPendingJurisdiction(value);
      setConfirmOpen(true);
      return;
    }

    doSync(value);
  };

  const confirmSync = () => {
    setConfirmOpen(false);
    if (pendingJurisdiction) {
      doSync(pendingJurisdiction);
      setPendingJurisdiction(null);
    }
  };

  const cancelSync = () => {
    setConfirmOpen(false);
    setPendingJurisdiction(null);
  };

  const pendingLabel = pendingJurisdiction
    ? (PRESETS.find((preset) => preset.id === pendingJurisdiction)?.label ?? pendingJurisdiction)
    : '';

  return (
    <>
      <Panel aria-labelledby="sync-panel-title">
        <Title id="sync-panel-title">Sync a jurisdiction</Title>
        <Hint>Pulls the latest people from the OpenStates API into the local database.</Hint>

        <InputRow>
          <Input
            type="text"
            aria-label="Jurisdiction to sync"
            placeholder="e.g. ga, california, ocd-jurisdiction/..."
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSync();
            }}
          />
          <PrimaryButton
            type="button"
            onClick={handleSync}
            disabled={syncMutation.isPending || !jurisdiction.trim()}
          >
            {syncMutation.isPending ? 'Syncing...' : 'Sync'}
          </PrimaryButton>
        </InputRow>

        <PresetRow>
          {PRESETS.map((preset) => (
            <PresetButton
              key={preset.id}
              type="button"
              onClick={() => setJurisdiction(preset.id)}
              disabled={syncMutation.isPending}
            >
              {preset.label}
            </PresetButton>
          ))}
        </PresetRow>
      </Panel>

      <ConfirmDialog
        open={confirmOpen}
        title="Re-sync jurisdiction?"
        message={`${pendingLabel} was already synced ${
          pendingJurisdiction
            ? formatRelativeTime(getLastSync(pendingJurisdiction)?.syncedAt ?? 0)
            : ''
        } (${pendingJurisdiction ? (getLastSync(pendingJurisdiction)?.peopleCount ?? 0) : 0} people). Do you want to sync again?`}
        onConfirm={confirmSync}
        onCancel={cancelSync}
      />
    </>
  );
}
