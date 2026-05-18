import { useState } from 'react';
import { Search, Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { MOCK_CLUBS, type Club } from '@/features/users/utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { ClubActionsMenu } from '../components/ClubActionsMenu';
import { useDebounce } from '@/hooks/useDebounce';

export default function ClubsPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const navigate = useNavigate();

  // Filter clubs based on search input
  const filteredData = MOCK_CLUBS.filter((club) => {
    if (!debouncedSearchTerm) return true;
    const term = debouncedSearchTerm.toLowerCase();
    return (
      club.name.toLowerCase().includes(term) ||
      club.email.toLowerCase().includes(term) ||
      club.phoneNo.includes(term) ||
      club.founderName.toLowerCase().includes(term)
    );
  });

  const columns: ColumnDef<Club>[] = [
    {
      header: 'Club Photo',
      accessorKey: (row) => (
        <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0 border border-border overflow-hidden">
          {row.clubPhoto ? (
            <img src={row.clubPhoto} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <Shield size={20} className="text-accent/40" />
          )}
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
          {row.name}
        </button>
      ),
      sortKey: 'name',
    },
    {
      header: 'Club Type',
      accessorKey: 'clubType',
    },
    {
      header: 'Phone no.',
      accessorKey: 'phoneNo',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Founder Name',
      accessorKey: 'founderName',
    },
    {
      header: 'Subscription plan',
      accessorKey: 'subscriptionPlan',
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
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
          
          <button className="hidden sm:flex items-center justify-center p-3.5 rounded-2xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 border border-accent/20">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Data Table Area */}
      <div className="flex-1 min-h-0">
        <DataTable
          data={filteredData}
          columns={columns}
          searchTerm={debouncedSearchTerm}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
