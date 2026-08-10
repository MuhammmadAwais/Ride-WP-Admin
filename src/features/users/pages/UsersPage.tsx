import { useState, useEffect } from 'react';
import { Search, User, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUsersListQuery } from '../api/userApi';
import type { UserListItem } from '../types/userTypes';
import { SafeImage } from '@/Components/common/SafeImage';

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    // eslint-disable-next-line
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
      header: 'Profile Photo',
      accessorKey: (row) => (
        <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center flex-shrink-0 border border-border overflow-hidden">
          <SafeImage
            src={row.profileImage}
            alt={row.fullName}
            className="w-full h-full object-cover"
            fallback={<User size={20} className="text-accent/30" />}
          />
        </div>
      ),
      sortable: false,
    },
    { header: 'Name', accessorKey: 'fullName', sortable: true },
    { header: 'Phone no.', accessorKey: (row) => row.phone || 'N/A' },
    { header: 'Email', accessorKey: 'email', sortable: true },
    { header: 'Clubs Joined', accessorKey: 'clubsJoined', sortable: true },
    { header: 'Subscription plan', accessorKey: 'subscriptionPlan', sortable: true },
    { 
      header: 'Start Date', 
      accessorKey: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : 'N/A' 
    },
    { 
      header: 'End Date', 
      accessorKey: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : 'N/A' 
    },
    {
      header: '',
      accessorKey: (row) => <UserActionsMenu userId={row.id} />,
      sortable: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-full space-y-8 pb-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-poppins font-bold text-3xl text-text-main tracking-tight">Users Management</h1>
          <p className="font-roboto text-[15px] text-text-muted mt-1.5 max-w-2xl">
            Efficiently manage your community members, track subscription statuses, and moderate user activity with advanced administrative tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
              <Search size={18} className="text-text-muted/50 group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-surface border border-border text-text-main text-sm rounded-2xl pl-12 pr-10 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-text-muted/40 shadow-sm backdrop-blur-xl"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/40 hover:text-accent transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center p-3.5 rounded-2xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 border border-accent/20 disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* State Handlers & Data Table Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/50 border border-border rounded-2xl">
          <Loader2 size={36} className="animate-spin text-accent mb-3" />
          <p className="text-text-muted text-sm font-roboto">Loading user directory...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-500/5 border border-red-500/20 rounded-2xl text-center px-4">
          <AlertCircle size={36} className="text-red-500 mb-3" />
          <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load users</h3>
          <p className="text-text-muted text-sm font-roboto max-w-md mb-4">
            There was an issue retrieving user data from the live API. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Retry
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
