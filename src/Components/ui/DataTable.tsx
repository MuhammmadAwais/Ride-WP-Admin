import React, { useRef } from 'react';
import { useTableSort } from '@/hooks/useTableSort';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T; // Used if accessorKey is a function
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchTerm?: string;
  keyExtractor: (item: T) => string;
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
          <mark key={i} className="bg-red-500/20 text-red-200 px-1 rounded inline-block">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function DataTable<T>({ data, columns, searchTerm = '', keyExtractor }: DataTableProps<T>) {
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

  return (
    <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-border bg-surface/80 backdrop-blur-2xl shadow-lg">
      <table className="w-full min-w-[800px] text-left border-collapse">
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
  );
}
