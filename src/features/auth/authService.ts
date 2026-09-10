import { apiClient } from '../../infrastructure/api/apiClient';
import { tokenStorage } from '../../infrastructure/auth/tokenStorage';
import type { User, LoginDto, RegisterDto, AuthResponse } from './types';

export const authService = {
  getToken(): string | null {
    return tokenStorage.getToken();
  },

  getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken();
  },

  getUser(): User | null {
    return tokenStorage.getUser();
  },

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const res = await apiClient<any>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token = res.accessToken || res.token;
    if (token) {
      tokenStorage.setToken(token);
    }
    if (res.refreshToken) {
      tokenStorage.setRefreshToken(res.refreshToken);
    }
    if (res.user) {
      tokenStorage.setUser(res.user);
    }

    return res;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await apiClient<any>('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const token = res.accessToken || res.token;
    if (token) {
      tokenStorage.setToken(token);
    }
    if (res.refreshToken) {
      tokenStorage.setRefreshToken(res.refreshToken);
    }
    if (res.user) {
      tokenStorage.setUser(res.user);
    }

    return res;
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const user = await apiClient<User>('/api/Users/me');
      tokenStorage.setUser(user);
      return user;
    } catch {
      return this.getUser();
    }
  },

  logout(): void {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      apiClient('/api/Auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    tokenStorage.clear();
  },
};
