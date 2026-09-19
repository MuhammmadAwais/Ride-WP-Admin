import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Bell, ArrowRight, CheckCircle2, Send, Radio } from 'lucide-react';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';
import { useGetNotificationHistoryQuery } from '@/features/notifications/api/notificationApi';

export default function DashboardOperationsDeck() {
  const navigate = useNavigate();
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const { data: notifData, isLoading: notifLoading } = useGetNotificationHistoryQuery({ limit: 3 });

  const notifications = notifData?.history || notifData?.notifications || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Monetization & Subscription Tiers */}
      <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">
                  SaaS Monetization Tiers
                </h3>
                <p className="font-roboto text-text-muted text-xs">Active subscription and club tiers</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/subscriptions')}
              className="text-xs font-bold text-[#EB712B] hover:text-[#d45e1d] flex items-center gap-1 group"
            >
              <span>Manage Plans</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Plans Grid / List */}
          <div className="space-y-2.5 mt-4">
            {plansLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-main-bg/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : plans && plans.length > 0 ? (
              plans.slice(0, 3).map((plan) => {
                const isFree = Number(plan.price) === 0;
                const formattedPrice = isFree ? 'Free' : `€${plan.price}`;
                const configCount = plan.config ? Object.keys(plan.config).length : 0;
                const interval = plan.billingInterval || 'monthly';

                return (
                  <div
                    key={plan.id}
                    onClick={() => navigate('/subscriptions')}
                    className="p-3.5 rounded-2xl bg-main-bg/40 border border-border hover:border-[#EB712B]/40 hover:bg-main-bg/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-xs text-[#EB712B] shrink-0 group-hover:scale-105 transition-transform">
                        {isFree ? '0€' : 'PRO'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-poppins font-bold text-xs text-text-main truncate group-hover:text-[#EB712B] transition-colors">
                          {plan.name}
                        </h4>
                        <p className="font-roboto text-[11px] text-text-muted truncate">
                          {configCount > 0 ? `${configCount} features configured` : 'Active tier'} • {interval}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-poppins font-extrabold text-sm text-text-main block">
                        {formattedPrice}
                      </span>
                      <span className="text-[10px] font-roboto text-text-muted uppercase">
                        {isFree ? 'Lifetime' : `per ${interval}`}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 bg-main-bg/20 rounded-2xl border border-dashed border-border p-4">
                <p className="font-poppins text-xs font-semibold text-text-main">No Plans Configured</p>
                <p className="font-roboto text-text-muted text-[11px] mt-0.5">
                  Configure subscription tiers to start monetizing clubs.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border pt-3.5 mt-4 flex items-center justify-between text-xs font-roboto text-text-muted">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Stripe Connect platform active</span>
          </span>
          <span className="font-medium text-text-main">EUR (€) Base Currency</span>
        </div>
      </div>

      {/* 2. Push Broadcast Activity Log */}
      <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Radio size={16} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">
                  Push Transmission Console
                </h3>
                <p className="font-roboto text-text-muted text-xs">Recent broadcast alerts & announcements</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className="text-xs font-bold text-[#EB712B] hover:text-[#d45e1d] flex items-center gap-1 group"
            >
              <span>Broadcast Log</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Broadcast List */}
          <div className="space-y-2.5 mt-4">
            {notifLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-main-bg/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 3).map((item) => {
                const targetLabel = item.targetSegment === 'all' || item.isAllUser ? 'All Athletes' : 'Targeted';
                const dateStr = item.createdAt || item.sentAt 
                  ? new Date(item.createdAt || item.sentAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                  : 'Recent';

                return (
                  <div
                    key={item.id}
                    onClick={() => navigate('/notifications')}
                    className="p-3.5 rounded-2xl bg-main-bg/40 border border-border hover:border-[#EB712B]/40 hover:bg-main-bg/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Bell size={15} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-poppins font-bold text-xs text-text-main truncate group-hover:text-[#EB712B] transition-colors">
                          {item.title}
                        </h4>
                        <p className="font-roboto text-[11px] text-text-muted truncate">
                          {item.body}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-surface border border-border text-text-muted">
                        {targetLabel}
                      </span>
                      <span className="font-roboto text-[10px] text-text-muted block mt-1">
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 bg-main-bg/20 rounded-2xl border border-dashed border-border p-4">
                <Send className="w-8 h-8 text-text-muted mx-auto mb-1.5 opacity-40" />
                <p className="font-poppins text-xs font-semibold text-text-main">No Broadcasts Dispatched</p>
                <p className="font-roboto text-text-muted text-[11px] mt-0.5">
                  Dispatch instant announcements to your athlete community.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border pt-3.5 mt-4 flex items-center justify-between">
          <span className="font-roboto text-xs text-text-muted">
            FCM Cloud Messaging: <strong className="text-emerald-500">Connected</strong>
          </span>
          <button
            onClick={() => navigate('/notifications')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EB712B]/10 hover:bg-[#EB712B]/20 text-[#EB712B] text-xs font-semibold transition-colors"
          >
            <Send size={11} />
            <span>Send Alert</span>
          </button>
        </div>
      </div>

    </div>
  );
}
