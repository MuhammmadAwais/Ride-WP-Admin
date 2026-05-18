import { type MapPath, type LiveRideLog, type UserFeedback } from '../types';

export const MOCK_LIVE_RIDES: LiveRideLog[] = [
  {
    id: 'RD-8902',
    user: 'Muhammad Awais',
    departure: 'Margalla Foothills Loop',
    club: 'Islamabad Auto Enthusiasts',
    status: 'Ongoing'
  },
  {
    id: 'RD-8899',
    user: 'Hamza Khan',
    departure: 'Karachi Seaview Coastal',
    club: 'Sindh Track Rangers',
    status: 'Ongoing'
  },
  {
    id: 'RD-8895',
    user: 'Zainab Bibi',
    departure: 'Lahore Ring Trail Loop',
    club: 'Punjab Speedway Stars',
    status: 'Completed'
  },
  {
    id: 'RD-8891',
    user: 'Ali Jan',
    departure: 'Khunjerab Border Pass Run',
    club: 'Northern Peaks Club',
    status: 'Completed'
  },
  {
    id: 'RD-8887',
    user: 'Fatima Shah',
    departure: 'Gwadar Hammerhead Highway',
    club: 'Balochistan Auto Club',
    status: 'Pending'
  }
];

export const MOCK_FEEDBACK: UserFeedback[] = [
  {
    id: 'fb-1',
    username: 'Raza Jafar',
    comment: 'The Margalla road coordination coordinates were spot on! Real-time syncing is absolute genius.',
    rating: 5,
    time: '2 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  {
    id: 'fb-2',
    username: 'Ayesha Malik',
    comment: 'Awesome app layout! Perfect map panners. Love the new flat matte widgets.',
    rating: 5,
    time: '15 mins ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 'fb-3',
    username: 'Sikandar Lodhi',
    comment: 'Great group tracking accuracy on the northern valleys. Very light on battery.',
    rating: 4,
    time: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  }
];

export interface MapHubHotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  users: string;
}

export const MOCK_MAP_HOTSPOTS: MapHubHotspot[] = [
  { id: 'hub-usa', name: 'United States Hub', x: 220, y: 260, users: '1,420 Users' },
  { id: 'hub-brazil', name: 'Brazil Hub', x: 265, y: 460, users: '580 Users' },
  { id: 'hub-saudi', name: 'Saudi Arabia Hub', x: 585, y: 330, users: '980 Users' },
  { id: 'hub-russia', name: 'Russia Hub', x: 685, y: 150, users: '320 Users' },
  { id: 'hub-china', name: 'China Hub', x: 790, y: 280, users: '1,850 Users' }
];

// Clean, ultra-lightweight World GeoJSON coordinate layout for high-performance panners
export const MOCK_MAP_PATHS: MapPath[] = [
  {
    id: 'world-canada',
    name: 'Canada',
    path: 'M 60,100 L 180,60 L 330,100 L 300,210 L 140,220 Z'
  },
  {
    id: 'world-usa',
    name: 'United States',
    path: 'M 140,220 L 300,210 L 290,300 L 140,320 Z'
  },
  {
    id: 'world-mexico',
    name: 'Mexico',
    path: 'M 140,320 L 200,320 L 190,380 L 150,380 Z'
  },
  {
    id: 'world-greenland',
    name: 'Greenland',
    path: 'M 320,50 L 400,30 L 380,110 L 330,100 Z'
  },
  {
    id: 'world-brazil',
    name: 'Brazil',
    path: 'M 200,380 L 280,380 L 330,460 L 270,570 L 200,450 Z'
  },
  {
    id: 'world-argentina',
    name: 'Argentina',
    path: 'M 200,450 L 270,570 L 240,590 L 210,590 L 190,520 Z'
  },
  {
    id: 'world-russia',
    name: 'Russia',
    path: 'M 450,80 L 650,50 L 920,80 L 890,220 L 680,240 L 480,250 Z'
  },
  {
    id: 'world-china',
    name: 'China',
    path: 'M 680,240 L 890,220 L 850,330 L 710,330 Z'
  },
  {
    id: 'world-india',
    name: 'India',
    path: 'M 640,300 L 710,330 L 690,390 L 660,390 Z'
  },
  {
    id: 'world-saudi',
    name: 'Saudi Arabia',
    path: 'M 560,280 L 640,300 L 620,380 L 550,380 L 530,320 Z'
  },
  {
    id: 'world-europe',
    name: 'Europe',
    path: 'M 390,120 L 480,110 L 560,200 L 480,250 L 410,230 Z'
  },
  {
    id: 'world-north-africa',
    name: 'North Africa',
    path: 'M 410,250 L 560,200 L 580,340 L 430,340 Z'
  },
  {
    id: 'world-west-africa',
    name: 'West Africa',
    path: 'M 380,300 L 430,340 L 470,410 L 410,410 Z'
  },
  {
    id: 'world-south-africa',
    name: 'South Africa',
    path: 'M 430,340 L 580,340 L 540,540 L 470,540 Z'
  },
  {
    id: 'world-australia',
    name: 'Australia',
    path: 'M 780,430 L 900,440 L 880,520 L 790,510 Z'
  },
  {
    id: 'world-nz',
    name: 'New Zealand',
    path: 'M 900,530 L 930,530 L 920,570 L 890,560 Z'
  },
  {
    id: 'world-japan',
    name: 'Japan',
    path: 'M 880,180 L 900,180 L 890,230 L 870,230 Z'
  },
  {
    id: 'world-indonesia',
    name: 'Indonesia',
    path: 'M 760,400 L 840,410 L 820,440 L 750,430 Z'
  },
  {
    id: 'world-madagascar',
    name: 'Madagascar',
    path: 'M 570,450 L 590,450 L 580,510 L 560,500 Z'
  }
];
