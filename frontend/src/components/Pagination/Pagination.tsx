import { Nav, PageButton, Gap } from './Pagination.styles';

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
