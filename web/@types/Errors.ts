export interface ApiError {
  name: string;
  message: string;
  statusCode: number;
  errorId?: string;
  requestId?: string;
  action?: string;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}
