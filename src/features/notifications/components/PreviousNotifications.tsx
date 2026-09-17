/**
 * @fileoverview Previous Notifications Audit Log table.
 * Connects to useGetNotificationHistoryQuery (GET /admin/notifications/history),
 * rendering dynamic delivery status badges, recipients breakdown, image previews, and timestamps.
 */
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { useGetNotificationHistoryQuery } from '../api/notificationApi';
import type { NotificationHistoryApiItem } from '../types/notificationApiTypes';
import { Loader2, AlertCircle, RefreshCw, Send, Bell } from 'lucide-react';

export default function PreviousNotifications() {
  const { data, isLoading, isError, refetch, isFetching } = useGetNotificationHistoryQuery({
    offset: 0,
    limit: 50,
  });

  const notifications = data?.history ?? data?.notifications ?? [];

  const columns: ColumnDef<NotificationHistoryApiItem>[] = [
    {
      header: 'Timestamp',
      accessorKey: (row) => {
        const timeStr = row.createdAt || row.sentAt;
        return timeStr ? new Date(timeStr).toLocaleString() : 'N/A';
      },
      sortKey: 'createdAt',
    },
    {
      header: 'Target Segment',
      accessorKey: (row) => {
        const isAll = row.targetSegment === 'all' || row.isAllUser;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-poppins border ${
              isAll
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}
          >
            {isAll ? 'All Users' : `Specific (${row.recipientsCount ?? 0})`}
          </span>
        );
      },
    },
    {
      header: 'Notification Detail',
      accessorKey: (row) => {
        const img = row.imageUrl || row.image;
        return (
          <div className="py-1">
            <div className="flex items-center gap-2.5">
              {img && (
                <img
                  src={img}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover border border-border shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <p className="font-poppins font-semibold text-text-main text-sm">
                  {row.title}
                </p>
                <p className="text-xs text-text-muted line-clamp-1 leading-normal mt-0.5">
                  {row.body}
                </p>
              </div>
            </div>
          </div>
        );
      },
      sortKey: 'title',
    },
    {
      header: 'Recipients',
      accessorKey: (row) => {
        const isAll = row.targetSegment === 'all' || row.isAllUser;
        return (
          <span className="font-poppins font-semibold text-xs text-text-main">
            {isAll ? 'Platform-wide' : (row.recipientsCount ?? 0)}
          </span>
        );
      },
    },
    {
      header: 'Delivery Status',
      accessorKey: (row) => {
        const isFailed = (row.status || '').toUpperCase() === 'FAILED';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-poppins border ${
              isFailed
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isFailed ? 'bg-red-400' : 'bg-emerald-400'}`}
            />
            {row.status || 'DELIVERED'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-poppins font-bold text-text-main text-lg tracking-tight">
            Notification Transmission Logs
          </h3>
          <p className="font-roboto text-xs text-text-muted mt-0.5">
            Audit history of broadcasts, recipient targets, and delivery confirmations
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text-main transition-all text-xs font-poppins font-semibold disabled:opacity-50 cursor-pointer"
          title="Refresh history"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin text-accent' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/50 border border-border rounded-3xl">
          <Loader2 size={32} className="animate-spin text-accent mb-3" />
          <p className="text-text-muted text-sm font-roboto">Loading transmission logs...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-500/5 border border-red-500/20 rounded-3xl text-center px-4">
          <AlertCircle size={32} className="text-red-400 mb-2" />
          <p className="text-text-main font-poppins font-semibold text-sm mb-3">
            Failed to load notification history
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 rounded-xl bg-accent text-white font-poppins text-xs font-bold hover:bg-accent/90 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-border rounded-3xl bg-surface text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3">
            <Bell size={22} />
          </div>
          <h4 className="font-poppins font-bold text-base text-text-main">No Dispatched Notifications</h4>
          <p className="font-roboto text-xs text-text-muted max-w-xs mt-1">
            You have not transmitted any push notifications yet.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden border border-border rounded-3xl bg-surface shadow-sm">
          <DataTable
            data={notifications}
            columns={columns}
            keyExtractor={(row) => String(row.id)}
          />
        </div>
      )}
    </div>
  );
}
