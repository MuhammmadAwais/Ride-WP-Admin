/**
 * @fileoverview Modal dialog for Creating or Updating a Subscription Plan.
 * Uses RTK Query useCreatePlanMutation and useUpdatePlanMutation with Zod validation.
 */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, PlusCircle, Edit3 } from 'lucide-react';
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
  numberOfRides: z.number().optional(),
  marketplaceItems: z.number().optional(),
  unlimitedRides: z.boolean(),
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

const CreateEditPlanModal: React.FC<CreateEditPlanModalProps> = ({
  isOpen,
  onClose,
  planToEdit,
}) => {
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
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
      numberOfRides: 10,
      marketplaceItems: 10,
      unlimitedRides: false,
      stravaConnection: true,
      gpxDownload: true,
      clubStripeIntegration: true,
      paidActivities: true,
      premiumChat: false,
    },
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        description: planToEdit.description,
        price: Number(planToEdit.price) || 0,
        currency: planToEdit.currency || 'eur',
        billingInterval: (planToEdit.billingInterval as 'free' | 'monthly' | 'yearly') || 'monthly',
        planScope: (planToEdit.planScope as 'user' | 'club') || 'club',
        trialPeriodDays: planToEdit.trialPeriodDays || null,
        isActive: planToEdit.isActive,
        numberOfRides: planToEdit.config?.numberOfRides || 0,
        marketplaceItems: planToEdit.config?.marketplaceItems || 0,
        unlimitedRides: Boolean(planToEdit.config?.unlimitedRides),
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
        numberOfRides: 10,
        marketplaceItems: 10,
        unlimitedRides: false,
        stravaConnection: true,
        gpxDownload: true,
        clubStripeIntegration: true,
        paidActivities: true,
        premiumChat: false,
      });
    }
  }, [planToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: PlanFormValues) => {
    try {
      const configPayload = {
        numberOfRides: data.numberOfRides,
        marketplaceItems: data.marketplaceItems,
        unlimitedRides: data.unlimitedRides,
        stravaConnection: data.stravaConnection,
        gpxDownload: data.gpxDownload,
        clubStripeIntegration: data.clubStripeIntegration,
        paidActivities: data.paidActivities,
        premiumChat: data.premiumChat,
      };

      if (planToEdit) {
        await updatePlan({
          planId: planToEdit.id,
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          billingInterval: data.billingInterval,
          planScope: data.planScope,
          trialPeriodDays: data.trialPeriodDays || null,
          isActive: data.isActive,
          config: configPayload,
        }).unwrap();

        toast.success('Subscription plan updated successfully!');
      } else {
        await createPlan({
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          billingInterval: data.billingInterval,
          planScope: data.planScope,
          trialPeriodDays: data.trialPeriodDays || null,
          isActive: data.isActive,
          config: configPayload,
        }).unwrap();

        toast.success('New subscription plan created successfully!');
      }
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              {planToEdit ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-text-main">
                {planToEdit ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
              </h2>
              <p className="font-roboto text-sm text-text-muted">
                {planToEdit
                  ? `Update configuration for #${planToEdit.id}`
                  : 'Configure pricing, interval, and feature limits'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Plan Name
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Gold Yearly Plan"
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              />
              {errors.name && (
                <p className="text-xs text-error mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Billing Interval
              </label>
              <select
                {...register('billingInterval')}
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Description
              </label>
              <input
                type="text"
                {...register('description')}
                placeholder="Brief summary of what this plan includes"
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              />
              {errors.description && (
                <p className="text-xs text-error mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              />
              {errors.price && (
                <p className="text-xs text-error mt-1">{errors.price.message}</p>
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
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 uppercase"
              />
            </div>

            <div>
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Plan Scope
              </label>
              <select
                {...register('planScope')}
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              >
                <option value="club">Club</option>
                <option value="user">User</option>
              </select>
            </div>

            <div>
              <label className="block font-poppins font-semibold text-sm text-text-main mb-1.5">
                Trial Period (Days)
              </label>
              <input
                type="number"
                {...register('trialPeriodDays', { valueAsNumber: true })}
                placeholder="0 or empty"
                className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
              />
            </div>
          </div>

          {/* Config Limits */}
          <div className="border-t border-border pt-4">
            <h3 className="font-poppins font-semibold text-sm text-text-main mb-4">
              Feature Configuration & Limits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-roboto text-xs text-text-muted mb-1">
                  Number of Rides
                </label>
                <input
                  type="number"
                  {...register('numberOfRides', { valueAsNumber: true })}
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-2.5 outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block font-roboto text-xs text-text-muted mb-1">
                  Marketplace Items Limit
                </label>
                <input
                  type="number"
                  {...register('marketplaceItems', { valueAsNumber: true })}
                  className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-2.5 outline-none focus:border-accent/50"
                />
              </div>
            </div>

            {/* Checkbox toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-main-bg/50 p-4 rounded-xl border border-border/50">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('unlimitedRides')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>Unlimited Rides</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('stravaConnection')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>Strava Connection</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('gpxDownload')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>GPX Download</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('clubStripeIntegration')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>Stripe Integration</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('paidActivities')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>Paid Activities</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-text-main">
                <input
                  type="checkbox"
                  {...register('premiumChat')}
                  className="w-4 h-4 rounded border-border bg-main-bg accent-accent"
                />
                <span>Premium Chat</span>
              </label>
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-text-main">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-5 h-5 rounded border-border bg-main-bg accent-accent"
              />
              <span>Plan is Active</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-white/5 transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
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
    </div>
  );
};

export default CreateEditPlanModal;
