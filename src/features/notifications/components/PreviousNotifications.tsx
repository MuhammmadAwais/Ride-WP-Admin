import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { useGetNotificationHistoryQuery } from '../api/notificationApi';
import type { NotificationHistoryApiItem } from '../types/notificationApiTypes';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function PreviousNotifications() {
  const { data, isLoading, isError, refetch, isFetching } = useGetNotificationHistoryQuery({
    offset: 0,
    limit: 20,
  });

  const notifications = data?.notifications ?? [];

  const columns: ColumnDef<NotificationHistoryApiItem>[] = [
    {
      header: 'Timestamp',
      accessorKey: (row) => row.sentAt ? new Date(row.sentAt).toLocaleString() : 'N/A',
      sortKey: 'sentAt',
    },
    {
      header: 'Target Segment',
      accessorKey: (row) => (
        <span className="bg-text-muted/10 border border-border text-text-main text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
          {row.isAllUser ? 'All Users' : `Specific Users (${row.recipientsCount})`}
        </span>
      ),
    },
    {
      header: 'Notification Detail',
      accessorKey: (row) => (
        <div className="py-1">
          <p className="font-poppins font-bold text-text-main text-sm mb-0.5">{row.title}</p>
          <p className="text-xs text-text-muted line-clamp-1 leading-normal">{row.body}</p>
        </div>
      ),
      sortKey: 'title',
    },
    {
      header: 'Recipients',
      accessorKey: (row) => (
        <span className="font-poppins font-semibold text-xs text-text-main">
          {row.recipientsCount ?? (row.isAllUser ? 'All' : 0)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: () => (
        <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
          Delivered
        </span>
      ),
    }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      <div className="flex items-center justify-between">
        <h3 className="font-poppins font-bold text-text-main text-lg tracking-tight">Notification History Log</h3>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all text-xs font-poppins font-medium disabled:opacity-50"
          title="Refresh history"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface/50 border border-border rounded-2xl">
          <Loader2 size={32} className="animate-spin text-accent mb-3" />
          <p className="text-text-muted text-sm font-roboto">Loading notification history...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 bg-red-500/5 border border-red-500/20 rounded-2xl text-center px-4">
          <AlertCircle size={32} className="text-red-500 mb-2" />
          <p className="text-text-main font-poppins font-medium text-sm mb-3">Failed to load notification history</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-accent text-white font-poppins text-xs font-medium hover:bg-accent/90"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Unified Sortable DataTable */
        <div className="w-full overflow-hidden border border-border rounded-2xl bg-surface">
          <DataTable data={notifications} columns={columns} keyExtractor={(row) => String(row.id)} />
        </div>
      )}

    </div>
  );
}
