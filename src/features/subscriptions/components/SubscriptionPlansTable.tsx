/**
 * @fileoverview Subscription Plans list view with RTK Query integration.
 * Connects to useGetPlansQuery and useDeletePlanMutation.
 * Features search & scope filters, enriched plan cards with quotas and Stripe sync status,
 * and a portal-rendered GSAP confirmation modal for safe plan archival.
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

const SubscriptionPlansTable: React.FC = () => {
  const { data: plans, isLoading, isError, error, refetch, isFetching } = useGetPlansQuery();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<PlanScopeFilter>('all');
  const [intervalFilter, setIntervalFilter] = useState<PlanIntervalFilter>('all');

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
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

  // Filtered plans
  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    return plans.filter((plan) => {
      // Exclude soft-deleted plans if already flagged
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

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = plan.name.toLowerCase().includes(query);
        const matchesDesc = (plan.description || '').toLowerCase().includes(query);
        const matchesPrice = String(plan.price).includes(query);
        if (!matchesName && !matchesDesc && !matchesPrice) return false;
      }

      return true;
    });
  }, [plans, scopeFilter, intervalFilter, searchQuery]);

  // Summary Metrics
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

  const errorObj = error as
    | { message?: string; data?: { message?: string } }
    | undefined;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-text-main">
            Subscription Plans & Monetization
          </h2>
          <p className="font-roboto text-sm text-text-muted mt-0.5">
            Configure tiered pricing, Stripe checkout synchronization, quotas, and feature entitlements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border bg-surface text-text-muted hover:text-text-main transition-colors cursor-pointer"
            title="Refresh plans list"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin text-accent' : ''} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm">
          <p className="font-roboto text-xs text-text-muted font-medium">Total Tiers</p>
          <p className="font-poppins font-bold text-2xl text-text-main mt-1">{metrics.total}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm">
          <p className="font-roboto text-xs text-text-muted font-medium">Active Tiers</p>
          <p className="font-poppins font-bold text-2xl text-emerald-400 mt-1">{metrics.active}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm">
          <p className="font-roboto text-xs text-text-muted font-medium">Club Tiers</p>
          <p className="font-poppins font-bold text-2xl text-indigo-400 mt-1">{metrics.clubs}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm">
          <p className="font-roboto text-xs text-text-muted font-medium">User Tiers</p>
          <p className="font-poppins font-bold text-2xl text-cyan-400 mt-1">{metrics.users}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 p-4 rounded-2xl border border-border bg-surface">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, description, or price..."
            className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl pl-9 pr-8 py-2.5 outline-none focus:border-accent/60 font-roboto"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scope filter */}
          <div className="flex items-center rounded-xl bg-main-bg border border-border p-1 text-xs font-poppins">
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                scopeFilter === 'all' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              All Scopes
            </button>
            <button
              onClick={() => setScopeFilter('club')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                scopeFilter === 'club' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Clubs
            </button>
            <button
              onClick={() => setScopeFilter('user')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                scopeFilter === 'user' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Users
            </button>
          </div>

          {/* Interval filter */}
          <div className="flex items-center rounded-xl bg-main-bg border border-border p-1 text-xs font-poppins">
            <button
              onClick={() => setIntervalFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                intervalFilter === 'all' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              All Billing
            </button>
            <button
              onClick={() => setIntervalFilter('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                intervalFilter === 'monthly' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIntervalFilter('yearly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                intervalFilter === 'yearly' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setIntervalFilter('free')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                intervalFilter === 'free' ? 'bg-surface text-accent font-semibold shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Free
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
          <Loader2 size={36} className="animate-spin text-accent" />
          <p className="font-roboto text-sm">Loading subscription catalog...</p>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* Empty State */}
      {!isLoading && !isError && filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-border bg-surface text-center p-6">
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
              className="px-5 py-2.5 rounded-xl border border-border bg-main-bg text-text-main hover:bg-surface font-poppins font-semibold text-sm transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={handleCreateNew}
              className="px-6 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] cursor-pointer"
            >
              Create Your First Plan
            </button>
          )}
        </div>
      )}

      {/* Plans Cards Grid */}
      {!isLoading && !isError && filteredPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const isFree = (plan.billingInterval || '').toLowerCase() === 'free' || Number(plan.price) === 0;
            const isClub = (plan.planScope || 'club').toLowerCase() === 'club';
            const currencySymbol = (plan.currency || 'eur').toLowerCase() === 'usd' ? '$' : (plan.currency || 'eur').toLowerCase() === 'gbp' ? '£' : '€';

            return (
              <div
                key={plan.id}
                className="rounded-3xl border border-border bg-surface p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-accent/40 transition-all group relative hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
              >
                <div>
                  {/* Top Badges & Actions */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent uppercase tracking-wider font-poppins">
                        {plan.billingInterval}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-poppins border ${
                          isClub
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}
                      >
                        {isClub ? 'Club' : 'User'}
                      </span>
                    </div>

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

                  {/* Title & Description */}
                  <h3 className="font-poppins font-bold text-xl text-text-main tracking-tight group-hover:text-accent transition-colors">
                    {plan.name}
                  </h3>
                  <p className="font-roboto text-sm text-text-muted mt-1.5 line-clamp-2 min-h-[40px]">
                    {plan.description || 'No description provided.'}
                  </p>

                  {/* Price Tag */}
                  <div className="my-5 flex items-baseline gap-1.5">
                    <span className="font-poppins font-bold text-3xl sm:text-4xl text-text-main">
                      {isFree ? 'Free' : `${currencySymbol}${Number(plan.price).toFixed(2)}`}
                    </span>
                    {!isFree && (
                      <span className="font-roboto text-sm text-text-muted font-medium">
                        /{plan.billingInterval}
                      </span>
                    )}
                    {plan.trialPeriodDays ? (
                      <span className="ml-auto text-[11px] font-semibold font-poppins px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {plan.trialPeriodDays}-Day Trial
                      </span>
                    ) : null}
                  </div>

                  {/* Stripe Sync Status Pill */}
                  <div className="mb-5 p-2.5 rounded-xl bg-main-bg/60 border border-border/80 flex items-center justify-between text-xs font-roboto">
                    <span className="text-text-muted flex items-center gap-1.5 font-medium">
                      <CreditCard size={14} className="text-accent" />
                      Stripe Gateway
                    </span>
                    {plan.stripeProductId ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Synced
                      </span>
                    ) : (
                      <span className="text-text-muted">Direct / Free</span>
                    )}
                  </div>

                  {/* Quota Entitlements */}
                  <div className="space-y-2.5 border-t border-border/60 pt-4 mb-5">
                    <p className="font-poppins text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Included Quotas
                    </p>

                    <div className="flex items-center gap-2.5 text-sm text-text-main font-roboto">
                      <Bike size={16} className="text-accent shrink-0" />
                      <span>
                        {plan.config?.unlimitedRides
                          ? 'Unlimited Rides'
                          : `${plan.config?.numberOfRides ?? 0} Rides Allowed`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-text-main font-roboto">
                      <ShoppingBag size={16} className="text-accent shrink-0" />
                      <span>
                        {plan.config?.unlimitedItemInMarketplace
                          ? 'Unlimited Marketplace Items'
                          : `${plan.config?.marketplaceItems ?? 0} Marketplace Listings`}
                      </span>
                    </div>

                    {isClub && (
                      <div className="flex items-center gap-2.5 text-sm text-text-main font-roboto">
                        <Users size={16} className="text-accent shrink-0" />
                        <span>
                          {plan.config?.unlimitedClubMembers
                            ? 'Unlimited Club Members'
                            : `${plan.config?.clubMembers ?? 50} Member Capacity`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Capability Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                    {plan.config?.stravaConnection && (
                      <span className="px-2 py-0.5 rounded-md bg-main-bg border border-border text-[11px] font-roboto text-text-muted">
                        Strava Sync
                      </span>
                    )}
                    {plan.config?.gpxDownload && (
                      <span className="px-2 py-0.5 rounded-md bg-main-bg border border-border text-[11px] font-roboto text-text-muted">
                        GPX Export
                      </span>
                    )}
                    {plan.config?.clubStripeIntegration && (
                      <span className="px-2 py-0.5 rounded-md bg-main-bg border border-border text-[11px] font-roboto text-text-muted">
                        Club Payments
                      </span>
                    )}
                    {plan.config?.paidActivities && (
                      <span className="px-2 py-0.5 rounded-md bg-main-bg border border-border text-[11px] font-roboto text-text-muted">
                        Paid Events
                      </span>
                    )}
                    {plan.config?.premiumChat && (
                      <span className="px-2 py-0.5 rounded-md bg-main-bg border border-border text-[11px] font-roboto text-text-muted">
                        VIP Chat
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Status */}
                <div className="flex items-center justify-between border-t border-border pt-4 mt-5 text-xs font-roboto text-text-muted">
                  <span className="flex items-center gap-1 font-mono">
                    <Layers size={13} className="text-text-muted" />
                    #{plan.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${
                      plan.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${plan.isActive ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating / Editing Plans */}
      <CreateEditPlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        planToEdit={selectedPlan}
      />

      {/* Branded GSAP Confirmation Modal for Archiving Plans */}
      {planToDelete && (
        <PlanDeleteConfirmModal
          plan={planToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={() => setPlanToDelete(null)}
        />
      )}
    </div>
  );
};

// ─── Branded GSAP Plan Delete Confirmation Modal ──────────────────────────────

interface PlanDeleteConfirmModalProps {
  plan: SubscriptionPlan;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function PlanDeleteConfirmModal({
  plan,
  isDeleting,
  onConfirm,
  onClose,
}: PlanDeleteConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      cardRef.current,
      { scale: 0.88, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
    );
  });

  const handleCancel = () => {
    if (isDeleting) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, {
      scale: 0.92,
      opacity: 0,
      y: 12,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={handleCancel}
      />
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[440px] rounded-[28px] bg-surface border border-border shadow-[0_24px_60px_rgba(0,0,0,0.3)] p-8 text-center"
      >
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center border bg-red-500/10 text-red-500 border-red-500/20">
          <Trash2 size={28} />
        </div>

        <h3 className="font-poppins font-bold text-xl text-text-main mb-2">
          Archive &quot;{plan.name}&quot;?
        </h3>
        <p className="font-roboto text-sm text-text-muted leading-relaxed mb-6">
          This will soft-delete and archive <strong className="text-text-main">Plan #{plan.id}</strong>.
          New subscribers will no longer be able to purchase this tier, while existing active memberships and Stripe billing schedules will be preserved.
        </p>

        <div className="p-3.5 rounded-2xl bg-main-bg/80 border border-border mb-6 text-left space-y-1 text-xs font-roboto text-text-muted">
          <div className="flex justify-between">
            <span>Tier Scope:</span>
            <span className="font-semibold text-text-main uppercase">{plan.planScope || 'Club'}</span>
          </div>
          <div className="flex justify-between">
            <span>Billing Cycle:</span>
            <span className="font-semibold text-text-main uppercase">{plan.billingInterval}</span>
          </div>
          <div className="flex justify-between">
            <span>Pricing:</span>
            <span className="font-semibold text-text-main">
              {Number(plan.price) === 0 ? 'Free' : `€${Number(plan.price).toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Yes, Archive Plan
          </button>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl font-poppins font-semibold text-sm text-text-main bg-transparent border border-border hover:bg-surface/50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

export default SubscriptionPlansTable;
