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
  createdAt: string;
  owner: ClubOwner;
}

export interface ClubStats {
  activeMembers: number;
  groupRuns: number;
  revenue: number;
}

export interface ClubDetailResponse {
  profile: ClubProfile;
  stats: ClubStats;
  members?: unknown[];
  activities?: unknown[];
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
