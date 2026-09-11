import { Bar, Left, SelectLabel, Select, Center, Info, ArrowButton } from './Pagination.styles';

const PER_PAGE_OPTIONS = [5, 10, 15, 20];

interface PaginationProps {
  readonly page: number;
  readonly totalItems: number;
  readonly perPage: number;
  readonly onPageChange: (page: number) => void;
  readonly onPerPageChange: (perPage: number) => void;
}

export function Pagination({
  page,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const start = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems);

  return (
    <Bar aria-label="Pagination">
      <Left>
        <SelectLabel>Items per page:</SelectLabel>
        <Select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          aria-label="Items per page"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </Left>

      <Center>
        <Info>{totalItems > 0 ? `${start} – ${end} of ${totalItems}` : '0 results'}</Info>
        <ArrowButton
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </ArrowButton>
        <ArrowButton
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </ArrowButton>
      </Center>
    </Bar>
  );
}