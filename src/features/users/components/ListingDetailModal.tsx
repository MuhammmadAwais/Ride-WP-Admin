import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Package, Tag, Calendar, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UserListing } from '../types/userTypes';
import { SafeImage } from '@/Components/common/SafeImage';

interface ListingDetailModalProps {
  listing: UserListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
}) => {
  if (!listing) return null;

  const formattedDate = new Date(listing.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl w-[92vw] z-50 animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar outline-none">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Package size={24} />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-poppins font-black text-xl sm:text-2xl text-text-main truncate">
                  {listing.productName || 'Gear Listing'}
                </Dialog.Title>
                <Dialog.Description className="font-roboto text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                  <span>Listing ID: #{listing.id}</span>
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

          {/* Product Image Showcase */}
          <div className="my-6 rounded-2xl overflow-hidden border border-border bg-main-bg aspect-video relative flex items-center justify-center">
            <SafeImage
              src={listing.image}
              alt={listing.productName}
              fallback={
                <div className="flex flex-col items-center justify-center text-text-muted/40 p-6 text-center">
                  <Package size={48} className="mb-2 text-accent/40" />
                  <p className="font-roboto text-xs">No product image uploaded</p>
                </div>
              }
              className="w-full h-full object-contain"
            />
            {/* Price Tag Overlay */}
            <div className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-accent font-poppins font-black text-lg shadow-xl">
              €{Number(listing.price).toFixed(2)}
            </div>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <Tag size={12} className="text-accent" /> Condition
              </span>
              <span className="font-poppins font-bold text-sm text-text-main mt-1 capitalize">
                {listing.condition || 'Used'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
              <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                <ShieldCheck size={12} className="text-success" /> Availability
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${
                    listing.isActive
                      ? 'bg-success/10 text-success border-success/25'
                      : 'bg-surface text-text-muted border-border'
                  }`}
                >
                  {listing.isActive ? 'Active' : 'Inactive'}
                </span>
                {listing.isSoldOut && (
                  <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-error/10 text-error border-error/25">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5 mb-6">
            <p className="text-xs font-roboto text-text-muted uppercase font-semibold">Description</p>
            <p className="text-sm font-roboto text-text-main leading-relaxed">
              {listing.description || 'No detailed description provided by the seller.'}
            </p>
          </div>

          {/* Listed Date */}
          <div className="flex items-center justify-between text-xs text-text-muted font-roboto pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" /> Listed on {formattedDate}
            </span>
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
