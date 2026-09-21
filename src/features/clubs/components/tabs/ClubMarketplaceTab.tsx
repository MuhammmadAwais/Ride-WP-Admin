import React, { useState } from 'react';
import { Store, Tag, Eye } from 'lucide-react';
import type { ClubMarketplaceItem } from '../../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { ListingDetailModal } from '@/features/users/components/ListingDetailModal';
import type { UserListing } from '@/features/users/types/userTypes';

interface ClubMarketplaceTabProps {
  marketplace: ClubMarketplaceItem[];
}

export const ClubMarketplaceTab: React.FC<ClubMarketplaceTabProps> = ({ marketplace }) => {
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInspect = (item: ClubMarketplaceItem) => {
    // Adapt ClubMarketplaceItem to UserListing for ListingDetailModal
    const userListing: UserListing = {
      id: item.id,
      productName: item.product || item.productName || 'Gear Listing',
      price: String(item.price ?? '0'),
      condition: item.condition || 'Used',
      image: item.image || null,
      isActive: item.isActive !== undefined ? item.isActive : item.status !== 'Sold',
      isSoldOut: Boolean(item.isSoldOut || item.status === 'Sold'),
      quantity: (item as any).quantity ?? item.stock ?? null,
      createdAt: item.createdAt || new Date().toISOString(),
      description: item.description || '',
    };
    setSelectedListing(userListing);
    setIsModalOpen(true);
  };

  if (marketplace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Store size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">Marketplace is Empty</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          No peer-to-peer bike gear, components, or pre-owned cycling kit listed by club members.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            P2P Member Marketplace
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {marketplace.length} listings
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Community classifieds, member bike sales, and equipment trades.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplace.map((item, index) => {
          const product = item.product || item.productName || 'Gear Listing';
          const price = Number(item.price || 0).toFixed(2);
          const sellerName = item.seller || item.sellerName || 'Club Member';
          const sellerAvatar = item.sellerAvatar || null;
          const status = item.status || (item.isActive ? 'Available' : 'Inactive');
          const isAvailable = status.toLowerCase() === 'available' || status.toLowerCase() === 'active';

          return (
            <div
              key={item.id || index}
              className="bg-surface rounded-3xl border border-border p-5 shadow-sm hover:border-accent/40 transition-all flex flex-col group"
            >
              <div className="aspect-[4/3] rounded-2xl bg-main-bg overflow-hidden mb-4 relative flex items-center justify-center border border-border/60">
                <SafeImage
                  src={item.image}
                  alt={product}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-accent/30">
                      <Store size={40} />
                    </div>
                  }
                />
                <span
                  className={`absolute top-2.5 right-2.5 text-[10px] px-2.5 py-1 rounded-xl font-poppins font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
                    isAvailable
                      ? 'bg-success/20 text-success border-success/30'
                      : 'bg-surface/90 text-text-muted border-border'
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-poppins font-bold text-text-main text-base line-clamp-1 group-hover:text-accent transition-colors">
                    {product}
                  </h4>
                  <span className="font-poppins font-black text-accent text-base shrink-0">
                    €{price}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-roboto text-text-muted flex items-center gap-1">
                    <Tag size={12} className="text-accent" />
                    Condition: <strong className="text-text-main font-semibold capitalize">{item.condition || 'Used'}</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar src={sellerAvatar} name={sellerName} size="xs" />
                    <span className="text-xs font-roboto text-text-muted truncate">
                      Listed by <strong className="text-text-main font-semibold">{sellerName}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleInspect(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-accent/40 text-text-main hover:text-accent font-poppins text-xs font-semibold transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Modal */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
