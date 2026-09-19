import { apiClient } from '../../infrastructure/api/apiClient';
import type { User, LoginDto, RegisterDto, AuthResponse } from './types';

const USER_STORAGE_KEY = 'aleman_cached_user';

export const authService = {
  getUser(): User | null {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const res = await apiClient<any>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (res?.user) {
      this.setUser(res.user);
    }

    return res;
  },

  async sendLoginOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>('/api/Auth/send-login-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },

  async verifyLoginOtp(data: { phoneNumber: string; code: string }): Promise<AuthResponse> {
    const res = await apiClient<any>('/api/Auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res?.user) {
      this.setUser(res.user);
    }

    return res;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await apiClient<any>('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.user) {
      this.setUser(res.user);
    }

    return res;
  },

  async getMe(): Promise<User | null> {
    try {
      const user = await apiClient<User>('/api/Users/me');
      this.setUser(user);
      return user;
    } catch {
      this.setUser(null);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient('/api/Auth/logout', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch {
      // Ignore network errors during logout
    } finally {
      this.setUser(null);
    }
  },
};
