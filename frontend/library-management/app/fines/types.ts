export type FineStatus = 'UNPAID' | 'PAID' | 'WAIVED' | string;

export interface FineItem {
  id: string;
  borrowBookRequestId: string;
  userId: string;
  userName: string;
  bookTitle: string;
  bookIsbn: string;
  overdueDays: number;
  amount: number;
  status: FineStatus;
  createdAt: string;
  resolvedAt?: string | null;
}
