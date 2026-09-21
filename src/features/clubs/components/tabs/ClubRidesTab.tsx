import React, { useState } from 'react';
import { Bike, Navigation, Calendar, Users, Eye, MapPin } from 'lucide-react';
import type { ClubRide } from '../../types/clubTypes';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { RideDetailModal } from '@/features/users/components/RideDetailModal';
import type { UserRide } from '@/features/users/types/userTypes';

interface ClubRidesTabProps {
  rides: ClubRide[];
}

export const ClubRidesTab: React.FC<ClubRidesTabProps> = ({ rides }) => {
  const [selectedRide, setSelectedRide] = useState<UserRide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInspect = (r: ClubRide) => {
    // Adapt ClubRide to UserRide interface for RideDetailModal
    const userRide: UserRide = {
      id: r.id,
      dateTime: r.date && r.time ? `${r.date}T${r.time}` : r.date || new Date().toISOString(),
      route: `${r.meetingPoint || 'Start Point'} → ${r.endingPoint || 'TBD'}`,
      hostName: (r as any).hostName || (r as any).leader || 'Club Ride Leader',
      status: (r as any).status || 'Scheduled',
      distance: r.distance,
      pace: r.pace,
      participantsCount: r.participantsCount || 0,
      rideName: r.rideName,
      gpxFile: (r as any).gpxFile || null,
    };
    setSelectedRide(userRide);
    setIsModalOpen(true);
  };

  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Navigation size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Rides Scheduled</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This club has not published any group rides, training runs, or community routes yet.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<ClubRide>[] = [
    {
      header: 'Ride Event',
      accessorKey: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <Bike size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-poppins font-bold text-text-main text-sm truncate">
              {r.rideName}
            </span>
            <span className="text-xs font-roboto text-text-muted flex items-center gap-1">
              <MapPin size={11} className="shrink-0 text-text-muted/70" />
              {r.meetingPoint}
            </span>
          </div>
        </div>
      ),
      sortKey: 'rideName',
    },
    {
      header: 'Route Course',
      accessorKey: (r) => (
        <span className="text-xs font-roboto text-text-main font-medium">
          {r.meetingPoint} → {r.endingPoint || 'TBD'}
        </span>
      ),
    },
    {
      header: 'Date & Time',
      accessorKey: (r) => {
        try {
          const d = new Date(r.date);
          const dateStr = d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          return (
            <span className="text-xs font-roboto text-text-muted flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0 text-text-muted/60" />
              {dateStr} {r.time ? `• ${r.time}` : ''}
            </span>
          );
        } catch {
          return <span className="text-xs font-roboto text-text-muted">{r.date}</span>;
        }
      },
      sortKey: 'date',
    },
    {
      header: 'Peloton / Group',
      accessorKey: (r) => (
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-accent" />
          <span className="text-xs font-roboto font-bold text-text-main">
            {r.participantsCount || 0} participants
          </span>
        </div>
      ),
    },
    {
      header: 'Pace & Distance',
      accessorKey: (r) => (
        <div className="flex items-center gap-2">
          {r.distance && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-poppins font-bold bg-surface border border-border text-text-main">
              {r.distance}
            </span>
          )}
          {r.pace && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-roboto text-text-muted bg-surface border border-border">
              {r.pace}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Action',
      accessorKey: (r) => (
        <button
          onClick={() => handleInspect(r)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-accent/40 text-text-main hover:text-accent font-poppins text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Eye size={13} />
          <span>Inspect</span>
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            Club Rides
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {rides.length}
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Official group events, training pelotons, and GPX navigation details.
          </p>
        </div>
      </div>

      <DataTable data={rides} columns={columns} keyExtractor={(r) => r.id.toString()} />

      {/* Deep Inspection Modal */}
      <RideDetailModal
        ride={selectedRide}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
