import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2, AlertCircle, RefreshCw, Shield, Phone, Calendar, Users as UsersIcon } from 'lucide-react';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUsersListQuery } from '../api/userApi';
import type { UserListItem } from '../types/userTypes';
import { UserAvatar } from '@/Components/common/UserAvatar';

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearchTerm]);

  const { data, isLoading, isError, refetch, isFetching } = useGetUsersListQuery({
    search: debouncedSearchTerm || undefined,
    offset,
    limit,
  });

  const users = data?.users ?? [];
  const total = data?.pagination?.total ?? users.length;

  const columns: ColumnDef<UserListItem>[] = [
    {
      header: 'Athlete',
      accessorKey: (row) => (
        <div className="flex items-center gap-3.5 min-w-[220px]">
          <Link to={`/users/${row.id}`} className="shrink-0 group">
            <UserAvatar
              src={row.profileImage}
              name={row.fullName}
              size="md"
              showStatus={true}
              isSuspended={row.isSuspended}
              className="group-hover:scale-105 transition-transform"
            />
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              to={`/users/${row.id}`}
              className="font-poppins font-bold text-sm text-text-main hover:text-accent transition-colors truncate"
              title={row.fullName}
            >
              {row.fullName || 'Anonymous Rider'}
            </Link>
            <span className="font-roboto text-xs text-text-muted truncate" title={row.email}>
              {row.email}
            </span>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'fullName',
    },
    {
      header: 'Phone',
      accessorKey: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-roboto text-text-muted">
          {row.phone ? (
            <>
              <Phone size={13} className="text-accent shrink-0" />
              <span>{row.phone}</span>
            </>
          ) : (
            <span className="text-text-muted/60">—</span>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      header: 'Clubs',
      accessorKey: (row) => (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-xl text-xs font-bold text-text-main shadow-xs">
          <Shield size={13} className="text-accent shrink-0" />
          <span>{row.clubsJoined ?? 0}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'clubsJoined',
    },
    {
      header: 'Plan',
      accessorKey: (row) => {
        const plan = row.subscriptionPlan || 'Free';
        const isPaid = plan.toLowerCase().includes('monthly') || plan.toLowerCase().includes('pro') || plan.toLowerCase().includes('gold') || plan.toLowerCase().includes('diamond');
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
              isPaid
                ? 'bg-accent/10 text-accent border-accent/25'
                : 'bg-surface text-text-muted border-border'
            }`}
          >
            {plan}
          </span>
        );
      },
      sortable: true,
      sortKey: 'subscriptionPlan',
    },
    {
      header: 'Membership Validity',
      accessorKey: (row) => (
        <div className="flex flex-col text-xs font-roboto text-text-muted">
          {row.startDate && row.endDate ? (
            <>
              <span className="text-text-main font-medium">
                {new Date(row.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[11px] text-text-muted/70">
                to {new Date(row.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </>
          ) : (
            <span className="text-text-muted/60">—</span>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      header: 'Joined',
      accessorKey: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-roboto text-text-muted">
          <Calendar size={13} className="text-text-muted/60 shrink-0" />
          <span>
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A'}
          </span>
        </div>
      ),
      sortable: true,
      sortKey: 'createdAt',
    },
    {
      header: 'Status',
      accessorKey: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
            row.isSuspended
              ? 'bg-error/10 text-error border-error/25'
              : 'bg-success/10 text-success border-success/25'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              row.isSuspended ? 'bg-error' : 'bg-success'
            }`}
          />
          {row.isSuspended ? 'Suspended' : 'Active'}
        </span>
      ),
      sortable: true,
      sortKey: 'isSuspended',
    },
    {
      header: '',
      accessorKey: (row) => (
        <UserActionsMenu
          userId={row.id}
          isSuspended={row.isSuspended}
          userName={row.fullName}
        />
      ),
      sortable: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-full space-y-8 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-poppins font-black text-3xl text-text-main tracking-tight">
              Athletes Directory
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-xl text-xs font-bold text-accent shadow-xs">
              <UsersIcon size={14} />
              <span>{total} {total === 1 ? 'Athlete' : 'Athletes'}</span>
            </span>
          </div>
          <p className="font-roboto text-sm text-text-muted mt-1.5 max-w-2xl">
            Monitor registered platform riders, manage membership and subscription tiers, and moderate account activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
              <Search size={18} className="text-text-muted/50 group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-surface border border-border text-text-main text-sm rounded-2xl pl-12 pr-10 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-text-muted/40 shadow-sm backdrop-blur-xl"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/40 hover:text-accent transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center p-3.5 rounded-2xl bg-surface border border-border text-text-main hover:bg-hover hover:text-accent hover:border-accent/30 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-sm"
            title="Refresh list"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin text-accent' : ''} />
          </button>
        </div>
      </div>

      {/* Table Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-surface/50 border border-border rounded-2xl">
          <Loader2 size={36} className="animate-spin text-accent mb-3" />
          <p className="text-text-muted text-sm font-roboto">Loading athlete directory...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-error/5 border border-error/20 rounded-2xl text-center px-4">
          <AlertCircle size={36} className="text-error mb-3" />
          <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load athletes</h3>
          <p className="text-text-muted text-sm font-roboto max-w-md mb-4">
            Could not retrieve athlete records from the backend API. Please check network connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins text-sm font-medium hover:brightness-105 transition-all shadow-sm cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <DataTable
            data={users}
            columns={columns}
            searchTerm={debouncedSearchTerm}
            keyExtractor={(item) => String(item.id)}
            pagination={{
              total,
              offset,
              limit,
              onPageChange: (newOffset) => {
                setOffset(newOffset);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
              onLimitChange: (newLimit) => {
                setLimit(newLimit);
                setOffset(0);
              },
              isFetching,
            }}
          />
        </div>
      )}
    </div>
  );
}
