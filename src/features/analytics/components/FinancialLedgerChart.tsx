/**
 * @fileoverview SaaS Subscription Plans & Monetization Structure Chart.
 * Replaces legacy fuel savings/PKR copy with real plan pricing and quota limits from useGetPlansQuery.
 * 100% dynamic and accurate to platform monetization.
 */
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Layers, Loader2 } from 'lucide-react';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-xl border border-border p-3.5 rounded-2xl shadow-xl">
        <p className="font-poppins font-bold text-text-main text-sm mb-1">{data.fullName}</p>
        <p className="font-roboto text-xs text-text-muted mb-2">
          Scope: <span className="font-semibold uppercase text-accent">{data.scope}</span> • {data.interval}
        </p>
        <div className="space-y-1 text-xs font-roboto">
          <div className="flex items-center justify-between gap-3 text-text-muted">
            <span>Price:</span>
            <span className="font-poppins font-bold text-text-main">
              €{data.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-text-muted">
            <span>Rides Quota:</span>
            <span className="font-semibold text-emerald-400">
              {data.unlimitedRides ? 'Unlimited' : `${data.ridesQuota} rides`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-text-muted">
            <span>Marketplace:</span>
            <span className="font-semibold text-indigo-400">
              {data.unlimitedMarketplace ? 'Unlimited' : `${data.marketplaceQuota} items`}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function FinancialLedgerChart() {
  const { data: plans, isLoading } = useGetPlansQuery();

  const chartData = useMemo(() => {
    if (!plans || plans.length === 0) return [];

    const nonDeleted = plans.filter((p) => !p.isDeleted);
    return nonDeleted.map((p) => ({
      name: p.name.length > 12 ? `${p.name.slice(0, 10)}...` : p.name,
      fullName: p.name,
      price: Number(p.price) || 0,
      ridesQuota: p.config?.unlimitedRides ? 100 : (p.config?.numberOfRides ?? 0),
      marketplaceQuota: p.config?.unlimitedItemInMarketplace ? 50 : (p.config?.marketplaceItems ?? 0),
      unlimitedRides: Boolean(p.config?.unlimitedRides),
      unlimitedMarketplace: Boolean(p.config?.unlimitedItemInMarketplace),
      scope: p.planScope || 'club',
      interval: p.billingInterval || 'monthly',
    }));
  }, [plans]);

  return (
    <div className="analytics-card opacity-0 w-full bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between h-[400px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-poppins font-bold text-xl text-text-main">
              Monetization Structure
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              EUR Billing
            </span>
          </div>
          <p className="font-roboto text-sm text-text-muted mt-1">
            Pricing comparisons across active SaaS subscription tiers
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
          <Layers size={18} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <Loader2 size={28} className="animate-spin text-accent" />
            <span className="font-roboto text-xs">Loading plan pricing matrix...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted text-center p-4">
            <p className="font-poppins font-bold text-sm">No Subscription Tiers Found</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'Roboto' }}
                className="text-text-muted"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'Roboto' }}
                className="text-text-muted"
                unit="€"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontFamily: 'Roboto', fontSize: '12px' }}
              />
              <Bar
                dataKey="price"
                name="Tier Price (€)"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
