/**
 * @fileoverview Payments and Subscriptions Management page.
 * Features a tabbed interface switching between Wallet & Transactions and live RTK Query Subscription Plans.
 */
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Download, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Landmark,
  Wallet,
  Sparkles
} from 'lucide-react';
import SubscriptionPlansTable from '@/features/subscriptions/components/SubscriptionPlansTable';

// ─── Mock Data for Wallet Transactions ────────────────────────────────────────

const mockTransactions = [
  { id: 'TX-9821', name: 'Club Payout - Cycling Madrid', date: 'Oct 24, 2023', amount: '+$1,450.00', status: 'Completed', type: 'in' },
  { id: 'TX-9820', name: 'Stripe Fee Deduction', date: 'Oct 23, 2023', amount: '-$42.50', status: 'Completed', type: 'out' },
  { id: 'TX-9819', name: 'Member Refund #402', date: 'Oct 21, 2023', amount: '-$120.00', status: 'Completed', type: 'out' },
  { id: 'TX-9818', name: 'Club Payout - Velo BCN', date: 'Oct 19, 2023', amount: '+$2,890.00', status: 'Completed', type: 'in' },
  { id: 'TX-9817', name: 'Monthly Server Cost', date: 'Oct 15, 2023', amount: '-$350.00', status: 'Completed', type: 'out' },
  { id: 'TX-9816', name: 'Club Payout - Alpine Riders', date: 'Oct 12, 2023', amount: '+$840.00', status: 'Pending', type: 'in' },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'subscriptions'>('wallet');
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-poppins font-bold text-3xl text-text-main">
            Payments & Subscriptions
          </h1>
          <p className="font-roboto text-sm text-text-muted mt-1">
            Monitor revenue, manage admin payouts, and configure club subscription tiers
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl text-sm font-poppins font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'wallet'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Wallet size={16} />
            <span>Wallet & Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-sm font-poppins font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'subscriptions'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Sparkles size={16} />
            <span>Subscription Plans</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Wallet & Transactions */}
      {activeTab === 'wallet' && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Total Balance" 
              amount="$45,231.89" 
              icon={<DollarSign size={24} />} 
              color="text-emerald-500" 
              bg="bg-emerald-500/10" 
            />
            <StatCard 
              title="Pending Payouts" 
              amount="$3,450.00" 
              icon={<Clock size={24} />} 
              color="text-amber-500" 
              bg="bg-amber-500/10" 
            />
            <StatCard 
              title="Monthly Revenue" 
              amount="$12,890.45" 
              icon={<TrendingUp size={24} />} 
              color="text-blue-500" 
              bg="bg-blue-500/10" 
            />
          </div>

          {/* Main Layout Grid */}
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Transactions List */}
            <div className={`flex-1 ${showWithdraw && window.innerWidth < 1280 ? 'hidden' : 'block'}`}>
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-text-main">Recent Transactions</h2>
                    <p className="font-roboto text-sm text-text-muted mt-0.5">Updated in real-time</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowWithdraw(true)}
                      className="xl:hidden px-4 py-2 rounded-xl bg-accent text-white font-poppins font-bold text-xs flex items-center gap-1.5"
                    >
                      <CreditCard size={14} /> Withdraw
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-border text-text-muted hover:text-text-main text-xs font-poppins font-semibold flex items-center gap-2">
                      <Download size={14} /> Export CSV
                    </button>
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-4 sm:p-5 rounded-xl border border-border/60 hover:border-accent/40 bg-main-bg/50 hover:bg-main-bg transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-text-main text-sm sm:text-base group-hover:text-accent transition-colors">
                            {tx.name}
                          </p>
                          <p className="font-roboto text-text-muted text-xs mt-0.5">
                            {tx.id} • {tx.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className={`font-roboto font-bold text-sm sm:text-base ${
                            tx.type === 'in' ? 'text-emerald-500' : 'text-text-main'
                          }`}>
                            {tx.amount}
                          </p>
                          <p className="font-roboto text-text-muted text-xs uppercase tracking-wider">{tx.status}</p>
                        </div>
                        <ChevronRight size={18} className="text-text-muted/40 group-hover:text-accent transition-colors hidden sm:block" />
                      </div>
                    </div>
                  ))}
                 </div>
              </div>
            </div>

            {/* Withdraw Panel (Right Side on Desktop, Full on Mobile when active) */}
            {(showWithdraw || (typeof window !== 'undefined' && window.innerWidth >= 1280)) && (
              <div className={`xl:w-1/3 flex flex-col ${showWithdraw && typeof window !== 'undefined' && window.innerWidth < 1280 ? 'w-full' : ''}`}>
                {showWithdraw && typeof window !== 'undefined' && window.innerWidth < 1280 && (
                   <button 
                     onClick={() => setShowWithdraw(false)}
                     className="mb-4 text-text-muted hover:text-text-main flex items-center gap-2 font-poppins text-sm"
                   >
                     ← Back to Wallet
                   </button>
                )}
                
                <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8 flex-1">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20">
                      <Landmark size={28} className="text-accent" />
                    </div>
                    <h2 className="font-poppins font-bold text-2xl text-text-main">Withdraw Amount</h2>
                    <p className="font-roboto text-text-muted text-sm mt-2">Transfer funds to your bank account instantly.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-poppins font-semibold text-sm text-text-main mb-2">Account Number</label>
                      <input type="text" placeholder="Add number" className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all" />
                    </div>
                    <div>
                      <label className="block font-poppins font-semibold text-sm text-text-main mb-2">Account Holder Name</label>
                      <input type="text" placeholder="Add text" className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all" />
                    </div>
                    <div>
                      <label className="block font-poppins font-semibold text-sm text-text-main mb-2">Bank Name</label>
                      <div className="relative">
                        <select 
                          defaultValue=""
                          className="w-full bg-main-bg border border-border dark:border-white/5 rounded-xl px-4 py-2.5 text-[14px] font-roboto text-text-main focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none transition-all appearance-none"
                        >
                          <option value="" disabled>Select Bank</option>
                          <option value="chase">Chase Bank</option>
                          <option value="bofa">Bank of America</option>
                          <option value="wells">Wells Fargo</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
                           <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block font-poppins font-semibold text-sm text-text-main mb-2">Amount to withdraw</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-text-muted" />
                         </div>
                         <input type="text" placeholder="Add amount" className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all font-roboto font-bold" />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="w-full py-3.5 rounded-xl bg-accent text-white font-poppins font-bold text-[15px] shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <CreditCard size={18} /> Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Subscription Plans */}
      {activeTab === 'subscriptions' && (
        <div className="animate-fade-in">
          <SubscriptionPlansTable />
        </div>
      )}
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatCard({ title, amount, icon, color, bg }: { title: string, amount: string, icon: React.ReactNode, color: string, bg: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:border-accent/30 transition-colors group">
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <p className="font-poppins font-semibold text-text-muted text-sm">{title}</p>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <p className="font-roboto font-bold text-3xl sm:text-4xl text-text-main">{amount}</p>
    </div>
  );
}
