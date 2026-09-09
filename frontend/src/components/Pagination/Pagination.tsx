import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  margin-top: ${({ theme }) => theme.space(8)};
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 ${({ theme }) => theme.space(2)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryContrast : theme.colors.textMuted)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: ${({ theme }) => `background ${theme.transition}, border-color ${theme.transition}`};

  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.surfaceHover};
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.borderStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Gap = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSubtle};
  margin: 0 ${({ theme }) => theme.space(2)};
`;

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 7;

type PageSlot = { key: string; page: number | null };

function getPageSlots(current: number, total: number): PageSlot[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => ({ key: `page-${i + 1}`, page: i + 1 }));
  }

  const slots: PageSlot[] = [{ key: 'page-1', page: 1 }];
  if (current > 3) slots.push({ key: 'gap-start', page: null });
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    slots.push({ key: `page-${i}`, page: i });
  }
  if (current < total - 2) slots.push({ key: 'gap-end', page: null });
  slots.push({ key: `page-${total}`, page: total });
  return slots;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const slots = getPageSlots(page, totalPages);

  return (
    <Nav aria-label="Pagination">
      <PageButton
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &lsaquo;
      </PageButton>

      {slots.map((slot) =>
        slot.page === null ? (
          <Gap key={slot.key}>...</Gap>
        ) : (
          <PageButton
            key={slot.key}
            $active={slot.page === page}
            onClick={() => onPageChange(slot.page as number)}
            aria-current={slot.page === page ? 'page' : undefined}
          >
            {slot.page}
          </PageButton>
        ),
      )}

      <PageButton
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        &rsaquo;
      </PageButton>
    </Nav>
  );
}
