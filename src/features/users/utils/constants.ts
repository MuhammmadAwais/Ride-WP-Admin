export interface User {
  id: string;
  profilePhoto: string;
  name: string;
  phoneNo: string;
  email: string;
  clubsJoined: number;
  subscriptionPlan: 'Silver' | 'Gold' | 'Diamond';
  startDate: string;
  endDate: string;
}

export const MOCK_USERS: User[] = [
  { id: '1', profilePhoto: '', name: 'Alexa George', phoneNo: '+92 300 1234567', email: 'alexa@gmail.com', clubsJoined: 10, subscriptionPlan: 'Silver', startDate: '20-05-2025', endDate: '18-07-2025' },
  { id: '2', profilePhoto: '', name: 'Ali Khan', phoneNo: '+92 312 9876543', email: 'alikhan@gmail.com', clubsJoined: 6, subscriptionPlan: 'Gold', startDate: '15-04-2025', endDate: '15-10-2025' },
  { id: '3', profilePhoto: '', name: 'Sara Ahmed', phoneNo: '+92 333 4567890', email: 'sara.ahmed@yahoo.com', clubsJoined: 3, subscriptionPlan: 'Diamond', startDate: '01-01-2025', endDate: '31-12-2025' },
  { id: '4', profilePhoto: '', name: 'Zainab Abbas', phoneNo: '+92 345 1122334', email: 'zainab.a@hotmail.com', clubsJoined: 9, subscriptionPlan: 'Silver', startDate: '10-06-2025', endDate: '10-09-2025' },
  { id: '5', profilePhoto: '', name: 'Bilal Saeed', phoneNo: '+92 301 5566778', email: 'bilals@gmail.com', clubsJoined: 6, subscriptionPlan: 'Gold', startDate: '22-03-2025', endDate: '22-09-2025' },
  { id: '6', profilePhoto: '', name: 'Fatima Noor', phoneNo: '+92 321 8899000', email: 'fatima.n@gmail.com', clubsJoined: 12, subscriptionPlan: 'Diamond', startDate: '05-05-2025', endDate: '05-05-2026' },
  { id: '7', profilePhoto: '', name: 'Usman Tariq', phoneNo: '+92 311 2233445', email: 'usman.tariq@outlook.com', clubsJoined: 2, subscriptionPlan: 'Silver', startDate: '12-08-2025', endDate: '12-11-2025' },
];

export interface JoinedClub {
  id: string;
  name: string;
  members: number;
  role: 'Admin' | 'Member';
  dateJoined: string;
  image: string;
  isPublic: boolean;
}

export const MOCK_JOINED_CLUBS: JoinedClub[] = [
  { id: 'c1', name: 'Islamabad Riders', members: 1000, role: 'Member', dateJoined: '12-01-2025', image: '', isPublic: true },
  { id: 'c2', name: 'Lahore Bikers', members: 850, role: 'Admin', dateJoined: '05-03-2024', image: '', isPublic: true },
  { id: 'c3', name: 'Karachi Cruisers', members: 1200, role: 'Member', dateJoined: '20-11-2024', image: '', isPublic: true },
  { id: 'c4', name: 'Northern Adventurers', members: 500, role: 'Member', dateJoined: '15-06-2025', image: '', isPublic: false },
  { id: 'c5', name: 'Peshawar Thumpers', members: 300, role: 'Member', dateJoined: '10-02-2025', image: '', isPublic: true },
];

export interface ParticipatedRide {
  id: string;
  date: string;
  time: string;
  route: string;
  clubName: string;
  role: 'Driver' | 'Passenger';
  fare: string;
  status: 'Completed' | 'Cancelled' | 'Upcoming';
  pace: string;
  distance: string;
  participants: number;
  hasGpx: boolean;
}

export const MOCK_RIDES: ParticipatedRide[] = [
  { id: 'r1', date: '25-05-2025', time: '08:00 AM', route: 'ISB → Murree', clubName: 'Islamabad Riders', role: 'Driver', fare: 'PKR 1500', status: 'Completed', pace: '28km/h', distance: '80km', participants: 10, hasGpx: true },
  { id: 'r2', date: '10-06-2025', time: '07:30 AM', route: 'LHR → ISB', clubName: 'Lahore Bikers', role: 'Passenger', fare: 'PKR 3000', status: 'Completed', pace: '100km/h', distance: '380km', participants: 4, hasGpx: false },
  { id: 'r3', date: '15-07-2025', time: '06:00 AM', route: 'ISB → Naran', clubName: 'Northern Adventurers', role: 'Driver', fare: 'PKR 5000', status: 'Upcoming', pace: '60km/h', distance: '280km', participants: 15, hasGpx: true },
  { id: 'r4', date: '01-08-2025', time: '09:00 AM', route: 'KHI → Hyderabad', clubName: 'Karachi Cruisers', role: 'Passenger', fare: 'PKR 1000', status: 'Cancelled', pace: '80km/h', distance: '160km', participants: 2, hasGpx: false },
];

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  image: string;
  condition: 'New' | 'Second Hand';
  price: string;
}

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', make: 'Honda', model: 'Civic', year: 2022, licensePlate: 'ABC-123', image: '', condition: 'Second Hand', price: '$200' },
  { id: 'v2', make: 'Yamaha', model: 'YBR 125', year: 2023, licensePlate: 'XYZ-987', image: '', condition: 'New', price: '$200' },
  { id: 'v3', make: 'Toyota', model: 'Corolla', year: 2020, licensePlate: 'LMN-456', image: '', condition: 'Second Hand', price: '$200' },
  { id: 'v4', make: 'Suzuki', model: 'GS-150', year: 2021, licensePlate: 'PQR-789', image: '', condition: 'Second Hand', price: '$200' },
  { id: 'v5', make: 'Honda', model: 'CG-125', year: 2024, licensePlate: 'JKL-012', image: '', condition: 'New', price: '$200' },
];

export interface PurchaseTransaction {
  id: string;
  dateTime: string;
  type: 'Subscription' | 'Ride Booking' | 'Top-up';
  amount: string;
  method: 'Card' | 'Easypaisa' | 'JazzCash';
  status: 'Success' | 'Pending' | 'Failed';
}

export const MOCK_PURCHASES: PurchaseTransaction[] = [
  { id: 'pt1', dateTime: '20-05-2025 10:30 AM', type: 'Subscription', amount: 'PKR 5000', method: 'Card', status: 'Success' },
  { id: 'pt2', dateTime: '15-06-2025 02:15 PM', type: 'Ride Booking', amount: 'PKR 1500', method: 'Easypaisa', status: 'Success' },
  { id: 'pt3', dateTime: '01-07-2025 09:00 AM', type: 'Top-up', amount: 'PKR 10000', method: 'JazzCash', status: 'Pending' },
  { id: 'pt4', dateTime: '10-07-2025 11:45 AM', type: 'Subscription', amount: 'PKR 8000', method: 'Card', status: 'Failed' },
];
