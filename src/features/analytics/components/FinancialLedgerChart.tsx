
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LEDGER_DATA } from '../utils/constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-border dark:border-white/10 p-3 rounded-xl shadow-lg">
        <p className="font-poppins font-bold text-text-main mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <span className="font-roboto text-sm text-text-muted capitalize">
              {entry.name}: <span className="font-bold text-text-main">PKR {entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function FinancialLedgerChart() {
  return (
    <div className="analytics-card opacity-0 w-full bg-surface rounded-3xl border border-border p-6 shadow-sm flex flex-col h-full min-h-[350px]">
      <div className="mb-6">
        <h2 className="font-poppins font-bold text-xl text-text-main">Financial Ledger</h2>
        <p className="font-roboto text-sm text-text-muted mt-1">Fuel Savings vs Platform Commissions</p>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart
            data={LEDGER_DATA}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border dark:text-white/5" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12, fontFamily: 'Roboto' }} 
              className="text-text-muted"
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12, fontFamily: 'Roboto' }}
              className="text-text-muted"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px', fontFamily: 'Roboto', fontSize: '13px' }} 
            />
            <Bar dataKey="savings" name="Fuel Savings" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="commissions" name="Commissions" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
