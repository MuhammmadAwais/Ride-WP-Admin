import React, { useState } from 'react';
import { 
  Bike, 
  Compass, 
  Mountain, 
  Footprints, 
  Moon, 
  MapPin, 
  Users, 
  Gauge, 
  Calendar,
  Filter
} from 'lucide-react';
import { MOCK_LIVE_RIDES } from '../utils/constants';
import { type LiveRideLog } from '../types';

export default function RecentRidesTable() {
  const [filter, setFilter] = useState<'ALL' | 'Ongoing' | 'Scheduled' | 'Completed'>('ALL');
  const [search, setSearch] = useState('');

  const filteredRides = MOCK_LIVE_RIDES.filter((ride) => {
    const matchesFilter = filter === 'ALL' || ride.status === filter;
    const matchesSearch = 
      ride.title.toLowerCase().includes(search.toLowerCase()) ||
      ride.club.toLowerCase().includes(search.toLowerCase()) ||
      ride.departure.toLowerCase().includes(search.toLowerCase()) ||
      ride.user.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDisciplineIcon = (discipline: LiveRideLog['discipline']) => {
    switch (discipline) {
      case 'Road':
        return <Bike size={14} className="text-blue-500" />;
      case 'Gravel':
        return <Compass size={14} className="text-amber-500" />;
      case 'MTB':
        return <Mountain size={14} className="text-emerald-500" />;
      case 'Trail Run':
        return <Footprints size={14} className="text-purple-500" />;
      case 'Night Ride':
        return <Moon size={14} className="text-indigo-400" />;
      default:
        return <Bike size={14} className="text-[#EB712B]" />;
    }
  };

  const getStatusBadge = (status: LiveRideLog['status']) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Now
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Upcoming
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Completed
          </span>
        );
      case 'Full':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Capacity Full
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EB712B]" />
            <h3 className="font-poppins font-bold text-text-main text-lg tracking-tight">
              Coordinated Group Rides & Loops
            </h3>
          </div>
          <p className="font-roboto text-text-muted text-xs mt-0.5">
            Real-time tracking of pelotons, trail runs, and gravel adventures
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['ALL', 'Ongoing', 'Scheduled', 'Completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filter === f
                  ? 'bg-[#EB712B] text-white shadow-sm'
                  : 'bg-main-bg/50 text-text-muted hover:text-text-main border border-border'
              }`}
            >
              {f === 'ALL' ? 'All Activities' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 text-[11px] font-poppins font-bold uppercase tracking-wider text-text-muted">
              <th className="py-3 px-4">Ride Activity & ID</th>
              <th className="py-3 px-4">Club & Leader</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Route & Distance</th>
              <th className="py-3 px-4">Schedule / Pace</th>
              <th className="py-3 px-4">Fleet RSVP</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-roboto text-xs">
            {filteredRides.map((ride) => (
              <tr 
                key={ride.id}
                className="hover:bg-main-bg/40 transition-colors group"
              >
                {/* Activity & ID */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-main-bg/80 border border-border flex items-center justify-center shrink-0 group-hover:border-[#EB712B]/40 transition-colors">
                      {getDisciplineIcon(ride.discipline)}
                    </div>
                    <div>
                      <h4 className="font-poppins font-bold text-text-main text-[13px] group-hover:text-[#EB712B] transition-colors">
                        {ride.title}
                      </h4>
                      <span className="font-mono text-[10px] text-text-muted">
                        {ride.id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Club & Leader */}
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-semibold text-text-main">{ride.club}</p>
                    <p className="text-[11px] text-text-muted">Led by {ride.user}</p>
                  </div>
                </td>

                {/* Discipline */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-main-bg border border-border text-[11px] font-medium text-text-main">
                    {ride.discipline}
                  </span>
                </td>

                {/* Route & Distance */}
                <td className="py-3.5 px-4">
                  <div>
                    <div className="flex items-center gap-1 text-text-main font-medium">
                      <MapPin size={11} className="text-[#EB712B] shrink-0" />
                      <span className="truncate max-w-[150px]">{ride.departure}</span>
                    </div>
                    <p className="text-[11px] text-text-muted pl-3.5 font-semibold text-[#EB712B]">
                      {ride.distance}
                    </p>
                  </div>
                </td>

                {/* Schedule & Pace */}
                <td className="py-3.5 px-4">
                  <div>
                    <div className="flex items-center gap-1 text-text-main">
                      <Calendar size={11} className="text-text-muted shrink-0" />
                      <span>{ride.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                      <Gauge size={11} className="text-text-muted shrink-0" />
                      <span>{ride.pace}</span>
                    </div>
                  </div>
                </td>

                {/* Fleet / RSVP */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-main-bg rounded-full h-1.5 overflow-hidden border border-border">
                      <div 
                        className="bg-[#EB712B] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (ride.participants / ride.maxParticipants) * 100)}%` }}
                      />
                    </div>
                    <span className="font-poppins text-xs font-bold text-text-main">
                      {ride.participants}/{ride.maxParticipants}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-right">
                  {getStatusBadge(ride.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
