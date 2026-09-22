/**
 * @fileoverview SaaS Subscription Plans & Monetization Control Center.
 * 100% Dynamic interface connected directly to backend RTK Query endpoints:
 * - GET /admin/subscription/plans
 * - POST /admin/subscription/plan
 * - PUT /admin/subscription/plan
 * - DELETE /admin/subscription/plan
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SubscriptionPlansTable from '@/features/subscriptions/components/SubscriptionPlansTable';

export default function PaymentsPage() {
  return (
    <>
      <Helmet>
        <title>Subscriptions & Monetization | Ride With Pals Admin</title>
      </Helmet>

      <div className="animate-fade-in pb-12">
        <SubscriptionPlansTable />
      </div>
    </>
  );
}
