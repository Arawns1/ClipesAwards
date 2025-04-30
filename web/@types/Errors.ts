export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  name?: string;
  errorId?: string;
  requestId?: string;
  action?: string;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}
