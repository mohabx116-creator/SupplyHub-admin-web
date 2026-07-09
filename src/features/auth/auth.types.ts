export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyId: string | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type LoginResponse = AuthSession;

export type CurrentUserResponse = AuthUser;

export type AuthStatus = 'anonymous' | 'authenticated' | 'loading';
