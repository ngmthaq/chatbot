export interface ApiResponse<T> {
  json: T;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  json: {
    pageData: T[];
    paginationData: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
  statusCode: number;
  timestamp: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
}
