import { useState, useMemo } from 'react';
import { Search, User, X } from 'lucide-react';
import { MOCK_USERS, type User as UserType } from '../utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { useDebounce } from '@/hooks/useDebounce';

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Filter data based on debounced search term
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return MOCK_USERS;
    
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return MOCK_USERS.filter((user) => {
      return (
        user.name.toLowerCase().includes(lowerSearch) ||
        user.phoneNo.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.startDate.toLowerCase().includes(lowerSearch) ||
        user.endDate.toLowerCase().includes(lowerSearch)
      );
    });
  }, [debouncedSearchTerm]);

  const columns: ColumnDef<UserType>[] = [
    {
      header: 'Profile Photo',
      accessorKey: (row) => (
        <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center flex-shrink-0 border border-border overflow-hidden">
          {row.profilePhoto ? (
            <img src={row.profilePhoto} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-accent/30" />
          )}
        </div>
      ),
      sortable: false,
    },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Phone no.', accessorKey: 'phoneNo' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Clubs Joined', accessorKey: 'clubsJoined' },
    { header: 'Subscription plan', accessorKey: 'subscriptionPlan' },
    { header: 'Start Date', accessorKey: 'startDate' },
    { header: 'End Date', accessorKey: 'endDate' },
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
