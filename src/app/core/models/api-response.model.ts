/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data?: T;
  error?: string;
}
