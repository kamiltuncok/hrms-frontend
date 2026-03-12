// Global API Wrappers mapping to the Java backend `DataResult<T>` and `Result`

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiResult {
  success: boolean;
  message: string;
}

export interface PaginatedData<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
