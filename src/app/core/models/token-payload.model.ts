/**
 * Token Payload Model
 * Represents the decoded JWT token structure
 */
export interface TokenPayload {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
