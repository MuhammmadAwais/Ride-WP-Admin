import React from 'react';
import { ShoppingBag, Package, Layers } from 'lucide-react';
import type { ClubShopItem } from '../../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';

interface ClubShopTabProps {
  shop: ClubShopItem[];
}

export const ClubShopTab: React.FC<ClubShopTabProps> = ({ shop }) => {
  if (shop.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <ShoppingBag size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">Shop is Empty</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This club has not listed any official merchandise, custom jerseys, or kits for sale.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            Club Merch & Shop
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {shop.length} items
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Official kit, team apparel, and club gear available to members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shop.map((item, index) => {
          const name = item.name || item.productName || 'Club Merchandise';
          const price = Number(item.price || 0).toFixed(2);
          const stock = item.stock ?? 0;
          const image = item.image || null;

          return (
            <div
              key={item.id || index}
              className="bg-surface rounded-3xl border border-border p-4 shadow-sm hover:border-accent/40 transition-all group flex flex-col"
            >
              <div className="aspect-square rounded-2xl bg-main-bg overflow-hidden mb-4 relative flex items-center justify-center border border-border/60">
                <SafeImage
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-accent/30">
                      <ShoppingBag size={36} />
                    </div>
                  }
                />
                {/* Stock badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-surface/90 backdrop-blur-md rounded-xl text-[10px] font-poppins font-bold text-text-main shadow-md border border-border">
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                {item.category && (
                  <span className="text-[10px] uppercase font-poppins font-bold tracking-wider text-text-muted mb-1 flex items-center gap-1">
                    <Layers size={10} className="text-accent" />
                    {item.category}
                  </span>
                )}
                <h4 className="font-poppins font-bold text-text-main text-sm mb-1 leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                  {name}
                </h4>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="font-poppins font-black text-accent text-base">
                    €{price}
                  </span>
                  <span className="text-[11px] font-roboto font-semibold text-text-muted">
                    Official Merch
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
