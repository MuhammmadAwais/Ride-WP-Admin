import { useState, useEffect } from 'react';
import { Search, Shield, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { ClubActionsMenu } from '../components/ClubActionsMenu';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetClubsListQuery } from '../api/clubApi';
import type { ClubListItem } from '../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';

export default function ClubsPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    // eslint-disable-next-line
    setOffset(0);
  }, [debouncedSearchTerm]);

  const { data, isLoading, isError, refetch, isFetching } = useGetClubsListQuery({
    search: debouncedSearchTerm || undefined,
    offset,
    limit,
  });

  const clubs = data?.clubs ?? [];
  const total = data?.pagination?.total ?? clubs.length;

  const columns: ColumnDef<ClubListItem>[] = [
    {
      header: 'Club Logo',
      accessorKey: (row) => (
        <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0 border border-border overflow-hidden">
          <SafeImage
            src={row.logo}
            alt={row.clubName}
            className="w-full h-full object-cover"
            fallback={<Shield size={20} className="text-accent/40" />}
          />
        </div>
      ),
      sortable: false,
    },
    {
      header: 'Name',
      accessorKey: (row) => (
        <button
          onClick={() => navigate(`${ROUTES.CLUBS}/${row.id}`)}
          className="font-poppins font-semibold text-text-main hover:text-accent transition-colors text-left focus:outline-none"
        >
          {row.clubName}
        </button>
      ),
      sortKey: 'clubName',
    },
    {
      header: 'Club Type',
      accessorKey: 'clubTypeName',
    },
    {
      header: 'Privacy',
      accessorKey: 'clubPrivacyName',
    },
    {
      header: 'Email',
      accessorKey: (row) => row.owner?.email || 'N/A',
    },
    {
      header: 'Founder Name',
      accessorKey: (row) => row.owner?.fullName || 'N/A',
    },
    {
      header: 'Members',
      accessorKey: (row) => String(row.participantCount || 0),
    },
    {
      header: 'Created Date',
      accessorKey: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A',
    },
    {
      header: '',
      accessorKey: (row) => <ClubActionsMenu clubId={row.id} />,
      sortable: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-full space-y-8 pb-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-poppins font-bold text-3xl text-text-main tracking-tight">Clubs Management</h1>
          <p className="font-roboto text-[15px] text-text-muted mt-1.5 max-w-2xl">
            Monitor and manage all clubs within the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
              <Search size={18} className="text-text-muted/50 group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder="Search clubs..."
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
          <p className="text-text-muted text-sm font-roboto">Loading clubs directory...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-500/5 border border-red-500/20 rounded-2xl text-center px-4">
          <AlertCircle size={36} className="text-red-500 mb-3" />
          <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load clubs</h3>
          <p className="text-text-muted text-sm font-roboto max-w-md mb-4">
            There was an issue retrieving club data from the live API. Please try again.
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
            data={clubs}
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
