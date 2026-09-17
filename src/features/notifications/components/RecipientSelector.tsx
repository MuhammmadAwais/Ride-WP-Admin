/**
 * @fileoverview Lightweight Recipient Selector for Push Notifications.
 * Connects to useGetUsersPickerQuery (GET /admin/users/picker) with search,
 * avatar initials/image rendering, and multi-select toggling.
 */
import { useState, useMemo } from 'react';
import { Search, Loader2, UserCheck, Check, User } from 'lucide-react';
import { type RecipientUser } from '../types';
import { useGetUsersPickerQuery } from '../api/notificationApi';

interface RecipientSelectorProps {
  initialSelectedIds: string[];
  onSelectComplete: (selectedUsers: RecipientUser[]) => void;
}

export default function RecipientSelector({
  initialSelectedIds,
  onSelectComplete,
}: RecipientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));

  const { data, isLoading } = useGetUsersPickerQuery({
    search: searchQuery || undefined,
    offset: 0,
    limit: 50,
  });

  const availableUsers: RecipientUser[] = useMemo(() => {
    return (data?.users || []).map((u) => ({
      id: String(u.id),
      username: u.email ? `${u.fullName} (${u.email})` : u.fullName,
    }));
  }, [data?.users]);

  const rawUsers = data?.users || [];

  const toggleUser = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const isAllSelected = useMemo(() => {
    if (availableUsers.length === 0) return false;
    return availableUsers.every((u) => selectedIds.has(u.id));
  }, [availableUsers, selectedIds]);

  const toggleSelectAll = () => {
    const newSet = new Set(selectedIds);
    if (isAllSelected) {
      availableUsers.forEach((u) => newSet.delete(u.id));
    } else {
      availableUsers.forEach((u) => newSet.add(u.id));
    }
    setSelectedIds(newSet);
  };

  const handleComplete = () => {
    const selectedUsers = availableUsers.filter((u) => selectedIds.has(u.id));
    onSelectComplete(selectedUsers);
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search platform users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-main-bg border border-border rounded-xl pl-10 pr-4 text-text-main font-roboto focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-colors placeholder:text-text-muted/50 text-[14px]"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">
              Select Recipients
            </h3>
            {selectedIds.size > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-poppins text-xs font-semibold">
                {selectedIds.size} selected
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 font-poppins font-bold text-[11px] uppercase tracking-wider py-2 px-4 rounded-xl transition-colors cursor-pointer select-none"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Recipient User Grid Table / List */}
      <div className="w-full overflow-hidden border border-border rounded-2xl bg-main-bg/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-accent mb-2" />
            <p className="text-text-muted text-xs font-roboto">Querying recipient directory...</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {rawUsers.map((user) => {
              const strId = String(user.id);
              const isSelected = selectedIds.has(strId);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(strId)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-hover transition-colors group ${
                    isSelected ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border group-hover:border-accent/50'
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 overflow-hidden font-poppins font-bold text-sm">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{user.fullName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <p className="font-poppins font-semibold text-sm text-text-main truncate">
                        {user.fullName}
                      </p>
                      {user.email && (
                        <p className="font-roboto text-xs text-text-muted truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-text-muted/60 shrink-0 ml-3">
                    ID #{user.id}
                  </span>
                </div>
              );
            })}

            {rawUsers.length === 0 && (
              <div className="p-12 text-center text-text-muted font-roboto text-sm">
                <User size={32} className="mx-auto mb-2 opacity-40 text-text-muted" />
                No users found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Done CTA */}
      <div className="pt-2 flex items-center justify-between">
        <p className="font-roboto text-xs text-text-muted">
          {selectedIds.size} recipient{selectedIds.size === 1 ? '' : 's'} queued for notification
        </p>
        <button
          type="button"
          onClick={handleComplete}
          className="bg-accent hover:bg-accent/90 text-white font-poppins font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-xl transition-all shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] cursor-pointer flex items-center gap-2"
        >
          <UserCheck size={16} />
          <span>Apply Selection ({selectedIds.size})</span>
        </button>
      </div>
    </div>
  );
}
