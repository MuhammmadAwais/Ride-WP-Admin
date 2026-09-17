/**
 * @fileoverview Modal dialog for Creating or Updating a Subscription Plan.
 * Features portal rendering into #modal-root, GSAP entrance/exit micro-animations,
 * comprehensive quota and feature flag toggles, dynamic scope adaptations, and Zod validation.
 */
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Loader2,
  PlusCircle,
  Edit3,
  Bike,
  ShoppingBag,
  Users,
  Sparkles,
  DollarSign,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from '@/features/subscriptions/api/subscriptionApi';
import type { SubscriptionPlan } from '@/features/subscriptions/types/subscriptionTypes';

const planSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.number().min(0, 'Price must be 0 or positive'),
  currency: z.string().min(3, 'Currency is required'),
  billingInterval: z.enum(['free', 'monthly', 'yearly']),
  planScope: z.enum(['user', 'club']),
  trialPeriodDays: z.number().nullable().optional(),
  isActive: z.boolean(),
  // Quota configurations
  unlimitedRides: z.boolean(),
  numberOfRides: z.number().min(0).optional(),
  unlimitedItemInMarketplace: z.boolean(),
  marketplaceItems: z.number().min(0).optional(),
  unlimitedClubMembers: z.boolean(),
  clubMembers: z.number().min(0).optional(),
  // Feature flags
  stravaConnection: z.boolean(),
  gpxDownload: z.boolean(),
  clubStripeIntegration: z.boolean(),
  paidActivities: z.boolean(),
  premiumChat: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface CreateEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToEdit?: SubscriptionPlan | null;
}

