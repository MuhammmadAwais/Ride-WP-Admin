export type TabId = 'rides' | 'news' | 'leaderboard' | 'shop' | 'discount' | 'marketplace' | 'members';

// --- MOCK CLUB DATA ---
export const MOCK_CLUB_DETAILS = {
  id: '1',
  name: 'Midnight Cruisers Club',
  bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  avatarImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=200&auto=format&fit=crop',
  isVerified: true,
  creator: 'Alex Mercer',
  createdAt: 'Est. 2023',
  stats: {
    activeMembers: 1420,
    groupRuns: 345,
    revenue: '450,000'
  }
};

export const MOCK_CLUB_RIDES = [
  { 
    id: 'R1001', 
    name: 'Midnight Chase Run',
    route: 'Downtown → Neon District', 
    date: 'Oct 24, 2026', 
    time: '10:00 PM', 
    host: 'Marcus Wright', 
    joined: 14, 
    status: 'Completed',
    pace: '28 km/h',
    distance: '80 km',
    participants: 14,
    hasGpx: true
  },
  { 
    id: 'R1002', 
    name: 'Coastal Sunset Highway',
    route: 'Coastal Highway Run', 
    date: 'Oct 26, 2026', 
    time: '06:00 AM', 
    host: 'Elena Rodriguez', 
    joined: 22, 
    status: 'Completed',
    pace: '32 km/h',
    distance: '120 km',
    participants: 22,
    hasGpx: true
  },
  { 
    id: 'R1003', 
    name: 'Mountain Pass Drift',
    route: 'Mountain Pass Drift', 
    date: 'Oct 31, 2026', 
    time: '11:30 PM', 
    host: 'Takahashi Ken', 
    joined: 8, 
    status: 'Active',
    pace: '24 km/h',
    distance: '65 km',
    participants: 8,
    hasGpx: false
  },
  { 
    id: 'R1004', 
    name: 'Valley Sprint',
    route: 'Valley Sprint', 
    date: 'Nov 02, 2026', 
    time: '09:00 AM', 
    host: 'Sarah Jenkins', 
    joined: 19, 
    status: 'Active',
    pace: '30 km/h',
    distance: '95 km',
    participants: 19,
    hasGpx: true
  }
];

export const MOCK_CLUB_NEWS = [
  { id: 'N1', heading: 'Winter Gear Drop is LIVE!', content: 'Our new collection of **thermal jackets** and **gloves** is now available in the club shop. Members get a 15% discount for the first 48 hours. Grab yours before they run out!', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800', date: '2 hours ago' },
  { id: 'N2', heading: 'Upcoming Mountain Rally Registration', content: 'Prepare your vehicles for the toughest terrain yet. The annual *Peak Ascent Rally* registration opens next Friday. Make sure your profiles are updated and vehicle stats are verified by our mods.', image: null, date: '1 day ago' },
  { id: 'N3', heading: 'Partnership with AutoGlim', content: 'We are thrilled to announce a new partnership with AutoGlim detailing services. Show your digital club ID to get premium waxing at a fraction of the cost. Check the Discounts tab!', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800', date: '3 days ago' },
  { id: 'N4', heading: 'Rule Update: P2P Marketplace', content: 'Friendly reminder to all members: All transactions in the P2P Marketplace must include accurate photos of the items. Listings without proper media will be removed after 24 hours.', image: null, date: '1 week ago' },
];

export const MOCK_CLUB_LEADERBOARD = [
  { rank: 1, name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', distance: 4520, journeys: 142, points: 9850 },
  { rank: 2, name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', distance: 4100, journeys: 120, points: 8900 },
  { rank: 3, name: 'Michael Ross', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', distance: 3850, journeys: 115, points: 8120 },
  { rank: 4, name: 'Sophia Lee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', distance: 3600, journeys: 108, points: 7540 },
  { rank: 5, name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', distance: 3200, journeys: 95, points: 6890 },
];

export const MOCK_CLUB_INVENTORY = [
  { id: 'S1', name: 'Premium Racing Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300', stock: 85, price: '12,500' },
  { id: 'S2', name: 'Club Emblem Hoodie', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300', stock: 40, price: '6,800' },
  { id: 'S3', name: 'Reflective Decal Pack', image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&q=80&w=300', stock: 15, price: '1,200' },
  { id: 'S4', name: 'Carbon Fiber Keychain', image: 'https://images.unsplash.com/photo-1610993302487-6db2bf50b44b?auto=format&fit=crop&q=80&w=300', stock: 92, price: '850' },
];

export const MOCK_CLUB_DISCOUNTS = [
  { id: 'D1', brand: 'Shell Fuel Station', logo: 'https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?auto=format&fit=crop&q=80&w=150', deal: '10% OFF Premium', expiry: 'Expires in 4 Days', isActive: true },
  { id: 'D2', brand: 'AutoGlim Detailing', logo: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=150', deal: 'Free Interior Clean', expiry: 'Expires in 12 Hrs', isActive: true },
  { id: 'D3', brand: 'Pirelli Tires Hub', logo: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=150', deal: 'Buy 3 Get 1 Free', expiry: 'Expires in 2 Weeks', isActive: false },
  { id: 'D4', brand: 'Speedy Oil Change', logo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=150', deal: '20% OFF Synthetics', expiry: 'Expires in 5 Days', isActive: true },
];

export const MOCK_CLUB_MARKETPLACE = [
  { id: 'M1', product: 'Sparco Racing Seats (Pair)', price: '45,000', seller: 'Emma Watson', sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=300', status: 'Available' },
  { id: 'M2', product: 'Brembo Brake Kit', price: '28,500', seller: 'David Chen', sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', image: 'https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?auto=format&fit=crop&q=80&w=300', status: 'Sold' },
  { id: 'M3', product: 'GoPro Hero 11 Black', price: '52,000', seller: 'Michael Ross', sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', image: 'https://images.unsplash.com/photo-1521249673981-80a501c3e387?auto=format&fit=crop&q=80&w=300', status: 'Available' },
  { id: 'M4', product: 'Custom Exhaust Pipe', price: '18,000', seller: 'James Wilson', sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', image: 'https://images.unsplash.com/photo-1587399882255-b65db807e3bd?auto=format&fit=crop&q=80&w=300', status: 'Available' },
];

export const MOCK_CLUB_MEMBERS = [
  { id: 'U1', name: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', email: 'alex.m@example.com', role: 'Owner', joined: 'Jan 15, 2023' },
  { id: 'U2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', email: 'sarah.j@example.com', role: 'Mod', joined: 'Feb 22, 2023' },
  { id: 'U3', name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', email: 'david.c@example.com', role: 'Rider', joined: 'Mar 10, 2023' },
  { id: 'U4', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', email: 'emma.w@example.com', role: 'Rider', joined: 'Apr 05, 2023' },
  { id: 'U5', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100', email: 'james.w@example.com', role: 'Rider', joined: 'Jun 12, 2023' },
];
