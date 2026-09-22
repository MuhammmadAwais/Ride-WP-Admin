/**
 * @fileoverview Compact, high-UX Push Notification Broadcast Bar for the Admin Dashboard.
 * Replaces bulky consoles with a streamlined command strip featuring FCM connection status,
 * the last 2-3 live broadcast transmissions from notificationApi, and an instant Send Alert CTA.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Send, Bell, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useGetNotificationHistoryQuery } from '@/features/notifications/api/notificationApi';
import { ROUTES } from '@/Constants';

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const DashboardBroadcastBar: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotificationHistoryQuery({ limit: 3 });

  const notifications = data?.history || data?.notifications || [];
  const recentThree = notifications.slice(0, 3);

  return (
    <div className="bg-surface border border-border rounded-3xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* ── Left Identity & Status ───────────────────────────────────────── */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center text-accent shrink-0 shadow-xs">
            <Radio size={20} className="animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-poppins font-bold text-sm sm:text-base text-text-main tracking-tight">
                Push Transmission Center
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-poppins font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FCM Active
              </span>
            </div>
            <p className="font-roboto text-xs text-text-muted mt-0.5">
              Instant mobile announcements to the athlete community
            </p>
          </div>
        </div>

        {/* ── Center: Last 2-3 Broadcast History Stream ────────────────────── */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-11 bg-main-bg/50 border border-border rounded-2xl flex-1 animate-pulse" />
              ))}
            </div>
          ) : recentThree.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {recentThree.map((item) => {
                const targetLabel = item.targetSegment === 'all' || item.isAllUser ? 'All' : 'Targeted';
                const timeAgo = formatRelativeTime(item.createdAt || item.sentAt);

                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(ROUTES.PUSH_NOTIFICATIONS)}
                    className="p-2.5 px-3 rounded-2xl bg-main-bg/50 hover:bg-main-bg border border-border hover:border-accent/40 transition-all cursor-pointer flex items-center justify-between gap-2.5 group select-none"
                    title={item.title}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Send size={11} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-poppins font-bold text-xs text-text-main truncate group-hover:text-accent transition-colors leading-tight">
                          {item.title}
                        </p>
                        <p className="font-roboto text-[11px] text-text-muted truncate mt-0.5">
                          {item.body}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[9px] font-poppins font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted">
                        {targetLabel}
                      </span>
                      <span className="block text-[10px] font-roboto text-text-muted mt-0.5">
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-2.5 px-3.5 rounded-2xl bg-main-bg/40 border border-dashed border-border text-xs font-roboto text-text-muted">
              <Sparkles size={14} className="text-accent/60 shrink-0" />
              <span className="truncate">
                No recent broadcast transmissions. Send an instant announcement to mobile athletes anytime.
              </span>
            </div>
          )}
        </div>

        {/* ── Right Actions & CTA ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => navigate(ROUTES.PUSH_NOTIFICATIONS)}
            className="px-3.5 py-2.5 rounded-xl border border-border hover:border-accent/40 bg-main-bg/60 hover:bg-main-bg text-text-muted hover:text-text-main text-xs font-poppins font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="View Full Broadcast Log"
          >
            <span>Logs</span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={() => navigate(ROUTES.PUSH_NOTIFICATIONS)}
            className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-poppins font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_14px_-2px_rgba(235,113,43,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Send size={13} />
            <span>Send Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBroadcastBar;
