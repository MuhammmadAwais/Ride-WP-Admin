export type ViewState = 'compose' | 'history' | 'target-selection';

export type TargetSegment = 'All Users' | 'Specific Users';

export interface NotificationPayload {
  title: string;
  body: string;
  image?: string;
  targetSegment: TargetSegment;
  targetIds?: string[];
}

export interface NotificationHistoryItem {
  id: string;
  timestamp: string;
  targetSegment: TargetSegment;
  title: string;
  snippet: string;
  status: 'Delivered' | 'Failed';
}

export interface RecipientUser {
  id: string;
  username: string;
}
