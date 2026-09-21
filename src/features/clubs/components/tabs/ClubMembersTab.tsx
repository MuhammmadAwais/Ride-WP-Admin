import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Crown, Shield, ShieldCheck, Bike, 
  Search, ExternalLink, Calendar, Mail, Phone 
} from 'lucide-react';
import type { ClubMember } from '../../types/clubTypes';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';

interface ClubMembersTabProps {
  members: ClubMember[];
  ownerId?: number;
}

export const ClubMembersTab: React.FC<ClubMembersTabProps> = ({ members, ownerId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize member records across all potential backend shapes
  const normalizedMembers = useMemo(() => {
    return members.map((m, index) => {
      const userId = Number(m.userId || m.user?.id || m.id || 0);
      const name =
        m.fullName ||
        m.name ||
        m.user?.fullName ||
        m.userName ||
        m.user?.userName ||
        `Club Member #${index + 1}`;

      const email = m.email || m.user?.email || null;
      const phone = m.phone || m.phoneNo || m.user?.phone || null;
      const avatar = m.profileImage || m.profilePhoto || m.avatar || m.user?.profileImage || null;

      const rawRole = String(m.role || m.user?.role || 'Member').toLowerCase();
      const isOwner = Boolean(userId && ownerId && userId === ownerId) || rawRole === 'owner';
      const isAdmin = isOwner || rawRole === 'admin';
      const isOrganizer = rawRole === 'organizer';
      const isAthlete = rawRole === 'athlete' || Boolean(m.isAthleteProfile) || Boolean(m.user?.isAthleteProfile);

      let role: 'Owner' | 'Admin' | 'Organizer' | 'Athlete' | 'Member' = 'Member';
      if (isOwner) role = 'Owner';
      else if (isAdmin) role = 'Admin';
      else if (isOrganizer) role = 'Organizer';
      else if (isAthlete) role = 'Athlete';

      const rawDate = m.joinedDate || m.createdAt || m.user?.createdAt;
      let joinedDate = '—';
      if (rawDate) {
        try {
          joinedDate = new Date(rawDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          joinedDate = '—';
        }
      }

      const isSuspended = Boolean(m.isSuspended || m.status?.toLowerCase() === 'suspended');

      return {
        id: m.id || index + 1,
        userId,
        name,
        email,
        phone,
        avatar,
        role,
        joinedDate,
        isSuspended,
      };
    });
  }, [members, ownerId]);

  // Client-side search filter
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return normalizedMembers;
    const query = searchTerm.toLowerCase();
    return normalizedMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        m.role.toLowerCase().includes(query)
    );
  }, [normalizedMembers, searchTerm]);

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Users size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Members Found</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This club currently has no active enrolled members or athlete records.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<(typeof normalizedMembers)[0]>[] = [
    {
      header: 'Athlete / Member',
      accessorKey: (m) => (
        <div className="flex items-center gap-3.5">
          <UserAvatar
            src={m.avatar}
            name={m.name}
            size="md"
            showStatus
            isSuspended={m.isSuspended}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-poppins font-bold text-text-main text-sm truncate">
                {m.name}
              </span>
              {m.userId > 0 && (
                <Link
                  to={`/users/${m.userId}`}
                  className="text-text-muted hover:text-accent transition-colors p-0.5 rounded"
                  title="View Athlete Dossier"
                >
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
            <span className="text-xs font-roboto text-text-muted truncate flex items-center gap-1">
              <Mail size={11} className="shrink-0 text-text-muted/70" />
              {m.email || 'No email provided'}
            </span>
          </div>
        </div>
      ),
      sortKey: 'name',
    },
    {
      header: 'Club Role',
      accessorKey: (m) => {
        if (m.role === 'Owner') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-bold bg-accent/15 text-accent border border-accent/30 shadow-sm">
              <Crown size={12} className="shrink-0 fill-accent/30" />
              Owner
            </span>
          );
        }
        if (m.role === 'Admin') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-bold bg-info/15 text-info border border-info/30 shadow-sm">
              <Shield size={12} className="shrink-0" />
              Admin
            </span>
          );
        }
        if (m.role === 'Organizer') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-bold bg-success/15 text-success border border-success/30 shadow-sm">
              <ShieldCheck size={12} className="shrink-0" />
              Organizer
            </span>
          );
        }
        if (m.role === 'Athlete') {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm">
              <Bike size={12} className="shrink-0" />
              Athlete
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-roboto font-medium bg-surface border border-border text-text-muted">
            Member
          </span>
        );
      },
      sortKey: 'role',
    },
    {
      header: 'Contact',
      accessorKey: (m) => (
        <span className="text-xs font-roboto text-text-muted flex items-center gap-1.5">
          <Phone size={12} className="shrink-0 text-text-muted/60" />
          {m.phone || '—'}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      accessorKey: (m) => (
        <span className="text-xs font-roboto text-text-muted flex items-center gap-1.5">
          <Calendar size={12} className="shrink-0 text-text-muted/60" />
          {m.joinedDate}
        </span>
      ),
    },
    {
      header: 'Action',
      accessorKey: (m) =>
        m.userId > 0 ? (
          <Link
            to={`/users/${m.userId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-accent/40 text-text-main hover:text-accent font-poppins text-xs font-semibold transition-all shadow-sm"
          >
            <span>Dossier</span>
            <ExternalLink size={12} />
          </Link>
        ) : (
          <span className="text-xs text-text-muted/50">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            Club Members
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {filteredMembers.length}
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Manage athletes, organizers, and view linked user dossiers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members by name or role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-text-main placeholder:text-text-muted/60 font-roboto text-xs focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <DataTable data={filteredMembers} columns={columns} keyExtractor={(m) => m.id.toString()} />
    </div>
  );
};
