/**
 * @fileoverview SaaS Subscription Plans & Monetization Control Deck.
 * Connects to live RTK Query endpoints:
 * - useGetPlansQuery
 * - useDeletePlanMutation
 * Features:
 * - Unified executive header with live telemetry refresh and primary Create CTA
 * - 4 Dynamic Metric KPI Cards with icons and live status indicators
 * - Multi-dimensional search, scope/interval filters, and dynamic sorting
 * - Redesigned SaaS plan cards with tier identity accents, quotas, capability pills, and Stripe sync telemetry
 * - GSAP-animated modal safeguards for plan archival
 */
import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Search,
  Bike,
  ShoppingBag,
  Users,
  CreditCard,
  Layers,
  X,
  Shield,
  Zap,
  Navigation,
  Copy,
  Check,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import {
  useGetPlansQuery,
  useDeletePlanMutation,
} from '@/features/subscriptions/api/subscriptionApi';
import type {
  SubscriptionPlan,
  PlanScopeFilter,
  PlanIntervalFilter,
} from '@/features/subscriptions/types/subscriptionTypes';
import CreateEditPlanModal from './CreateEditPlanModal';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'id-desc';

function getPlanEntitlements(plan: SubscriptionPlan): string[] {
  const items: string[] = [];
  const cfg = plan.config || {};

  // Rides Quota
  if (cfg.unlimitedRides) {
    items.push('Unlimited Group Rides');
  } else if (cfg.numberOfRides && Number(cfg.numberOfRides) > 0) {
    items.push(`${cfg.numberOfRides} Group Rides / mo`);
  }

  // Marketplace Gear Quota (Do not show 0!)
  if (cfg.unlimitedItemInMarketplace) {
    items.push('Unlimited Marketplace Gear');
  } else if (cfg.marketplaceItems && Number(cfg.marketplaceItems) > 0) {
    items.push(`${cfg.marketplaceItems} Marketplace Gear Listings`);
  }

  // Club Members Capacity (Do not show 0!)
  if (cfg.unlimitedClubMembers) {
    items.push('Unlimited Club Roster Capacity');
  } else if (cfg.clubMembers && Number(cfg.clubMembers) > 0) {
    items.push(`Up to ${cfg.clubMembers} Member Capacity`);
  }

  // Verified Platform Capabilities
  if (cfg.stravaConnection) {
    items.push('Strava Sync & Telemetry');
  }
  if (cfg.gpxDownload) {
    items.push('GPX Route File Export');
  }
  if (cfg.clubStripeIntegration) {
    items.push('Direct Club Stripe Payouts');
  }
  if (cfg.paidActivities) {
    items.push('Ticketed Events & Races');
  }
  if (cfg.premiumChat) {
    items.push('Encrypted Club Chat Channels');
  }

  if (items.length === 0) {
    items.push('Standard platform access');
  }

  return items;
}

