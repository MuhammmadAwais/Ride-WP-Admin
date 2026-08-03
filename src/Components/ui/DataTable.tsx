import React, { useRef } from 'react';
import { useTableSort } from '@/hooks/useTableSort';
import { 
  ChevronUp, ChevronDown, ChevronsUpDown, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Loader2 
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T; // Used if accessorKey is a function
}

export interface TablePaginationConfig {
  total: number;
  offset: number;
  limit: number;
  onPageChange: (newOffset: number) => void;
  onLimitChange?: (newLimit: number) => void;
  isFetching?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchTerm?: string;
  keyExtractor: (item: T) => string;
  pagination?: TablePaginationConfig;
}

/**
 * Highlights matches of the search term within the given text.
 */
function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-accent/20 text-accent font-bold px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * Generates an array of page numbers and ellipses for compact pagination display.
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  pages.push(1);
  if (currentPage > 3) {
    pages.push('...');
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (currentPage < totalPages - 2) {
    pages.push('...');
  }
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  return pages;
}

export function DataTable<T>({ data, columns, searchTerm = '', keyExtractor, pagination }: DataTableProps<T>) {
  const { items: sortedData, requestSort, sortConfig } = useTableSort(data);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useGSAP(() => {
    if (!tbodyRef.current) return;
    const rows = tbodyRef.current.children;
    if (rows.length === 0) return;

    gsap.fromTo(
      rows,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );
  }, [sortedData]); // Re-animate on data change

  const renderCellContent = (row: T, col: ColumnDef<T>) => {
    let content: React.ReactNode;
    let textToHighlight = '';

    if (typeof col.accessorKey === 'function') {
      content = col.accessorKey(row);
      // We can only reliably highlight string/number results, not ReactNodes directly, 
      // but if the function returns a string/number, we can highlight it.
      if (typeof content === 'string' || typeof content === 'number') {
        textToHighlight = String(content);
      } else {
        return content; // Return complex nodes as is (like UserActionsMenu or Profile Photo)
      }
    } else {
      content = row[col.accessorKey] as any;
      textToHighlight = content != null ? String(content) : '';
    }

    return <HighlightedText text={textToHighlight} highlight={searchTerm} />;
  };

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1;
  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;

  return (
    <div className="w-full rounded-xl border border-border bg-surface/80 backdrop-blur-2xl shadow-lg overflow-hidden">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className={cn(
          "w-full min-w-[800px] text-left border-collapse",
          pagination?.isFetching && "opacity-60 transition-opacity duration-300 pointer-events-none"
        )}>
          <thead>
            <tr className="border-b border-border bg-[var(--color-table-header)] transition-colors">
              {columns.map((col, idx) => {
                const isSortable = col.sortable !== false && (typeof col.accessorKey !== 'function' || col.sortKey);
                const sortKey = col.sortKey || (typeof col.accessorKey !== 'function' ? col.accessorKey : null);
                
                const isSorted = sortConfig.key === sortKey;
                const direction = sortConfig.direction;

                return (
                  <th
                    key={idx}
                    onClick={() => isSortable && sortKey && requestSort(sortKey as keyof T)}
                    className={cn(
                      "p-5 font-poppins text-[13px] font-bold text-text-main/80 uppercase tracking-wider",
                      isSortable && "cursor-pointer select-none hover:bg-accent/5 transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {isSortable && (
                        <span className="flex flex-col text-accent/40">
                          {isSorted && direction === 'asc' ? (
                            <ChevronUp size={14} className="text-accent" />
                          ) : isSorted && direction === 'desc' ? (
                            <ChevronDown size={14} className="text-accent" />
                          ) : (
                            <ChevronsUpDown size={14} className="opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/[0.03] dark:hover:bg-white/[0.03] transition-colors group"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className="p-5 font-roboto text-[14px] text-text-main/90 whitespace-nowrap">
                      {renderCellContent(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-text-muted font-roboto">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border bg-surface/50 text-sm">
          <div className="flex flex-wrap items-center gap-4 text-text-muted font-roboto">
            <span>
              Showing{' '}
              <strong className="text-text-main font-semibold">
                {pagination.total === 0 ? 0 : pagination.offset + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-text-main font-semibold">
                {Math.min(pagination.offset + pagination.limit, pagination.total)}
              </strong>{' '}
              of <strong className="text-text-main font-semibold">{pagination.total}</strong> entries
            </span>

            {pagination.onLimitChange && (
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <span className="text-xs text-text-muted">Per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => pagination.onLimitChange?.(Number(e.target.value))}
                  className="bg-surface border border-border rounded-lg px-2.5 py-1 text-xs text-text-main font-medium focus:outline-none focus:border-accent transition-colors cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}

            {pagination.isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Updating...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* First Page */}
            <button
              onClick={() => pagination.onPageChange(0)}
              disabled={pagination.offset === 0 || pagination.isFetching}
              className="p-2 rounded-lg border border-border/80 bg-surface text-text-main hover:bg-accent/10 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => pagination.onPageChange(Math.max(0, pagination.offset - pagination.limit))}
              disabled={pagination.offset === 0 || pagination.isFetching}
              className="p-2 rounded-lg border border-border/80 bg-surface text-text-main hover:bg-accent/10 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 px-1">
              {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => pagination.onPageChange((page - 1) * pagination.limit)}
                    disabled={pagination.isFetching}
                    className={cn(
                      "min-w-[32px] h-8 px-2 rounded-lg font-poppins text-xs font-semibold flex items-center justify-center transition-all",
                      page === currentPage
                        ? "bg-accent text-white shadow-md shadow-accent/30"
                        : "text-text-main hover:bg-accent/10 hover:text-accent border border-transparent hover:border-border/60"
                    )}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="px-1 text-text-muted text-xs select-none">
                    {page}
                  </span>
                )
              )}
            </div>

            {/* Next Page */}
            <button
              onClick={() => pagination.onPageChange(pagination.offset + pagination.limit)}
              disabled={
                pagination.offset + pagination.limit >= pagination.total || pagination.isFetching
              }
              className="p-2 rounded-lg border border-border/80 bg-surface text-text-main hover:bg-accent/10 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last Page */}
            <button
              onClick={() =>
                pagination.onPageChange(
                  (Math.max(1, Math.ceil(pagination.total / pagination.limit)) - 1) * pagination.limit
                )
              }
              disabled={
                pagination.offset + pagination.limit >= pagination.total || pagination.isFetching
              }
              className="p-2 rounded-lg border border-border/80 bg-surface text-text-main hover:bg-accent/10 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
