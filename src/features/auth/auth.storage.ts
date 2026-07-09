const ACCESS_TOKEN_STORAGE_KEY = 'supplyhub-admin.access-token';

const isBrowser = () => typeof window !== 'undefined';

export const readStoredAccessToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const writeStoredAccessToken = (accessToken: string): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const clearStoredAccessToken = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};
