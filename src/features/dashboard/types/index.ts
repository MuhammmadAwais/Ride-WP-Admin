export interface RegionData {
  id: string;
  name: string;
  activeDrivers: number;
  ridesDispatched: number;
  description?: string;
}

export interface LiveRideLog {
  id: string;
  title: string;
  user: string;
  departure: string;
  club: string;
  discipline: 'Road' | 'Gravel' | 'MTB' | 'Trail Run' | 'Night Ride';
  distance: string;
  pace: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  status: 'Ongoing' | 'Scheduled' | 'Completed' | 'Full';
}

export interface UserFeedback {
  id: string;
  username: string;
  comment: string;
  rating: number;
  time: string;
  avatar: string;
}

export interface MapPath {
  id: string;
  name: string;
  path: string;
  isPakistan?: boolean;
}
