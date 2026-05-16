export const TIME_SERIES_DATA = [
  { name: 'Jan', rides: 4000, carpools: 2400 },
  { name: 'Feb', rides: 3000, carpools: 1398 },
  { name: 'Mar', rides: 2000, carpools: 9800 },
  { name: 'Apr', rides: 2780, carpools: 3908 },
  { name: 'May', rides: 1890, carpools: 4800 },
  { name: 'Jun', rides: 2390, carpools: 3800 },
  { name: 'Jul', rides: 3490, carpools: 4300 },
  { name: 'Aug', rides: 4500, carpools: 5200 },
  { name: 'Sep', rides: 4200, carpools: 4800 },
  { name: 'Oct', rides: 5100, carpools: 6000 },
  { name: 'Nov', rides: 4800, carpools: 5500 },
  { name: 'Dec', rides: 6000, carpools: 7200 },
];

export const DISTRIBUTION_DATA = [
  { name: 'Solo Rides', value: 400 },
  { name: 'Joint Journeys', value: 300 },
  { name: 'Inter-City', value: 300 },
];

export const DISTRIBUTION_COLORS = ['#EB712B', '#10B981', '#3B82F6'];

export const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HEATMAP_HOURS = ['8A', '10A', '12P', '2P', '4P', '6P', '8P', '10P'];

// Generating mock heatmap data where 0 is no activity and 100 is max activity
export const HEATMAP_DATA = HEATMAP_DAYS.map((day) => ({
  day,
  data: HEATMAP_HOURS.map(() => Math.floor(Math.random() * 100)),
}));

export const LEDGER_DATA = [
  { name: 'Week 1', savings: 400, commissions: 240 },
  { name: 'Week 2', savings: 300, commissions: 139 },
  { name: 'Week 3', savings: 200, commissions: 980 },
  { name: 'Week 4', savings: 278, commissions: 390 },
];
