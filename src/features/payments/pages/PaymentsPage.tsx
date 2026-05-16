import { useState, useRef } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownToLine, Landmark, CreditCard, ChevronRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface PaymentTransaction {
  id: string;
  userName: string;
  type: 'Credit' | 'Debit';
  amount: string;
  date: string;
  status: 'Completed' | 'Pending';
}

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: '1', userName: 'Alexa George', type: 'Credit', amount: '+$50.00', date: 'Today, 10:30 AM', status: 'Completed' },
  { id: '2', userName: 'Ali Khan', type: 'Credit', amount: '+$120.00', date: 'Today, 09:15 AM', status: 'Completed' },
  { id: '3', userName: 'Withdrawal', type: 'Debit', amount: '-$500.00', date: 'Yesterday, 04:00 PM', status: 'Completed' },
  { id: '4', userName: 'Sara Ahmed', type: 'Credit', amount: '+$35.00', date: 'Yesterday, 02:20 PM', status: 'Completed' },
  { id: '5', userName: 'Zainab Abbas', type: 'Credit', amount: '+$80.00', date: '14 May 2025', status: 'Completed' },
];

export default function PaymentsPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Animations
  useGSAP(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="flex flex-col min-h-full space-y-8 pb-10" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-poppins font-bold text-3xl text-text-main tracking-tight">Wallet</h1>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Wallet View */}
        <div className={`flex-1 transition-all duration-500 ${showWithdraw ? 'hidden xl:block xl:w-2/3' : 'w-full'}`}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" ref={cardsRef}>
            <StatCard title="Today's Income" amount="$500" icon={<TrendingUp size={24} />} color="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard title="Monthly Income" amount="$3000" icon={<DollarSign size={24} />} color="text-blue-500" bg="bg-blue-500/10" />
            <StatCard title="Balance" amount="$5500" icon={<Wallet size={24} />} color="text-accent" bg="bg-accent/10" />
            <StatCard title="Earning till date" amount="$2000" icon={<ArrowUpRight size={24} />} color="text-purple-500" bg="bg-purple-500/10" />
          </div>

          <div className="flex items-center justify-end mb-8 xl:hidden">
             {!showWithdraw && (
                <button 
                  onClick={() => setShowWithdraw(true)}
                  className="px-6 py-3 rounded-xl bg-accent text-white font-poppins font-semibold text-sm shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-105 transition-all"
                >
                  Withdraw Amount
                </button>
             )}
          </div>

          {/* Recent Payments */}
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-poppins font-bold text-xl text-text-main">Recent Payments</h2>
              <button className="text-sm font-roboto text-accent hover:text-accent/80 font-medium">See All</button>
            </div>
            <div className="divide-y divide-border/50">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-accent/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${tx.type === 'Credit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      {tx.type === 'Credit' ? <ArrowDownToLine size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-main text-[15px]">{tx.userName}</p>
                      <p className="font-roboto text-text-muted text-sm mt-0.5">Payment History • {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-roboto font-bold text-[16px] ${tx.type === 'Credit' ? 'text-emerald-500' : 'text-text-main'}`}>
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
        {(showWithdraw || window.innerWidth >= 1280) && (
          <div className={`xl:w-1/3 flex flex-col ${showWithdraw && window.innerWidth < 1280 ? 'w-full' : ''}`}>
            {showWithdraw && window.innerWidth < 1280 && (
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
                    <select className="w-full bg-main-bg border border-border text-text-main text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all appearance-none">
                      <option value="" disabled selected>Select Bank</option>
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
