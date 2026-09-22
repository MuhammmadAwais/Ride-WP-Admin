/**
 * @fileoverview Generic DataTable — modern, cinematic design aligned 1:1 with Ride-WP.
 *
 * Features:
 *  - Full backward compatibility with ColumnDef<T>, TablePaginationConfig, and keyExtractor
 *  - Uses useTableSort hook (3-state: asc → desc → null)
 *  - GSAP staggered row entrance animation on data change
 *  - Search text highlight in cells with amber glow mark
 *  - Modern sortable column headers with illuminated sort icons
 *  - Theme-adaptive squircle empty state with SearchX icon
 *  - Rich shimmer skeleton rows when loading
 *  - 100% design-token driven (bg-surface, text-text-muted, border-border, etc.)
 */
import React, { useRef } from 'react';
import { useTableSort } from '@/hooks/useTableSort';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  SearchX,
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
  cellClass?: string;
  headerClass?: string;
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
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Highlights matches of the search term within the given text.
 */
function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !highlight.trim() || !text) {
    return <>{text}</>;
  }
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-accent/20 text-accent font-bold px-1 py-0.5 rounded-[3px]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Skeleton row with linear shimmer effect matching Ride-WP.
 */
function SkeletonRow({ colCount, index }: { colCount: number; index: number }) {
  return (
    <tr
      className="border-b border-border/70"
      style={{ opacity: 1 - index * 0.12 }}
    >
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="py-3.5 px-5 align-middle">
          <div
            className="h-3.5 rounded-md bg-gradient-to-r from-border/50 via-accent/10 to-border/50 animate-pulse"
            style={{
              width: i === 0 ? '60%' : ['75%', '45%', '65%', '50%', '40%'][i % 5],
            }}
          />
        </td>
      ))}
    </tr>
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

