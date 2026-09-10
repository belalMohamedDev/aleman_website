import { tokenStorage } from '../auth/tokenStorage';

const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

let activeRefreshPromise: Promise<string | null> | null = null;

async function requestRefreshToken(): Promise<string | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    const accessToken = tokenStorage.getToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return null;
    }

    try {
      const url = `${BASE_URL}/api/Auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken || '',
          refreshToken,
        }),
      });

      if (!response.ok) {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken;

      if (newAccessToken) {
        tokenStorage.setToken(newAccessToken);
      }
      if (newRefreshToken) {
        tokenStorage.setRefreshToken(newRefreshToken);
      }
      if (data.user) {
        tokenStorage.setUser(data.user);
      }

      return newAccessToken || null;
    } catch {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return null;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response = await fetch(url, {
    ...options,
    headers,
  });

  const isAuthEndpoint =
    endpoint.includes('/api/Auth/login') ||
    endpoint.includes('/api/Auth/refresh') ||
    endpoint.includes('/api/Auth/logout');

  if (response.status === 401 && !isAuthEndpoint) {
    const newToken = await requestRefreshToken();
    if (newToken) {
      const retryHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  if (!response.ok) {
    let errorData: any;
    const textData = await response.text();
    try {
      errorData = textData ? JSON.parse(textData) : {};
    } catch {
      errorData = textData;
    }

    const message =
      errorData?.message || errorData?.title || `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, errorData);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
