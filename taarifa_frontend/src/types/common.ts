export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export type SortDirection = 'ASC' | 'DESC';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}