export function DataTable<T extends object>({
  data,
  columns,
  searchTerm = '',
  keyExtractor,
  pagination,
  isLoading = false,
  emptyMessage = 'No matching records found.',
  className,
}: DataTableProps<T>) {
  const { items: sortedData, requestSort, sortConfig } = useTableSort(data);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  // GSAP staggered row entrance animation
  useGSAP(() => {
    if (!tbodyRef.current) return;
    const rows = tbodyRef.current.querySelectorAll('.dt-row');
    if (rows.length === 0) return;

    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out', clearProps: 'all' }
    );
  }, [sortedData]);

  const renderCellContent = (row: T, col: ColumnDef<T>) => {
    let content: React.ReactNode;
    let textToHighlight: string;

    if (typeof col.accessorKey === 'function') {
      content = col.accessorKey(row);
      if (typeof content === 'string' || typeof content === 'number') {
        textToHighlight = String(content);
      } else {
        return content;
      }
    } else {
      content = row[col.accessorKey] as any;
      textToHighlight = content != null ? String(content) : '';
    }

    return <HighlightedText text={textToHighlight} highlight={searchTerm} />;
  };

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1;
  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;
  const showSkeleton = isLoading || (pagination?.isFetching && sortedData.length === 0);

  return (
    <>
      <style>{`
        .dt-row {
          transition: background-color 0.15s ease;
        }
        .dt-row:hover td {
          background-color: var(--color-hover) !important;
        }
        .dt-th-sort:hover {
          color: var(--color-accent) !important;
        }
        .dt-th-sort:hover svg {
          opacity: 1 !important;
        }
      `}</style>

      <div className={cn(
        'w-full rounded-2xl border border-border bg-surface shadow-xs dark:shadow-xl overflow-hidden',
        className
      )}>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className={cn(
            'w-full min-w-[760px] text-left border-collapse',
            pagination?.isFetching && sortedData.length > 0 && 'opacity-70 transition-opacity duration-200'
          )}>
            {/* ── Table Header ──────────────────────────────────────────────── */}
            <thead>
              <tr className="bg-hover/50 border-b border-border transition-colors">
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
                        'py-3.5 px-5 font-poppins text-[11px] font-bold text-text-muted uppercase tracking-[0.08em] whitespace-nowrap transition-colors select-none',
                        isSortable && 'cursor-pointer dt-th-sort hover:text-accent',
                        col.headerClass
                      )}
                      aria-sort={
                        isSorted
                          ? direction === 'asc' ? 'ascending' : 'descending'
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {isSortable && (
                          <span className="shrink-0 flex items-center">
                            {isSorted && direction === 'asc' ? (
                              <ChevronUp size={13} className="text-accent drop-shadow-[0_0_4px_rgba(235,113,43,0.5)]" />
                            ) : isSorted && direction === 'desc' ? (
                              <ChevronDown size={13} className="text-accent drop-shadow-[0_0_4px_rgba(235,113,43,0.5)]" />
                            ) : (
                              <ChevronsUpDown size={13} className="opacity-30 transition-opacity" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Table Body ────────────────────────────────────────────────── */}
            <tbody ref={tbodyRef}>
              {showSkeleton ? (
                Array.from({ length: pagination?.limit ? Math.min(pagination.limit, 6) : 5 }).map((_, i) => (
                  <SkeletonRow key={i} colCount={columns.length} index={i} />
                ))
              ) : sortedData.length > 0 ? (
                sortedData.map((row, rowIdx) => (
                  <tr
                    key={keyExtractor(row)}
                    className="dt-row border-b border-border/70 last:border-0 transition-colors"
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        className={cn(
                          'py-3.5 px-5 font-roboto text-[13px] text-text-main/90 whitespace-nowrap align-middle',
                          col.cellClass
                        )}
                      >
                        {renderCellContent(row, col)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-16 px-6">
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      {/* Theme-adaptive squircle empty state matching Ride-WP */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center text-accent shadow-xs mb-1">
                        <SearchX size={26} className="text-accent" />
                      </div>
                      <p className="font-poppins text-sm font-bold text-text-main">
                        Nothing here yet
                      </p>
                      <p className="font-roboto text-xs text-text-muted max-w-sm">
                        {emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ────────────────────────────────────────────────── */}
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-border bg-surface text-xs font-roboto text-text-muted">
            <div className="flex flex-wrap items-center gap-3">
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
                <div className="flex items-center gap-1.5 border-l border-border pl-3">
                  <span className="text-[11px] text-text-muted">Rows:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => pagination.onLimitChange?.(Number(e.target.value))}
                    className="bg-main-bg/80 border border-border rounded-lg px-2 py-0.5 text-xs text-text-main font-medium focus:outline-none focus:border-accent transition-colors cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              )}

              {pagination.isFetching && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium animate-pulse">
                  <Loader2 size={11} className="animate-spin" />
                  Updating...
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => pagination.onPageChange(0)}
                disabled={pagination.offset === 0 || pagination.isFetching}
                className="p-1.5 rounded-lg border border-border/80 bg-main-bg text-text-main hover:bg-hover hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft size={15} />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => pagination.onPageChange(Math.max(0, pagination.offset - pagination.limit))}
                disabled={pagination.offset === 0 || pagination.isFetching}
                className="p-1.5 rounded-lg border border-border/80 bg-main-bg text-text-main hover:bg-hover hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft size={15} />
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
                        'min-w-[30px] h-7 px-2 rounded-lg font-poppins text-xs font-semibold flex items-center justify-center transition-all cursor-pointer',
                        page === currentPage
                          ? 'bg-accent text-white shadow-[0_3px_10px_-2px_rgba(235,113,43,0.4)]'
                          : 'text-text-main hover:bg-hover hover:text-accent border border-transparent'
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
                className="p-1.5 rounded-lg border border-border/80 bg-main-bg text-text-main hover:bg-hover hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={15} />
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
                className="p-1.5 rounded-lg border border-border/80 bg-main-bg text-text-main hover:bg-hover hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DataTable;