export const CreateEditPlanModal: React.FC<CreateEditPlanModalProps> = ({
  isOpen,
  onClose,
  planToEdit,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: 'eur',
      billingInterval: 'monthly',
      planScope: 'club',
      trialPeriodDays: null,
      isActive: true,
      unlimitedRides: false,
      numberOfRides: 10,
      unlimitedItemInMarketplace: false,
      marketplaceItems: 10,
      unlimitedClubMembers: false,
      clubMembers: 50,
      stravaConnection: true,
      gpxDownload: true,
      clubStripeIntegration: true,
      paidActivities: true,
      premiumChat: false,
    },
  });

  const planScope = watch('planScope');
  const billingInterval = watch('billingInterval');
  const unlimitedRides = watch('unlimitedRides');
  const unlimitedItemInMarketplace = watch('unlimitedItemInMarketplace');
  const unlimitedClubMembers = watch('unlimitedClubMembers');

  // Sync form state on planToEdit changes
  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        description: planToEdit.description,
        price: Number(planToEdit.price) || 0,
        currency: (planToEdit.currency || 'eur').toLowerCase(),
        billingInterval: (planToEdit.billingInterval as 'free' | 'monthly' | 'yearly') || 'monthly',
        planScope: (planToEdit.planScope as 'user' | 'club') || 'club',
        trialPeriodDays: planToEdit.trialPeriodDays ?? null,
        isActive: planToEdit.isActive ?? true,
        unlimitedRides: Boolean(planToEdit.config?.unlimitedRides),
        numberOfRides: planToEdit.config?.numberOfRides ?? 10,
        unlimitedItemInMarketplace: Boolean(planToEdit.config?.unlimitedItemInMarketplace),
        marketplaceItems: planToEdit.config?.marketplaceItems ?? 10,
        unlimitedClubMembers: Boolean(planToEdit.config?.unlimitedClubMembers),
        clubMembers: planToEdit.config?.clubMembers ?? 50,
        stravaConnection: Boolean(planToEdit.config?.stravaConnection),
        gpxDownload: Boolean(planToEdit.config?.gpxDownload),
        clubStripeIntegration: Boolean(planToEdit.config?.clubStripeIntegration),
        paidActivities: Boolean(planToEdit.config?.paidActivities),
        premiumChat: Boolean(planToEdit.config?.premiumChat),
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        currency: 'eur',
        billingInterval: 'monthly',
        planScope: 'club',
        trialPeriodDays: null,
        isActive: true,
        unlimitedRides: false,
        numberOfRides: 10,
        unlimitedItemInMarketplace: false,
        marketplaceItems: 10,
        unlimitedClubMembers: false,
        clubMembers: 50,
        stravaConnection: true,
        gpxDownload: true,
        clubStripeIntegration: true,
        paidActivities: true,
        premiumChat: false,
      });
    }
  }, [planToEdit, reset, isOpen]);

  // GSAP Entrance
  useGSAP(
    () => {
      if (isOpen) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
        gsap.fromTo(
          cardRef.current,
          { scale: 0.9, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
        );
      }
    },
    { dependencies: [isOpen] }
  );

  const handleClose = () => {
    if (isSubmitting) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(cardRef.current, {
      scale: 0.94,
      opacity: 0,
      y: 12,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const configPayload = {
        numberOfRides: data.unlimitedRides ? undefined : data.numberOfRides,
        marketplaceItems: data.unlimitedItemInMarketplace ? undefined : data.marketplaceItems,
        clubMembers: data.planScope === 'club' && !data.unlimitedClubMembers ? data.clubMembers : undefined,
        unlimitedRides: data.unlimitedRides,
        unlimitedItemInMarketplace: data.unlimitedItemInMarketplace,
        unlimitedClubMembers: data.planScope === 'club' ? data.unlimitedClubMembers : undefined,
        stravaConnection: data.stravaConnection,
        gpxDownload: data.gpxDownload,
        clubStripeIntegration: data.clubStripeIntegration,
        paidActivities: data.paidActivities,
        premiumChat: data.premiumChat,
      };

      if (planToEdit) {
        await updatePlan({
          planId: planToEdit.id,
          name: data.name.trim(),
          description: data.description.trim(),
          price: data.billingInterval === 'free' ? 0 : data.price,
          currency: data.currency.toLowerCase(),
          billingInterval: data.billingInterval,
          planScope: data.planScope,
          trialPeriodDays: data.trialPeriodDays || null,
          isActive: data.isActive,
          config: configPayload,
        }).unwrap();

        toast.success(`Plan "${data.name}" updated successfully!`);
      } else {
        await createPlan({
          name: data.name.trim(),
          description: data.description.trim(),
          price: data.billingInterval === 'free' ? 0 : data.price,
          currency: data.currency.toLowerCase(),
          billingInterval: data.billingInterval,
          planScope: data.planScope,
          trialPeriodDays: data.trialPeriodDays || null,
          isActive: data.isActive,
          config: configPayload,
        }).unwrap();

        toast.success(`Subscription plan "${data.name}" created successfully!`);
      }
      handleClose();
    } catch (err: unknown) {
      const errorObj = err as {
        message?: string;
        data?: { message?: string };
      };
      const msg =
        errorObj?.message ||
        errorObj?.data?.message ||
        'Failed to save subscription plan. Please check inputs.';
      toast.error(msg);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.3)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              {planToEdit ? <Edit3 size={22} /> : <PlusCircle size={22} />}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-text-main">
                {planToEdit ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
              </h2>
              <p className="font-roboto text-sm text-text-muted mt-0.5">
                {planToEdit
                  ? `Update configuration & entitlements for Plan #${planToEdit.id}`
                  : 'Configure pricing, billing cycle, quotas, and capabilities'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-text-muted hover:text-text-main transition-colors p-2 rounded-xl hover:bg-surface/60 border border-transparent hover:border-border"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent font-poppins">
              <Layers size={14} />
              <span>General Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Gold Yearly Plan"
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1 font-roboto">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Plan Scope *
                </label>
                <select
                  {...register('planScope')}
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto cursor-pointer"
                >
                  <option value="club">Club Plan (for club organizers)</option>
                  <option value="user">User Plan (for individual cyclists)</option>
                </select>
              </div>

              <div>
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Billing Interval *
                </label>
                <select
                  {...register('billingInterval')}
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="free">Free Tier</option>
                </select>
              </div>

              <div>
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Price ({watch('currency').toUpperCase()})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    disabled={billingInterval === 'free'}
                    {...register('price', { valueAsNumber: true })}
                    className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {billingInterval === 'free' && (
                  <p className="text-xs text-text-muted mt-1 font-roboto">Free tiers are priced at €0.00.</p>
                )}
                {errors.price && (
                  <p className="text-xs text-red-400 mt-1 font-roboto">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Currency
                </label>
                <input
                  type="text"
                  {...register('currency')}
                  placeholder="eur"
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto uppercase"
                />
                {errors.currency && (
                  <p className="text-xs text-red-400 mt-1 font-roboto">{errors.currency.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Trial Period (Days)
                </label>
                <input
                  type="number"
                  {...register('trialPeriodDays', {
                    setValueAs: (v) => (v === '' || isNaN(v) ? null : Number(v)),
                  })}
                  placeholder="e.g. 14 (leave empty for no trial)"
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={2}
                  {...register('description')}
                  placeholder="Summarize the plan perks and target audience..."
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all font-roboto resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1 font-roboto">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quotas and Limits Section */}
          <div className="space-y-4 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent font-poppins">
              <Bike size={14} />
              <span>Quotas & Limits</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rides Quota Card */}
              <div className="p-4 rounded-2xl bg-main-bg/50 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-semibold text-sm text-text-main flex items-center gap-2">
                    <Bike size={16} className="text-accent" />
                    Rides Allowance
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-roboto text-text-muted">
                    <input
                      type="checkbox"
                      {...register('unlimitedRides')}
                      className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>
                {!unlimitedRides ? (
                  <div>
                    <label className="block font-roboto text-xs text-text-muted mb-1">
                      Max Allowed Rides
                    </label>
                    <input
                      type="number"
                      {...register('numberOfRides', { valueAsNumber: true })}
                      className="w-full bg-surface border border-border text-text-main text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-accent/60 font-roboto"
                    />
                  </div>
                ) : (
                  <p className="text-xs font-roboto text-emerald-400 flex items-center gap-1.5 py-1">
                    <CheckCircle2 size={14} />
                    Subscribers can create unlimited rides
                  </p>
                )}
              </div>

              {/* Marketplace Items Quota Card */}
              <div className="p-4 rounded-2xl bg-main-bg/50 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-semibold text-sm text-text-main flex items-center gap-2">
                    <ShoppingBag size={16} className="text-accent" />
                    Marketplace Listings
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-roboto text-text-muted">
                    <input
                      type="checkbox"
                      {...register('unlimitedItemInMarketplace')}
                      className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                    />
                    <span>Unlimited</span>
                  </label>
                </div>
                {!unlimitedItemInMarketplace ? (
                  <div>
                    <label className="block font-roboto text-xs text-text-muted mb-1">
                      Max Marketplace Listings
                    </label>
                    <input
                      type="number"
                      {...register('marketplaceItems', { valueAsNumber: true })}
                      className="w-full bg-surface border border-border text-text-main text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-accent/60 font-roboto"
                    />
                  </div>
                ) : (
                  <p className="text-xs font-roboto text-emerald-400 flex items-center gap-1.5 py-1">
                    <CheckCircle2 size={14} />
                    Subscribers can list unlimited items
                  </p>
                )}
              </div>

              {/* Club Members Quota Card (When scope === 'club') */}
              {planScope === 'club' && (
                <div className="sm:col-span-2 p-4 rounded-2xl bg-main-bg/50 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-semibold text-sm text-text-main flex items-center gap-2">
                      <Users size={16} className="text-accent" />
                      Club Member Capacity
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-roboto text-text-muted">
                      <input
                        type="checkbox"
                        {...register('unlimitedClubMembers')}
                        className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                      />
                      <span>Unlimited</span>
                    </label>
                  </div>
                  {!unlimitedClubMembers ? (
                    <div>
                      <label className="block font-roboto text-xs text-text-muted mb-1">
                        Max Allowed Members in Club
                      </label>
                      <input
                        type="number"
                        {...register('clubMembers', { valueAsNumber: true })}
                        className="w-full bg-surface border border-border text-text-main text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-accent/60 font-roboto"
                      />
                    </div>
                  ) : (
                    <p className="text-xs font-roboto text-emerald-400 flex items-center gap-1.5 py-1">
                      <CheckCircle2 size={14} />
                      Clubs under this plan can host unlimited members
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Platform Capabilities & Feature Toggles */}
          <div className="space-y-4 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent font-poppins">
              <Sparkles size={14} />
              <span>Platform Capabilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-main-bg/40 hover:bg-main-bg/70 cursor-pointer transition-colors">
                <span className="font-roboto text-sm text-text-main font-medium">
                  Strava Integration
                </span>
                <input
                  type="checkbox"
                  {...register('stravaConnection')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-main-bg/40 hover:bg-main-bg/70 cursor-pointer transition-colors">
                <span className="font-roboto text-sm text-text-main font-medium">
                  GPX Route Download
                </span>
                <input
                  type="checkbox"
                  {...register('gpxDownload')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-main-bg/40 hover:bg-main-bg/70 cursor-pointer transition-colors">
                <span className="font-roboto text-sm text-text-main font-medium">
                  Club Stripe Integration
                </span>
                <input
                  type="checkbox"
                  {...register('clubStripeIntegration')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-main-bg/40 hover:bg-main-bg/70 cursor-pointer transition-colors">
                <span className="font-roboto text-sm text-text-main font-medium">
                  Paid Activities
                </span>
                <input
                  type="checkbox"
                  {...register('paidActivities')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                />
              </label>

              <label className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border bg-main-bg/40 hover:bg-main-bg/70 cursor-pointer transition-colors">
                <span className="font-roboto text-sm text-text-main font-medium">
                  Premium Chat Channels
                </span>
                <input
                  type="checkbox"
                  {...register('premiumChat')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Status Flag */}
          <div className="border-t border-border pt-5 flex items-center justify-between">
            <div>
              <p className="font-poppins font-semibold text-sm text-text-main">
                Plan Availability
              </p>
              <p className="font-roboto text-xs text-text-muted mt-0.5">
                Active plans can be selected and purchased by users on mobile and web
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-5 h-5 rounded border-border bg-main-bg accent-accent cursor-pointer"
              />
              <span className="font-poppins font-semibold text-sm text-text-main">Active</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-surface/50 transition-colors text-sm font-semibold font-poppins disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{planToEdit ? 'Update Plan' : 'Create Plan'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

export default CreateEditPlanModal;
