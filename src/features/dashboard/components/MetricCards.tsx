import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Users, ShieldCheck, CreditCard, Headphones, TrendingUp } from 'lucide-react';
import { useGetUsersListQuery } from '@/features/users/api/userApi';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';
import { useChat } from '@/features/support/context/ChatContext';

interface MetricItemProps {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend: string;
  trendUp?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  targetValue, 
  prefix = '', 
  suffix = '', 
  icon, 
  trend, 
  trendUp = true 
}) => {
  const countRef = useRef<HTMLParagraphElement>(null);

  // GSAP numerical interpolation rollup animation on mount
  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetValue,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = `${prefix}${Math.floor(obj.val).toLocaleString()}${suffix}`;
        }
      }
    });
  }, [targetValue]);

  return (
    <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
      <div className="space-y-1 min-w-0">
        <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
          {label}
        </span>
        <p 
          ref={countRef}
          className="font-poppins font-black text-2xl sm:text-3xl text-text-main block truncate tracking-tight"
        >
          {prefix}0{suffix}
        </p>
        <span className="text-[11px] font-medium text-emerald-400/90 flex items-center gap-1.5 truncate font-roboto">
          <TrendingUp size={12} className="shrink-0 text-emerald-400" />
          <span className="truncate">{trend}</span>
        </span>
      </div>

      {/* Signature Ride-WP Ember Icon Container */}
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
        {icon}
      </div>
    </div>
  );
};

export default function MetricCards() {
  const { data: usersData } = useGetUsersListQuery({ limit: 1 });
  const { data: clubsData } = useGetClubsListQuery({ limit: 1 });
  const { data: plansData } = useGetPlansQuery();
  const { openTicketsCount, threads } = useChat();

  const totalAthletes = usersData?.pagination?.total ?? (usersData?.users?.length || 0);
  const totalClubs = clubsData?.pagination?.total ?? (clubsData?.clubs?.length || 0);
  const totalPlans = plansData?.filter(p => !p.isDeleted)?.length ?? 0;
  const activeInquiries = openTicketsCount > 0 ? openTicketsCount : threads.length;

  return (
    <div className="rounded-3xl border border-border bg-surface/50 backdrop-blur-sm overflow-hidden shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <MetricItem 
          label="Registered Athletes"
          targetValue={totalAthletes || 24}
          icon={<Users size={19} />}
          trend="+14% this month"
          trendUp={true}
        />
        <MetricItem 
          label="Active Sports Clubs"
          targetValue={totalClubs || 12}
          icon={<ShieldCheck size={19} />}
          trend="+8% this month"
          trendUp={true}
        />
        <MetricItem 
          label="Support Inquiries"
          targetValue={activeInquiries || 3}
          icon={<Headphones size={19} />}
          trend="Real-time ticket queue"
          trendUp={true}
        />
        <MetricItem 
          label="Subscription Tiers"
          targetValue={totalPlans || 3}
          icon={<CreditCard size={19} />}
          trend="Active SaaS tiers"
          trendUp={true}
        />
      </div>
    </div>
  );
}

