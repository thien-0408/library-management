export type ReviewResponseDto = {
  id: string;
  bookId: string;
  bookIsbn: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type ReviewSummaryDto = {
  averageRating: number;
  totalReviews: number;
};

export type CreateReviewRequestDto = {
  bookIsbn: string;
  rating: number;
  comment?: string;
};

export type ReadingListResponseDto = {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  listType: 'TO_READ' | 'FAVORITES' | 'RESEARCH_MATERIAL' | 'CUSTOM';
  itemCount: number;
  items: ReadingListItemDto[];
  createdAt: string;
};

export type ReadingListItemDto = {
  id: string;
  readingListId: string;
  bookId: string;
  bookIsbn: string;
  bookTitle: string;
  notes?: string | null;
  addedAt: string;
};

export type CreateReadingListDto = {
  name: string;
  description?: string;
  listType: 'TO_READ' | 'FAVORITES' | 'RESEARCH_MATERIAL' | 'CUSTOM';
};

export type GamificationProfileDto = {
  userId: string;
  userName: string;
  totalPoints: number;
  booksBorrowed: number;
  reviewsWritten: number;
  currentStreak: number;
  longestStreak: number;
  badges: BadgeDto[];
};

export type BadgeDto = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  earnedAt: string;
};

export type GamificationLeaderboardDto = {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  totalPoints: number;
  booksRead: number;
  badgeCount: number;
};

export type DashboardStatsResponseDto = {
  activeUsers: number;
  totalBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
  pendingBorrowRequests: number;
  waitingBookHolds: number;
  unpaidFines: number;
  unpaidFineAmount: number;
  roomReservationsToday: number;
  totalBookReviews: number;
};
