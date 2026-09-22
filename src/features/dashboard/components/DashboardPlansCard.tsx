/**
 * @fileoverview SaaS Monetization Tiers card for the Admin Dashboard.
 * Displays active subscription and club tiers from RTK Query with EUR (€) pricing,
 * verified billing intervals, Stripe Connect status, and direct management shortcuts.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';
import { ROUTES } from '@/Constants';

export default function DashboardPlansCard() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useGetPlansQuery();

  const activePlans = plans ? plans.slice(0, 4) : [];

  const getCleanCadence = (interval?: string, price?: string | number) => {
    if (Number(price) === 0) return 'Lifetime access';
    const norm = (interval || '').toLowerCase();
    if (norm === 'yearly' || norm === 'year') return 'Billed yearly';
    if (norm === 'monthly' || norm === 'month') return 'Billed monthly';
    return `${norm} billing`;
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[440px] shadow-sm relative overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-text-main text-base tracking-tight">
                SaaS Monetization Tiers
              </h3>
              <p className="font-roboto text-text-muted text-xs">
                Active club and athlete subscription plans
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.PAYMENTS)}
            className="text-xs font-poppins font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors cursor-pointer group"
          >
            <span>Manage Plans</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Plans List ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pr-1 my-3.5 space-y-2.5 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-main-bg/50 border border-border/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activePlans.length > 0 ? (
          activePlans.map((plan) => {
            const isFree = Number(plan.price) === 0;
            const formattedPrice = isFree ? 'Free' : `€${Number(plan.price).toFixed(2)}`;
            const featureCount = plan.config ? Object.keys(plan.config).length : 0;
            const cadenceLabel = getCleanCadence(plan.billingInterval, plan.price);
            const scopeLabel = plan.planScope ? `${plan.planScope.toUpperCase()} TIER` : 'TIER';

            return (
              <div
                key={plan.id}
                onClick={() => navigate(ROUTES.PAYMENTS)}
                className="p-3.5 rounded-2xl bg-main-bg/50 hover:bg-main-bg border border-border/80 hover:border-accent/40 transition-all cursor-pointer flex items-center justify-between gap-3 group select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-poppins font-black text-xs shrink-0 group-hover:scale-105 transition-transform ${
                      isFree
                        ? 'bg-surface border-border text-text-muted'
                        : 'bg-accent/10 border-accent/25 text-accent'
                    }`}
                  >
                    {isFree ? '0€' : 'PRO'}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-poppins font-bold text-xs sm:text-sm text-text-main truncate group-hover:text-accent transition-colors">
                      {plan.name}
                    </h4>
                    <p className="font-roboto text-[11px] text-text-muted truncate mt-0.5">
                      {featureCount > 0 ? `${featureCount} features configured` : 'Active features'} • {scopeLabel}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-poppins font-black text-sm sm:text-base text-text-main block leading-tight">
                    {formattedPrice}
                  </span>
                  <span className="text-[10px] font-roboto text-text-muted mt-0.5 block">
                    {cadenceLabel}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Layers size={24} />
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm">No Active Plans</h4>
            <p className="font-roboto text-text-muted text-xs mt-1 max-w-[240px]">
              Set up club and athlete subscription tiers to begin platform monetization.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="border-t border-border pt-3.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-roboto text-text-muted">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Stripe Connect platform active</span>
        </span>
        <span className="font-poppins font-semibold text-[11px] text-text-main bg-main-bg/80 border border-border px-2.5 py-1 rounded-xl">
          EUR (€) Base Currency
        </span>
      </div>
    </div>
  );
}
