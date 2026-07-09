export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type LoginResponse = AuthSession;
