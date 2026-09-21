import React from 'react';
import { Tag, Calendar, Percent, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ClubDiscountItem } from '../../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';

interface ClubDiscountsTabProps {
  discounts: ClubDiscountItem[];
}

export const ClubDiscountsTab: React.FC<ClubDiscountsTabProps> = ({ discounts }) => {
  if (discounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Tag size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Active Discounts</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          No partner perks, bike shop discounts, or sponsor deals are active for this club.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            Partner Discounts & Perks
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {discounts.length} offers
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Exclusive partner discounts and sponsor promotions negotiated for members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount, index) => {
          const brand = discount.brand || discount.title || 'Club Partner';
          const deal = discount.deal || 'Exclusive Member Perk';
          const isActive = discount.isActive !== false;
          const expiry = discount.expiry || discount.expiryDate || 'Ongoing';

          return (
            <div
              key={discount.id || index}
              className={`rounded-3xl p-6 border transition-all flex flex-col relative overflow-hidden shadow-sm ${
                isActive
                  ? 'border-border bg-surface hover:border-accent/40 hover:shadow-md'
                  : 'border-border/60 bg-surface/40 opacity-70'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-full pointer-events-none" />
              )}

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-main-bg border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  <SafeImage
                    src={discount.logo}
                    alt={brand}
                    className="w-full h-full object-cover"
                    fallback={<Tag size={24} className="text-accent/50" />}
                  />
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold uppercase tracking-wider border ${
                    isActive
                      ? 'bg-success/10 text-success border-success/25'
                      : 'bg-surface text-text-muted border-border'
                  }`}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 size={11} /> Active
                    </>
                  ) : (
                    <>
                      <AlertCircle size={11} /> Expired
                    </>
                  )}
                </span>
              </div>

              <h4 className="font-poppins font-bold text-text-main text-base mb-1 line-clamp-1">
                {brand}
              </h4>
              <p className="font-poppins font-black text-accent text-lg mb-2">
                {deal}
              </p>

              {discount.description && (
                <p className="font-roboto text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed">
                  {discount.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                {discount.code ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold">
                    <span>CODE:</span>
                    <span>{discount.code}</span>
                  </div>
                ) : (
                  <span className="text-xs font-roboto text-text-muted flex items-center gap-1">
                    <Percent size={12} className="text-accent" />
                    Member Perk
                  </span>
                )}

                <span className="text-[11px] font-roboto text-text-muted flex items-center gap-1">
                  <Calendar size={12} className="text-text-muted/60" />
                  {expiry}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
