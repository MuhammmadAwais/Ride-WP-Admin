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

      {/* ── 2. Dynamic Metric KPI Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tiers */}
        <div className="p-5 rounded-3xl border border-border bg-surface shadow-sm relative overflow-hidden group hover:border-accent/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-roboto text-xs font-semibold text-text-muted uppercase tracking-wider">
              Total Tiers
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Layers size={18} />
            </div>
          </div>
          <p className="font-poppins font-black text-3xl text-text-main">{metrics.total}</p>
          <p className="font-roboto text-xs text-text-muted mt-1">Configured membership tiers</p>
        </div>

        {/* Active on Stripe */}
        <div className="p-5 rounded-3xl border border-border bg-surface shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-roboto text-xs font-semibold text-text-muted uppercase tracking-wider">
              Active Tiers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="font-poppins font-black text-3xl text-emerald-400">{metrics.active}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-roboto text-xs text-emerald-500 font-medium">Live on Stripe</span>
          </div>
        </div>

        {/* Club Tiers */}
        <div className="p-5 rounded-3xl border border-border bg-surface shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-roboto text-xs font-semibold text-text-muted uppercase tracking-wider">
              Club Tiers
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield size={18} />
            </div>
          </div>
          <p className="font-poppins font-black text-3xl text-indigo-400">{metrics.clubs}</p>
          <p className="font-roboto text-xs text-text-muted mt-1">For team organizers</p>
        </div>

        {/* User Tiers */}
        <div className="p-5 rounded-3xl border border-border bg-surface shadow-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-roboto text-xs font-semibold text-text-muted uppercase tracking-wider">
              Athlete Tiers
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bike size={18} />
            </div>
          </div>
          <p className="font-poppins font-black text-3xl text-cyan-400">{metrics.users}</p>
          <p className="font-roboto text-xs text-text-muted mt-1">For individual riders</p>
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
            const isGold = plan.name.toLowerCase().includes('gold');
            const currencySymbol =
              (plan.currency || 'eur').toLowerCase() === 'usd'
                ? '$'
                : (plan.currency || 'eur').toLowerCase() === 'gbp'
                ? '£'
                : '€';

            // Distinct border and accent styling by tier
            const borderAccentClass = isGold
              ? 'border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.06)]'
              : !isFree
              ? 'border-accent/30 hover:border-accent/60 shadow-[0_0_20px_rgba(235,113,43,0.06)]'
              : 'border-border hover:border-text-muted/40';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl border bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all group relative hover:shadow-xl hover:-translate-y-1 duration-300 ${borderAccentClass}`}
              >
                <div>
                  {/* Top Badges & Actions Row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Billing Interval Badge */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[11px] font-bold text-accent uppercase tracking-wider font-poppins">
                        <Calendar size={11} />
                        <span>{plan.billingInterval}</span>
                      </span>

                      {/* Scope Badge (Club vs Athlete) */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-poppins border ${
                          isClub
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}
                      >
                        {isClub ? <Shield size={11} /> : <Bike size={11} />}
                        <span>{isClub ? 'Club' : 'Athlete'}</span>
                      </span>
                    </div>

                    {/* Actions: Edit & Archive */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-main-bg transition-colors cursor-pointer"
                        title="Edit plan configuration"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setPlanToDelete(plan)}
                        className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Archive plan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Plan Name & Description */}
                  <h3 className="font-poppins font-bold text-xl text-text-main tracking-tight group-hover:text-accent transition-colors leading-tight">
                    {plan.name}
                  </h3>
                  <p className="font-roboto text-xs sm:text-sm text-text-muted mt-1.5 line-clamp-2 min-h-[38px] leading-relaxed">
                    {plan.description || 'No description provided.'}
                  </p>

                  {/* Price Tag Hero */}
                  <div className="my-5 flex items-baseline gap-1.5">
                    <span className="font-poppins font-black text-3xl sm:text-4xl text-text-main tracking-tight">
                      {isFree ? 'Free' : `${currencySymbol}${Number(plan.price).toFixed(2)}`}
                    </span>
                    {!isFree && (
                      <span className="font-roboto text-xs text-text-muted font-semibold uppercase tracking-wider">
                        /{plan.billingInterval}
                      </span>
                    )}
                    {plan.trialPeriodDays ? (
                      <span className="ml-auto text-[11px] font-bold font-poppins px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {plan.trialPeriodDays}-Day Trial
                      </span>
                    ) : null}
                  </div>

                  {/* Stripe Gateway Telemetry Strip */}
                  <div className="mb-5 p-3 rounded-2xl bg-main-bg border border-border/80 flex items-center justify-between text-xs font-roboto shadow-inner">
                    <span className="text-text-muted flex items-center gap-2 font-medium">
                      <CreditCard size={14} className="text-accent shrink-0" />
                      <span>Stripe Gateway</span>
                    </span>

                    {plan.stripeProductId ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-poppins uppercase tracking-wider">
                          <CheckCircle2 size={12} />
                          Synced
                        </span>
                        <button
                          onClick={() => handleCopyStripeId(plan.stripeProductId!)}
                          className="p-1 rounded-lg hover:bg-surface text-text-muted hover:text-text-main transition-colors cursor-pointer"
                          title={`Copy Product ID (${plan.stripeProductId})`}
                        >
                          {copiedId === plan.stripeProductId ? (
                            <Check size={12} className="text-emerald-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-text-muted px-2 py-0.5 rounded-md bg-surface border border-border">
                        Direct / Free
                      </span>
                    )}
                  </div>

                  {/* Included Quotas & Capacity */}
                  <div className="space-y-2.5 border-t border-border/70 pt-4 mb-4">
                    <p className="font-poppins text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      Included Quotas
                    </p>

                    {/* Rides Quota */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-text-main font-roboto">
                      <Bike size={15} className="text-accent shrink-0" />
                      <span>
                        {plan.config?.unlimitedRides
                          ? 'Unlimited Rides'
                          : `${plan.config?.numberOfRides ?? 0} Rides Allowed`}
                      </span>
                    </div>

                    {/* Marketplace Quota */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-text-main font-roboto">
                      <ShoppingBag size={15} className="text-accent shrink-0" />
                      <span>
                        {plan.config?.unlimitedItemInMarketplace
                          ? 'Unlimited Marketplace Items'
                          : `${plan.config?.marketplaceItems ?? 0} Marketplace Listings`}
                      </span>
                    </div>

                    {/* Club Members Quota (if club scope) */}
                    {isClub && (
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm text-text-main font-roboto">
                        <Users size={15} className="text-accent shrink-0" />
                        <span>
                          {plan.config?.unlimitedClubMembers
                            ? 'Unlimited Club Members'
                            : `${plan.config?.clubMembers ?? 0} Member Capacity`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Capability Badges Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/70 mb-5">
                    {plan.config?.stravaConnection && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-poppins px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <Zap size={10} />
                        <span>Strava Sync</span>
                      </span>
                    )}
                    {plan.config?.gpxDownload && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-poppins px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Navigation size={10} />
                        <span>GPX Export</span>
                      </span>
                    )}
                    {plan.config?.clubStripeIntegration && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-poppins px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <CreditCard size={10} />
                        <span>Club Payments</span>
                      </span>
                    )}
                    {plan.config?.paidActivities && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-poppins px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Sparkles size={10} />
                        <span>Paid Events</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs font-roboto">
                  <span className="font-mono text-text-muted text-[11px] font-semibold">
                    #{plan.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-poppins font-semibold ${
                      plan.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        plan.isActive ? 'bg-emerald-400' : 'bg-neutral-400'
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
