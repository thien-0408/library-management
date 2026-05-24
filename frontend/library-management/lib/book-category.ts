export const BOOK_CATEGORIES = [
  'GENERAL',
  'FICTION',
  'NON_FICTION',
  'SCIENCE',
  'HISTORY',
  'TECHNOLOGY',
  'EDUCATION',
  'UNCATEGORIZED',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
export type BookCategoryFilter = 'ALL' | BookCategory;

export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
  GENERAL: 'General',
  FICTION: 'Fiction',
  NON_FICTION: 'Non-fiction',
  SCIENCE: 'Science',
  HISTORY: 'History',
  TECHNOLOGY: 'Technology',
  EDUCATION: 'Education',
  UNCATEGORIZED: 'Uncategorized',
};

export const BOOK_CATEGORY_OPTIONS = BOOK_CATEGORIES.map((value) => ({
  value,
  label: BOOK_CATEGORY_LABELS[value],
}));

export const BOOK_CATEGORY_FILTER_OPTIONS: Array<{
  value: BookCategoryFilter;
  label: string;
}> = [
  { value: 'ALL', label: 'All Books' },
  ...BOOK_CATEGORY_OPTIONS,
];

export const getBookCategoryLabel = (category: BookCategory) =>
  BOOK_CATEGORY_LABELS[category];

export const normalizeBookCategory = (value?: string | null): BookCategory => {
  if (!value) return 'UNCATEGORIZED';
  const normalized = value.toUpperCase() as BookCategory;
  return BOOK_CATEGORIES.includes(normalized) ? normalized : 'UNCATEGORIZED';
};
