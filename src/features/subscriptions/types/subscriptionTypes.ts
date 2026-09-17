/**
 * @fileoverview Strict TypeScript interfaces for the Subscription and Plans feature.
 * Matches schemas defined in Admin.postman_collection.json.
 */

/**
 * Flexible configuration options for a subscription plan.
 */
export interface PlanConfig {
  numberOfRides?: number;
  marketplaceItems?: number;
  unlimitedRides?: boolean;
  stravaConnection?: boolean;
  gpxDownload?: boolean;
  unlimitedItemInMarketplace?: boolean;
  clubStripeIntegration?: boolean;
  clubMembers?: number;
  unlimitedClubMembers?: boolean;
  paidActivities?: boolean;
  premiumChat?: boolean;
  [key: string]: unknown;
}

/**
 * Full domain model for a Subscription Plan returned by the API.
 */
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string | number;
  currency: string;
  billingInterval: 'free' | 'monthly' | 'yearly' | string;
  planScope?: 'user' | 'club' | string;
  config: PlanConfig;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  trialPeriodDays?: number | null;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload sent when creating a new subscription plan via POST /admin/subscription/plan.
 */
export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: string;
  planScope?: string;
  config: PlanConfig;
  trialPeriodDays?: number | null;
  isActive: boolean;
}

/**
 * Payload sent when updating an existing plan via PUT /admin/subscription/plan.
 */
export interface UpdatePlanRequest {
  planId: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: string;
  planScope?: string;
  config: PlanConfig;
  trialPeriodDays?: number | null;
  isActive: boolean;
}

/**
 * Payload sent when deleting a plan via DELETE /admin/subscription/plan.
 */
export interface DeletePlanRequest {
  planId: number;
}

/**
 * Query parameter payload for GET /admin/subscription/plan.
 */
export interface GetPlanByIdRequest {
  planId: number;
}

/**
 * Standardized API wrapper response from the backend subscription endpoints.
 */
export interface SubscriptionApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}

/**
 * Filter criteria types for Subscription UI.
 */
export type PlanScopeFilter = 'all' | 'user' | 'club';
export type PlanIntervalFilter = 'all' | 'free' | 'monthly' | 'yearly';

