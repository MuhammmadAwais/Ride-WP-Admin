import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { type RecipientUser } from '../types';
import { MOCK_RECIPIENT_USERS } from '../utils/constants';

interface RecipientSelectorProps {
  initialSelectedIds: string[];
  onSelectComplete: (selectedUsers: RecipientUser[]) => void;
}

export default function RecipientSelector({ initialSelectedIds, onSelectComplete }: RecipientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return MOCK_RECIPIENT_USERS;
    const lowerQ = searchQuery.toLowerCase();
    return MOCK_RECIPIENT_USERS.filter(u => u.username.toLowerCase().includes(lowerQ));
  }, [searchQuery]);

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
    if (filteredUsers.length === 0) return false;
    return filteredUsers.every(u => selectedIds.has(u.id));
  }, [filteredUsers, selectedIds]);

  const toggleSelectAll = () => {
    const newSet = new Set(selectedIds);
    if (isAllSelected) {
      // Deselect all filtered users
      filteredUsers.forEach(u => newSet.delete(u.id));
    } else {
      // Select all filtered users
      filteredUsers.forEach(u => newSet.add(u.id));
    }
    setSelectedIds(newSet);
  };

  const handleComplete = () => {
    const selectedUsers = MOCK_RECIPIENT_USERS.filter(u => selectedIds.has(u.id));
    onSelectComplete(selectedUsers);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-red-500/20 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted/60">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search matching users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-main-bg border border-border rounded-xl pl-10 pr-4 text-text-main font-roboto focus:outline-none focus:border-[#EB712B] transition-colors placeholder:text-text-muted/50 text-[14px]"
          />
        </div>
        
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">Select Users</h3>
          <button 
            type="button"
            onClick={toggleSelectAll}
            className="text-[#EB712B] border border-[#EB712B]/20 bg-[#EB712B]/5 hover:bg-[#EB712B]/10 font-poppins font-bold text-[10px] sm:text-[11px] uppercase tracking-wider py-2 px-4 rounded-lg transition-colors select-none"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Recipient User Grid Table / List */}
      <div className="w-full overflow-hidden border border-border rounded-2xl bg-main-bg/30">
        <div className="divide-y divide-border max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              onClick={() => toggleUser(user.id)}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-hover transition-colors group"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${selectedIds.has(user.id) ? 'border-[#EB712B] bg-[#EB712B]' : 'border-border group-hover:border-[#EB712B]'}`}>
                {selectedIds.has(user.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <span className="font-roboto text-text-main text-[14px] font-medium leading-none select-none">
                {highlightText(user.username, searchQuery)}
              </span>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-text-muted font-roboto text-sm">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Done CTA */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={handleComplete}
          className="w-full sm:w-auto bg-[#EB712B] hover:bg-[#d66524] text-white font-poppins font-bold text-[11px] sm:text-[12px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm cursor-pointer select-none"
        >
          Select Recipients
        </button>
      </div>

    </div>
  );
}
