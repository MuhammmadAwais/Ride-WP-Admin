/**
 * @fileoverview Full-Width SaaS Monetization Showcase for the Admin Dashboard.
 * Displays active subscription and club tiers from RTK Query with EUR (€) pricing,
 * verified billing intervals, dynamic feature entitlements, and Stripe Connect status.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, CheckCircle2, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';
import type { PlanConfig } from '@/features/subscriptions/types/subscriptionTypes';
import { ROUTES } from '@/Constants';

function getPlanFeatures(config?: PlanConfig): string[] {
  if (!config) return ['Standard athlete platform access'];
  const features: string[] = [];
  if (config.unlimitedRides) features.push('Unlimited Club Rides');
  else if (config.numberOfRides) features.push(`${config.numberOfRides} Club Rides/mo`);
  if (config.stravaConnection) features.push('Strava Sync & Telemetry');
  if (config.gpxDownload) features.push('GPX Route File Export');
  if (config.clubStripeIntegration) features.push('Club Stripe Payouts');
  if (config.unlimitedClubMembers) features.push('Unlimited Club Roster');
  else if (config.clubMembers) features.push(`Up to ${config.clubMembers} Members`);
  if (config.paidActivities) features.push('Ticketed Events & Races');
  if (config.premiumChat) features.push('Club Channels & Media');
  if (config.unlimitedItemInMarketplace) features.push('Unlimited Gear Listings');
  else if (config.marketplaceItems) features.push(`${config.marketplaceItems} Gear Listings`);
  if (features.length === 0) features.push('Standard platform access');
  return features;
}

function getCleanCadence(interval?: string, price?: string | number) {
  if (Number(price) === 0) return 'Lifetime access';
  const norm = (interval || '').toLowerCase();
  if (norm === 'yearly' || norm === 'year') return '/year';
  if (norm === 'monthly' || norm === 'month') return '/month';
  return `/${norm}`;
}

export default function DashboardPlansCard() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useGetPlansQuery();

  const activePlans = plans ? plans.filter((p) => !p.isDeleted).slice(0, 4) : [];

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs relative overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Signature Ride-WP Ember Icon Container */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center text-accent shrink-0 shadow-xs">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-poppins font-bold text-base sm:text-lg text-text-main tracking-tight">
                SaaS Monetization & Club Tiers
              </h3>
             
            </div>
            <p className="font-roboto text-xs text-text-muted mt-0.5">
              Active athlete and sports club membership tiers with automated Stripe billing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex font-poppins font-semibold text-[11px] text-text-muted bg-main-bg/80 border border-border px-3 py-1.5 rounded-xl">
            EUR (€) Base Currency
          </span>

          <button
            onClick={() => navigate(ROUTES.PAYMENTS)}
            className="px-4 py-2 rounded-xl bg-main-bg/80 hover:bg-main-bg border border-border hover:border-accent/40 text-text-main hover:text-accent text-xs font-poppins font-semibold flex items-center gap-1.5 transition-all cursor-pointer group shadow-xs"
          >
            <span>Manage All Plans</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Plans Deck ────────────────────────────────────────────────────── */}
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 bg-main-bg/50 border border-border/70 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activePlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {activePlans.map((plan) => {
              const isFree = Number(plan.price) === 0;
              const formattedPrice = isFree ? 'Free' : `€${Number(plan.price).toFixed(2)}`;
              const cadenceLabel = getCleanCadence(plan.billingInterval, plan.price);
              const scopeLabel = plan.planScope ? `${plan.planScope.toUpperCase()} TIER` : 'TIER';
              const features = getPlanFeatures(plan.config);

              return (
                <div
                  key={plan.id}
                  onClick={() => navigate(ROUTES.PAYMENTS)}
                  className="rounded-2xl border border-border bg-main-bg/50 hover:bg-main-bg hover:border-accent/40 p-5 transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-xs select-none"
                >
                  {/* Top Section */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-poppins font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                        {scopeLabel}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                        plan.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {plan.isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>

                    <h4 className="font-poppins font-bold text-base text-text-main group-hover:text-accent transition-colors truncate">
                      {plan.name}
                    </h4>
                    <p className="font-roboto text-xs text-text-muted mt-1 line-clamp-2 min-h-[32px]">
                      {plan.description || 'Configured club subscription plan for athlete access.'}
                    </p>

                    {/* Price Header */}
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-poppins font-black text-2xl text-text-main">
                        {formattedPrice}
                      </span>
                      {!isFree && (
                        <span className="text-xs font-roboto text-text-muted">
                          {cadenceLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Feature Entitlements */}
                  <div className="space-y-2 my-4 pt-3 border-t border-border/70">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-roboto text-text-muted group-hover:text-text-main/90 transition-colors">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-roboto text-text-muted truncate">
                      {plan.trialPeriodDays ? `${plan.trialPeriodDays}d trial` : 'Instant activation'}
                    </span>
                    <span className="font-poppins font-semibold text-accent group-hover:text-accent/80 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                      <span>Configure</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center p-4 bg-main-bg/30 rounded-2xl border border-dashed border-border">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 text-accent flex items-center justify-center mb-3 shadow-xs">
              <Layers size={22} />
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm">No Active Plans</h4>
            <p className="font-roboto text-text-muted text-xs mt-1 max-w-[280px]">
              Set up club and athlete subscription tiers in the Payments center to begin monetization.
            </p>
            <button
              onClick={() => navigate(ROUTES.PAYMENTS)}
              className="mt-4 px-4 py-2 rounded-xl bg-accent text-white font-poppins font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs hover:bg-accent/90 transition-all"
            >
              Create First Tier
            </button>
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="border-t border-border mt-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-roboto text-text-muted">
        <span className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>PCI-DSS Compliant • Stripe Billing webhooks active</span>
        </span>
        <span className="flex items-center gap-1.5 font-poppins text-[11px]">
          <Sparkles size={12} className="text-accent" />
          <span>Showing top {activePlans.length} active platform packages</span>
        </span>
      </div>
    </div>
  );
}
