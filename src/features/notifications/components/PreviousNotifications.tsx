import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { MOCK_NOTIFICATION_HISTORY } from '../utils/constants';
import { type NotificationHistoryItem } from '../types';

export default function PreviousNotifications() {
  
  const columns: ColumnDef<NotificationHistoryItem>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      sortKey: 'timestamp',
    },
    {
      header: 'Target Segment',
      accessorKey: (row) => (
        <span className="bg-text-muted/10 border border-border text-text-main text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
          {row.targetSegment}
        </span>
      ),
      sortKey: 'targetSegment',
    },
    {
      header: 'Notification Detail',
      accessorKey: (row) => (
        <div className="py-1">
          <p className="font-poppins font-bold text-text-main text-sm mb-0.5">{row.title}</p>
          <p className="text-xs text-text-muted line-clamp-1 leading-normal">{row.snippet}</p>
        </div>
      ),
      sortKey: 'title',
    },
    {
      header: 'Status',
      accessorKey: (row) => (
        <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${row.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 'bg-red-500/10 text-red-500 dark:text-red-400'}`}>
          {row.status}
        </span>
      ),
      sortKey: 'status',
    }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      <div className="flex items-center justify-between">
        <h3 className="font-poppins font-bold text-text-main text-lg tracking-tight">Notification History Log</h3>
      </div>

      {/* Unified Sortable DataTable */}
      <div className="w-full overflow-hidden border border-border rounded-2xl bg-surface">
        <DataTable data={MOCK_NOTIFICATION_HISTORY} columns={columns} keyExtractor={(row) => row.id} />
      </div>

    </div>
  );
}
