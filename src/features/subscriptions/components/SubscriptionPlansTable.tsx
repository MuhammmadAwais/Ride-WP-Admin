/**
 * @fileoverview Subscription Plans list view with RTK Query integration.
 * Connects to useGetPlansQuery and useDeletePlanMutation.
 */
import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetPlansQuery,
  useDeletePlanMutation,
} from '@/features/subscriptions/api/subscriptionApi';
import type { SubscriptionPlan } from '@/features/subscriptions/types/subscriptionTypes';
import CreateEditPlanModal from './CreateEditPlanModal';

const SubscriptionPlansTable: React.FC = () => {
  const { data: plans, isLoading, isError, error, refetch, isFetching } = useGetPlansQuery();
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    if (!window.confirm(`Are you sure you want to delete "${plan.name}" (ID: ${plan.id})?`)) {
      return;
    }
    try {
      setDeletingId(plan.id);
      await deletePlan({ planId: plan.id }).unwrap();
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        data?: { message?: string };
      };
      const msg =
        errorObj?.message || errorObj?.data?.message || 'Failed to delete plan.';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const errorObj = error as
    | { message?: string; data?: { message?: string } }
    | undefined;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-text-main">
            Subscription Plans
          </h2>
          <p className="font-roboto text-sm text-text-muted mt-1">
            Manage subscription tiers, pricing, and feature limits ({plans?.length || 0} plans)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border bg-surface text-text-muted hover:text-text-main transition-colors"
            title="Refresh plans list"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted">
          <Loader2 size={32} className="animate-spin text-accent" />
          <p className="font-roboto text-sm">Loading subscription plans...</p>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <h4 className="font-poppins font-bold">Failed to load subscription plans</h4>
              <p className="font-roboto text-sm text-red-400/80 mt-0.5">
                {errorObj?.message ||
                  errorObj?.data?.message ||
                  'Could not reach the backend server.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 font-semibold text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!plans || plans.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border bg-surface text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Sparkles size={28} />
          </div>
          <h3 className="font-poppins font-bold text-lg text-text-main">No Plans Found</h3>
          <p className="font-roboto text-sm text-text-muted max-w-sm mt-1 mb-6">
            You haven&apos;t created any subscription plans yet. Get started by creating your first plan.
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm"
          >
            Create Your First Plan
          </button>
        </div>
      )}

      {/* Plans Cards Grid */}
      {!isLoading && !isError && plans && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isFree = plan.billingInterval === 'free' || Number(plan.price) === 0;
            return (
              <div
                key={plan.id}
                className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between shadow-sm hover:border-accent/30 transition-all group relative"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        {plan.billingInterval}
                      </span>
                      <h3 className="font-poppins font-bold text-xl text-text-main">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-white/5 transition-colors"
                        title="Edit plan"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        disabled={isDeleting && deletingId === plan.id}
                        className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Delete plan"
                      >
                        {isDeleting && deletingId === plan.id ? (
                          <Loader2 size={16} className="animate-spin text-red-400" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="font-roboto text-sm text-text-muted mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="font-poppins font-bold text-3xl text-text-main">
                      {isFree ? 'Free' : `€${Number(plan.price).toFixed(2)}`}
                    </span>
                    {!isFree && (
                      <span className="font-roboto text-sm text-text-muted ml-1">
                        /{plan.billingInterval}
                      </span>
                    )}
                  </div>

                  {/* Feature badges */}
                  <div className="space-y-2 border-t border-border/50 pt-4 mb-6">
                    <p className="font-roboto text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                      Features Included
                    </p>
                    <div className="flex items-center gap-2 text-sm text-text-main">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>
                        {plan.config?.unlimitedRides
                          ? 'Unlimited Rides'
                          : `${plan.config?.numberOfRides || 0} Rides Allowed`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-main">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>
                        {plan.config?.unlimitedItemInMarketplace
                          ? 'Unlimited Marketplace Items'
                          : `${plan.config?.marketplaceItems || 0} Marketplace Items`}
                      </span>
                    </div>
                    {plan.config?.stravaConnection && (
                      <div className="flex items-center gap-2 text-sm text-text-main">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>Strava Connection</span>
                      </div>
                    )}
                    {plan.config?.gpxDownload && (
                      <div className="flex items-center gap-2 text-sm text-text-main">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>GPX Route Download</span>
                      </div>
                    )}
                    {plan.config?.clubStripeIntegration && (
                      <div className="flex items-center gap-2 text-sm text-text-main">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>Club Stripe Integration</span>
                      </div>
                    )}
                    {plan.config?.premiumChat && (
                      <div className="flex items-center gap-2 text-sm text-text-main">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>Premium Chat</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-roboto text-text-muted">
                  <span>ID: #{plan.id}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                      plan.isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateEditPlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        planToEdit={selectedPlan}
      />
    </div>
  );
};

export default SubscriptionPlansTable;
