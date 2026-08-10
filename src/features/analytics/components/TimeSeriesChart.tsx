import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TIME_SERIES_DATA } from '../utils/constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-border dark:border-white/10 p-4 rounded-xl shadow-lg">
        <p className="font-poppins font-bold text-text-main mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-roboto text-sm text-text-muted capitalize">
              {entry.name}: <span className="font-bold text-text-main">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function TimeSeriesChart() {
  return (
    <div className="analytics-card opacity-0 w-full h-[400px] bg-surface rounded-3xl border border-border p-6 shadow-sm flex flex-col">
      <div className="mb-6">
        <h2 className="font-poppins font-bold text-xl text-text-main">Data Velocity Over Time</h2>
        <p className="font-roboto text-sm text-text-muted mt-1">Monthly Ride Bookings vs Completed Carpools</p>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart
            data={TIME_SERIES_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EB712B" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#EB712B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCarpools" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EB712B', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontFamily: 'Roboto', fontSize: '13px' }} />
            <Area 
              type="monotone" 
              dataKey="rides" 
              name="Ride Bookings" 
              stroke="#EB712B" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRides)" 
            />
            <Area 
              type="monotone" 
              dataKey="carpools" 
              name="Completed Carpools" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCarpools)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
