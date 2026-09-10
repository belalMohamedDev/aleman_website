import type { User } from '../../features/auth/types';

export const TOKEN_STORAGE_KEYS = {
  TOKEN: 'aleman_auth_token',
  REFRESH_TOKEN: 'aleman_refresh_token',
  USER: 'aleman_auth_user',
} as const;

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.TOKEN, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(TOKEN_STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.USER);
  },
};
