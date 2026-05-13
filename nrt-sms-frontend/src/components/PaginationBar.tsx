import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

interface PaginationBarProps {
  page: number;
  perPage: number;
  total: number;
  onChange: (p: number) => void;
}

export default function PaginationBar({ page, perPage, total, onChange }: PaginationBarProps) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  const items: React.ReactNode[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);

  if (start > 1) {
    items.push(<PaginationItem key="first" onClick={() => onChange(1)}><PaginationLink first /></PaginationItem>);
  }
  items.push(<PaginationItem key="prev" disabled={page <= 1} onClick={() => onChange(page - 1)}><PaginationLink previous /></PaginationItem>);
  for (let i = start; i <= end; i++) {
    items.push(<PaginationItem key={i} active={i === page} onClick={() => onChange(i)}><PaginationLink>{i}</PaginationLink></PaginationItem>);
  }
  items.push(<PaginationItem key="next" disabled={page >= pages} onClick={() => onChange(page + 1)}><PaginationLink next /></PaginationItem>);
  if (end < pages) {
    items.push(<PaginationItem key="last" onClick={() => onChange(pages)}><PaginationLink last /></PaginationItem>);
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-1">
      <small className="text-muted">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total}</small>
      <Pagination className="mb-0">{items}</Pagination>
    </div>
  );
}
