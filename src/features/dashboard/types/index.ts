export interface RegionData {
  id: string;
  name: string;
  activeDrivers: number;
  ridesDispatched: number;
  description?: string;
}

export interface LiveRideLog {
  id: string;
  user: string;
  departure: string;
  club: string;
  status: 'Ongoing' | 'Completed' | 'Pending';
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
