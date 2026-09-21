/**
 * @fileoverview TypeScript interfaces and types for Club Management API slice.
 * Mirrors the response schemas from Admin.postman_collection (1).json for Club Management.
 */

export interface ClubOwner {
  id: number;
  fullName: string;
  email: string;
}

export interface ClubListItem {
  id: number;
  clubName: string;
  logo: string | null;
  coverImage: string | null;
  location: string;
  clubPrivacyName: string;
  clubTypeName: string;
  participantCount: number;
  isSuspended?: boolean;
  createdAt: string;
  owner: ClubOwner;
}

export interface ClubListResponse {
  clubs: ClubListItem[];
  pagination?: {
    total?: number;
    offset: number;
    limit: number;
  };
}

export interface ClubProfile {
  id: number;
  clubName: string;
  logo: string | null;
  coverImage: string | null;
  location: string;
  description?: string;
  clubPrivacyName: string;
  clubTypeName: string;
  currency?: string;
  isSuspended?: boolean;
  createdAt: string;
  owner: ClubOwner;
}

export interface ClubStats {
  activeMembers: number;
  groupRuns: number;
  revenue: number;
}

export interface ClubRide {
  id: number;
  rideName: string;
  date: string;
  time: string;
  meetingPoint: string;
  endingPoint: string | null;
  pace: string | null;
  distance: string | null;
  participantsCount: number;
}

export interface ClubMember {
  id: number;
  userId?: number;
  name?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  avatar?: string | null;
  profileImage?: string | null;
  profilePhoto?: string | null;
  role?: string;
  joinedDate?: string;
  createdAt?: string;
  phone?: string | null;
  status?: string;
  isSuspended?: boolean;
  user?: {
    id?: number;
    fullName?: string;
    userName?: string;
    email?: string;
    profileImage?: string | null;
    phone?: string | null;
    role?: string;
    isAthleteProfile?: number | boolean;
    createdAt?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubLeaderboardItem {
  id?: number;
  rank?: number;
  name?: string;
  fullName?: string;
  userName?: string;
  avatar?: string | null;
  profileImage?: string | null;
  totalDistance?: string | number | null;
  totalKm?: string | number | null;
  distance?: string | number | null;
  ridesCount?: number;
  totalRides?: number;
  attendance?: string | number;
  points?: number;
  team?: string;
  role?: string;
  status?: string;
  user?: {
    id?: number;
    fullName?: string;
    username?: string;
    profileImage?: string | null;
    totalDistance?: string | number;
    ridesCount?: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubNewsItem {
  id: number;
  title?: string;
  content?: string;
  description?: string;
  image?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  authorName?: string;
  author?: {
    id?: number;
    fullName?: string;
    profileImage?: string | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubShopItem {
  id: number;
  name?: string;
  productName?: string;
  image?: string | null;
  price?: number | string;
  stock?: number;
  description?: string;
  category?: string;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubDiscountItem {
  id: number;
  brand?: string;
  title?: string;
  deal?: string;
  code?: string;
  discountPercentage?: number | string;
  logo?: string | null;
  expiry?: string;
  expiryDate?: string;
  isActive?: boolean;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubMarketplaceItem {
  id: number;
  product?: string;
  productName?: string;
  image?: string | null;
  price?: number | string;
  condition?: string;
  status?: string;
  isActive?: boolean;
  isSoldOut?: boolean;
  seller?: string;
  sellerName?: string;
  sellerAvatar?: string | null;
  sellerId?: number;
  createdAt?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ClubDetailResponse {
  profile?: ClubProfile;
  stats?: ClubStats;
  rides?: ClubRide[];
  news?: ClubNewsItem[];
  leaderboard?: ClubLeaderboardItem[];
  shop?: ClubShopItem[];
  discounts?: ClubDiscountItem[];
  marketplace?: ClubMarketplaceItem[];
  members?: ClubMember[];
  pagination?: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface GetClubsListRequest {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface GetClubByIdRequest {
  clubId: number;
  tab?: string;
  limit?: number;
  offset?: number;
}

export interface SuspendClubRequest {
  clubId: number;
  isSuspended: boolean;
}

export interface DeleteClubRequest {
  clubId: number;
}

export interface ClubApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