const SubscriptionPlansTable: React.FC = () => {
  const { data: plans, isLoading, isError, error, refetch, isFetching } = useGetPlansQuery();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters, Search & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<PlanScopeFilter>('all');
  const [intervalFilter, setIntervalFilter] = useState<PlanIntervalFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');

  // Summary Metrics computed directly from live plans
  const metrics = useMemo(() => {
    if (!plans) return { total: 0, active: 0, clubs: 0, users: 0 };
    const nonDeleted = plans.filter((p) => !p.isDeleted);
    return {
      total: nonDeleted.length,
      active: nonDeleted.filter((p) => p.isActive).length,
      clubs: nonDeleted.filter((p) => (p.planScope || 'club').toLowerCase() === 'club').length,
      users: nonDeleted.filter((p) => (p.planScope || '').toLowerCase() === 'user').length,
    };
  }, [plans]);

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    const result = plans.filter((plan) => {
      // Exclude soft-deleted plans
      if (plan.isDeleted) return false;

      // Scope filter
      if (scopeFilter !== 'all') {
        const planScope = (plan.planScope || 'club').toLowerCase();
        if (planScope !== scopeFilter) return false;
      }

      // Interval filter
      if (intervalFilter !== 'all') {
        const interval = (plan.billingInterval || '').toLowerCase();
        if (interval !== intervalFilter) return false;
      }

      // Search keyword
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = plan.name.toLowerCase().includes(query);
        const matchesDesc = (plan.description || '').toLowerCase().includes(query);
        const matchesPrice = String(plan.price).includes(query);
        const matchesStripe = plan.stripeProductId?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesPrice && !matchesStripe) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return b.id - a.id;
    });

    return result;
  }, [plans, scopeFilter, intervalFilter, searchQuery, sortBy]);

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCopyStripeId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Stripe Product ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      await deletePlan({ planId: planToDelete.id }).unwrap();
      toast.success(`Plan "${planToDelete.name}" has been archived successfully.`);
      setPlanToDelete(null);
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        data?: { message?: string };
      };
      const msg =
        errorObj?.message || errorObj?.data?.message || 'Failed to archive subscription plan.';
      toast.error(msg);
    }
  };

  const errorObj = error as
    | { message?: string; data?: { message?: string } }
    | undefined;

  return (
    <div className="space-y-8">
      {/* ── 1. Single Authoritative Executive Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Sparkles size={20} />
            </div>
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-text-main tracking-tight">
              Subscription Plans & Monetization
            </h1>
          </div>
          <p className="font-roboto text-sm text-text-muted mt-1 max-w-2xl">
            Configure tiered pricing, Stripe checkout synchronization, quotas, and feature entitlements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-2xl border border-border bg-surface text-text-muted hover:text-text-main transition-colors cursor-pointer shadow-sm"
            title="Refresh plans catalog"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin text-accent' : ''} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* ── 2. Dynamic Metric KPI Cards (Architectural Divided Bar) ─────────── */}
      <div className="rounded-3xl border border-border bg-surface/50 backdrop-blur-sm overflow-hidden shadow-xs w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {/* Total Tiers */}
          <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
                Total Tiers
              </span>
              <p className="font-poppins font-black text-2xl sm:text-3xl lg:text-4xl text-text-main block truncate tracking-tight my-0.5">
                {metrics.total}
              </p>
              <span className="text-[11px] font-roboto font-medium text-text-muted block truncate">
                Configured membership tiers
              </span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
              <Layers size={19} />
            </div>
          </div>

          {/* Active on Stripe */}
          <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
                Active Tiers
              </span>
              <p className="font-poppins font-black text-2xl sm:text-3xl lg:text-4xl text-emerald-400 block truncate tracking-tight my-0.5">
                {metrics.active}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-roboto text-emerald-400/90 font-medium truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">Live on Stripe</span>
              </div>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
              <CheckCircle2 size={19} />
            </div>
          </div>

          {/* Club Tiers */}
          <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
                Club Tiers
              </span>
              <p className="font-poppins font-black text-2xl sm:text-3xl lg:text-4xl text-text-main block truncate tracking-tight my-0.5">
                {metrics.clubs}
              </p>
              <span className="text-[11px] font-roboto font-medium text-text-muted block truncate">
                For team organizers
              </span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
              <Shield size={19} />
            </div>
          </div>

          {/* User Tiers */}
          <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
                Athlete Tiers
              </span>
              <p className="font-poppins font-black text-2xl sm:text-3xl lg:text-4xl text-text-main block truncate tracking-tight my-0.5">
                {metrics.users}
              </p>
              <span className="text-[11px] font-roboto font-medium text-text-muted block truncate">
                For individual riders
              </span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
              <Bike size={19} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. High-Performance Search, Filter & Sort Bar ───────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl border border-border bg-surface shadow-sm">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, price, or Stripe ID..."
            className="w-full bg-main-bg border border-border text-text-main text-sm rounded-2xl pl-10 pr-8 py-2.5 outline-none focus:border-accent/60 font-roboto transition-all shadow-inner placeholder:text-text-muted/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Scope filter pills */}
          <div className="flex items-center rounded-2xl bg-main-bg border border-border p-1 text-xs font-poppins shadow-inner">
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setScopeFilter('club')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
                scopeFilter === 'club'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Clubs ({metrics.clubs})
            </button>
            <button
              onClick={() => setScopeFilter('user')}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
                scopeFilter === 'user'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Users ({metrics.users})
            </button>
          </div>

          {/* Interval filter */}
          <div className="flex items-center rounded-2xl bg-main-bg border border-border p-1 text-xs font-poppins shadow-inner">
            {(['all', 'monthly', 'yearly', 'free'] as const).map((int) => (
              <button
                key={int}
                onClick={() => setIntervalFilter(int)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all font-semibold cursor-pointer ${
                  intervalFilter === int
                    ? 'bg-surface text-accent font-bold shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {int === 'all' ? 'All Billing' : int}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-main-bg border border-border rounded-2xl px-3 py-2 text-xs font-roboto text-text-main shadow-inner">
            <ArrowUpDown size={13} className="text-accent shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent border-none outline-none text-text-main cursor-pointer pr-1 font-medium"
            >
              <option value="price-asc" className="bg-surface text-text-main">Price: Low to High</option>
              <option value="price-desc" className="bg-surface text-text-main">Price: High to Low</option>
              <option value="name-asc" className="bg-surface text-text-main">Name: A to Z</option>
              <option value="id-desc" className="bg-surface text-text-main">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Loading State ──────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted bg-surface border border-border rounded-3xl">
          <Loader2 size={36} className="animate-spin text-accent" />
          <p className="font-poppins font-medium text-sm">Loading subscription catalog from Stripe...</p>
        </div>
      )}

      {/* ── Error State ────────────────────────────────────────────────────── */}
      {isError && !isLoading && (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <h4 className="font-poppins font-bold">Failed to load subscription plans</h4>
              <p className="font-roboto text-sm text-red-400/80 mt-0.5">
                {errorObj?.message || errorObj?.data?.message || 'Could not connect to the subscription service.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 font-semibold text-sm transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-border border-dashed bg-surface text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <Sparkles size={28} />
          </div>
          <h3 className="font-poppins font-bold text-lg text-text-main">No Plans Found</h3>
          <p className="font-roboto text-sm text-text-muted max-w-sm mt-1 mb-6">
            {searchQuery || scopeFilter !== 'all' || intervalFilter !== 'all'
              ? 'No subscription plans match your current search and filter criteria.'
              : "You haven't configured any subscription plans yet. Create your first plan to start monetizing."}
          </p>
          {searchQuery || scopeFilter !== 'all' || intervalFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setScopeFilter('all');
                setIntervalFilter('all');
              }}
              className="px-5 py-2.5 rounded-2xl border border-border bg-main-bg text-text-main hover:bg-surface font-poppins font-semibold text-sm transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={handleCreateNew}
              className="px-6 py-2.5 rounded-2xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] cursor-pointer"
            >
              Create Your First Plan
            </button>
          )}
        </div>
      )}

      {/* ── 4. Redesigned SaaS Plan Cards Grid ──────────────────────────────── */}
      {!isLoading && !isError && filteredPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const isFree =
              (plan.billingInterval || '').toLowerCase() === 'free' || Number(plan.price) === 0;
            const isClub = (plan.planScope || 'club').toLowerCase() === 'club';
            const currencySymbol =
              (plan.currency || 'eur').toLowerCase() === 'usd'
                ? '$'
                : (plan.currency || 'eur').toLowerCase() === 'gbp'
                ? '£'
                : '€';

            const entitlements = getPlanEntitlements(plan);

            return (
              <div
                key={plan.id}
                className="rounded-3xl border border-border hover:border-accent/40 bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-all duration-300 group relative hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Badges & Actions Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Scope Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-poppins font-black uppercase tracking-wider border ${
                          isClub
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-accent/10 text-accent border-accent/20'
                        }`}
                      >
                        {isClub ? <Shield size={11} /> : <Bike size={11} />}
                        <span>{isClub ? 'Club Tier' : 'Athlete Tier'}</span>
                      </span>

                      {/* Billing Interval Badge */}
                      <span className="text-[10px] font-poppins font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-main-bg border border-border text-text-muted">
                        {isFree ? 'Free Access' : plan.billingInterval}
                      </span>
                    </div>

                    {/* Actions: Edit & Archive */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-main-bg border border-transparent hover:border-border transition-all cursor-pointer"
                        title="Edit plan configuration"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setPlanToDelete(plan)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                        title="Archive plan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Plan Name & Description */}
                  <div className="mt-3.5">
                    <h3 className="font-poppins font-bold text-xl text-text-main tracking-tight group-hover:text-accent transition-colors leading-tight">
                      {plan.name}
                    </h3>
                    <p className="font-roboto text-xs sm:text-sm text-text-muted mt-1 line-clamp-2 min-h-[36px] leading-relaxed">
                      {plan.description || 'Configured platform subscription tier with automated entitlements.'}
                    </p>
                  </div>

                  {/* Price Tag Hero */}
                  <div className="my-5 flex items-baseline gap-1.5">
                    <span className="font-poppins font-black text-3xl sm:text-4xl text-text-main tracking-tight">
                      {isFree ? 'Free' : `${currencySymbol}${Number(plan.price).toFixed(2)}`}
                    </span>
                    {!isFree && (
                      <span className="font-roboto text-xs text-text-muted font-medium uppercase tracking-wider">
                        /{plan.billingInterval}
                      </span>
                    )}
                    {plan.trialPeriodDays ? (
                      <span className="ml-auto text-[11px] font-bold font-poppins px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {plan.trialPeriodDays}-Day Free Trial
                      </span>
                    ) : null}
                  </div>

                  {/* Included Entitlements & Features (Clean checklist, zero 0s, zero generic filler) */}
                  <div className="space-y-2.5 border-t border-border/70 pt-4 mb-5">
                    <p className="font-poppins text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Included Entitlements
                    </p>
                    <div className="space-y-2">
                      {entitlements.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-text-main/90 font-roboto group-hover:text-text-main transition-colors"
                        >
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs font-roboto">
                  {plan.stripeProductId ? (
                    <div className="flex items-center gap-1.5 text-text-muted" title={`Stripe ID: ${plan.stripeProductId}`}>
                      <CreditCard size={13} className="text-accent shrink-0" />
                      <span className="font-mono text-[11px] truncate max-w-[130px]">{plan.stripeProductId}</span>
                      <button
                        onClick={() => handleCopyStripeId(plan.stripeProductId!)}
                        className="p-1 rounded hover:bg-main-bg text-text-muted hover:text-text-main transition-colors cursor-pointer"
                        title="Copy Stripe Product ID"
                      >
                        {copiedId === plan.stripeProductId ? (
                          <Check size={11} className="text-emerald-400" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-text-muted text-[11px]">
                      #ID-{plan.id} • Direct Tier
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-poppins font-semibold ${
                      plan.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        plan.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'
                      }`}
                    />
                    {plan.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. Create / Edit Plan Modal Dialog ──────────────────────────────── */}
      <CreateEditPlanModal
        isOpen={isModalOpen}
        planToEdit={selectedPlan}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
      />

      {/* ── 6. Confirmation Modal for Plan Archival ─────────────────────────── */}
      {planToDelete && (
        <PlanDeleteConfirmModal
          plan={planToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPlanToDelete(null)}
        />
      )}
    </div>
  );
};

// ─── Plan Archival Confirmation Modal ─────────────────────────────────────────

interface PlanDeleteConfirmModalProps {
  plan: SubscriptionPlan;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PlanDeleteConfirmModal: React.FC<PlanDeleteConfirmModalProps> = ({
  plan,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.92, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-2xl relative"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
          <Trash2 size={24} />
        </div>

        <h3 className="font-poppins font-bold text-xl text-text-main">
          Archive Subscription Plan?
        </h3>
        <p className="font-roboto text-sm text-text-muted mt-2 leading-relaxed">
          Are you sure you want to archive{' '}
          <span className="font-bold text-text-main font-poppins">"{plan.name}"</span>? Existing
          subscribers will remain active until their renewal cycle ends, but no new users will be able
          to select this tier.
        </p>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-border bg-main-bg text-text-main hover:bg-surface font-poppins font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-poppins font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Archiving...</span>
              </>
            ) : (
              <span>Archive Plan</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SubscriptionPlansTable;
