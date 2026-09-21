import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Bike,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Gauge,
  Users,
  Car,
  Download,
  Shield,
  Layers,
} from 'lucide-react';
import type { UserRide } from '../types/userTypes';
import { UserAvatar } from '@/Components/common/UserAvatar';

interface RideDetailModalProps {
  ride: UserRide | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RideDetailModal: React.FC<RideDetailModalProps> = ({
  ride,
  isOpen,
  onClose,
}) => {
  if (!ride) return null;

  const formattedDate = new Date(ride.dateTime).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(ride.dateTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-[92vw] z-50 animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar outline-none">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Bike size={24} />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-poppins font-black text-xl sm:text-2xl text-text-main truncate">
                  {ride.rideName || 'Group Ride Details'}
                </Dialog.Title>
                <Dialog.Description className="font-roboto text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                  <Shield size={12} className="text-accent shrink-0" />
                  <span>Hosted by: <strong className="text-text-main font-semibold">{ride.hostName || 'Community'}</strong></span>
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-hover transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <TrendingUp size={12} className="text-accent" /> Distance
              </span>
              <span className="font-poppins font-black text-base text-text-main mt-1">
                {ride.distance ? `${ride.distance} km` : '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <Gauge size={12} className="text-info" /> Pace
              </span>
              <span className="font-poppins font-black text-sm text-text-main mt-1 truncate" title={ride.pace || 'Moderate'}>
                {ride.pace || 'Moderate'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <Users size={12} className="text-success" /> Riders
              </span>
              <span className="font-poppins font-black text-base text-text-main mt-1">
                {ride.participantsCount ?? 0}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <Layers size={12} className="text-warning" /> Status
              </span>
              <span
                className={`font-poppins font-bold text-xs uppercase tracking-wider mt-1.5 ${
                  ride.status === 'Completed' ? 'text-success' : 'text-accent'
                }`}
              >
                {ride.status || 'Scheduled'}
              </span>
            </div>
          </div>

          {/* Details Sections */}
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-roboto text-text-muted uppercase font-semibold">Date</p>
                  <p className="text-sm font-poppins font-bold text-text-main">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-roboto text-text-muted uppercase font-semibold">Time</p>
                  <p className="text-sm font-poppins font-bold text-text-main">{formattedTime}</p>
                </div>
              </div>
            </div>

            {/* Meeting Point / Route */}
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
              <p className="text-xs font-roboto text-text-muted uppercase font-semibold flex items-center gap-1.5">
                <MapPin size={14} className="text-accent" /> Meeting Point & Route
              </p>
              <p className="text-sm font-roboto font-medium text-text-main pl-5">
                {ride.route && ride.route !== 'null → null'
                  ? ride.route
                  : 'Meeting point details coordinate specified in GPX route.'}
              </p>
            </div>

            {/* GPX Route Download */}
            {ride.gpxFile && (
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-poppins font-bold text-text-main">GPS Route Map (GPX)</p>
                  <p className="text-xs font-roboto text-text-muted">Download route waypoints & elevation profile</p>
                </div>

                <a
                  href={ride.gpxFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white font-poppins font-bold text-xs hover:brightness-105 transition-all shadow-sm cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download GPX</span>
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-surface border border-border text-text-main hover:bg-hover font-poppins text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
