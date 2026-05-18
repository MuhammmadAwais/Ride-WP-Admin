import { type NotificationHistoryItem, type RecipientUser } from '../types';

export const MOCK_NOTIFICATION_HISTORY: NotificationHistoryItem[] = [
  {
    id: 'notif-1',
    timestamp: '2026-05-18 10:00 AM',
    targetSegment: 'All Users',
    title: 'System Maintenance',
    snippet: 'Servers will be down for 2 hours tonight...',
    status: 'Delivered'
  },
  {
    id: 'notif-2',
    timestamp: '2026-05-17 03:30 PM',
    targetSegment: 'Specific Users',
    title: 'Account Warning',
    snippet: 'Multiple failed login attempts detected...',
    status: 'Delivered'
  },
  {
    id: 'notif-3',
    timestamp: '2026-05-16 09:15 AM',
    targetSegment: 'All Users',
    title: 'Welcome to Version 2.0',
    snippet: 'Check out the new features in our latest...',
    status: 'Failed'
  }
];

export const MOCK_RECIPIENT_USERS: RecipientUser[] = [
  { id: 'usr-1', username: 'Alex Mercer' },
  { id: 'usr-2', username: 'Sarah Jenkins' },
  { id: 'usr-3', username: 'David Chen' },
  { id: 'usr-4', username: 'Emma Watson' },
  { id: 'usr-5', username: 'James Wilson' },
  { id: 'usr-6', username: 'Michael Ross' },
  { id: 'usr-7', username: 'Sophia Lee' },
  { id: 'usr-8', username: 'Elena Rodriguez' },
];
