/** User authentication session data */
export interface ISession {
  user: IAuthUser;
  accessToken: string;
  expiresAt: number; // Unix timestamp
}

/** Authenticated user minimal data stored in session */
export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  role: EUserRole;
  avatarUrl?: string;
}

/** Login form credentials */
export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Registration form data */
export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Password reset request */
export interface IForgotPasswordData {
  email: string;
}

/** Password reset with token */
export interface IResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/** Auth state used in the auth store */
export interface IAuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
}



export enum EUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum EAuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}
