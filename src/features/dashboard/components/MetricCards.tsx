import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Users, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import { useGetUsersListQuery } from '@/features/users/api/userApi';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';
import { useChat } from '@/features/support/context/ChatContext';

interface MetricCardProps {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  targetValue, 
  prefix = '', 
  suffix = '', 
  icon, 
  trend, 
  trendUp 
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
    <div className="bg-surface border border-border rounded-3xl p-6 transition-transform hover:-translate-y-0.5 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          {icon}
        </div>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {trendUp ? '↑' : '↓'} {trend.split(' ')[0]}
        </span>
      </div>

      <p 
        ref={countRef}
        className="font-poppins font-extrabold text-[28px] text-text-main leading-none tracking-tight"
      >
        {prefix}0{suffix}
      </p>
      
      <p className="font-poppins font-bold text-text-muted text-[11px] uppercase tracking-wider mt-3">
        {label}
      </p>

      <p className="font-roboto text-text-muted text-xs mt-1.5 opacity-80">
        {trend}
      </p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        label="Registered Athletes"
        targetValue={totalAthletes || 24}
        icon={<Users size={20} />}
        trend="+14% this month"
        trendUp={true}
      />
      <MetricCard 
        label="Active Sports Clubs"
        targetValue={totalClubs || 12}
        icon={<ShieldCheck size={20} />}
        trend="+8% this month"
        trendUp={true}
      />
      <MetricCard 
        label="Support Inquiries"
        targetValue={activeInquiries || 3}
        icon={<Headphones size={20} />}
        trend="Real-time ticket queue"
        trendUp={true}
      />
      <MetricCard 
        label="Subscription Tiers"
        targetValue={totalPlans || 3}
        icon={<CreditCard size={20} />}
        trend="Active SaaS tiers"
        trendUp={true}
      />
    </div>
  );
}

