import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DISTRIBUTION_DATA, DISTRIBUTION_COLORS } from '../utils/constants';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-border dark:border-white/10 p-3 rounded-xl shadow-lg flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
        <span className="font-poppins font-bold text-text-main text-sm">
          {data.name}: <span className="text-text-muted font-roboto ml-1">{data.value}</span>
        </span>
      </div>
    );
  }
  return null;
};

export function DistributionChart() {
  return (
    <div className="analytics-card opacity-0 w-full h-[400px] bg-surface rounded-3xl border border-border p-6 shadow-sm flex flex-col">
      <div className="mb-2">
        <h2 className="font-poppins font-bold text-xl text-text-main">Target Segments</h2>
        <p className="font-roboto text-sm text-text-muted mt-1">Distribution Breakdown</p>
      </div>
      
      <div className="flex-1 min-h-0 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DISTRIBUTION_DATA}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {DISTRIBUTION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ fontFamily: 'Roboto', fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text for Donut Chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
           <span className="font-poppins font-bold text-3xl text-text-main">1k</span>
           <span className="font-roboto text-xs text-text-muted uppercase tracking-wider">Total</span>
        </div>
      </div>
    </div>
  );
}
