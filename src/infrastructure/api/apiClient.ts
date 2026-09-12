const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

let activeRefreshPromise: Promise<boolean> | null = null;

export async function requestRefreshToken(): Promise<boolean> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const url = `${BASE_URL}/api/Auth/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'web',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return false;
      }

      return true;
    } catch {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return false;
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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-Type': 'web',
    ...(options.headers as Record<string, string>),
  };

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  const isAuthEndpoint =
    endpoint.includes('/api/Auth/login') ||
    endpoint.includes('/api/Auth/refresh') ||
    endpoint.includes('/api/Auth/logout') ||
    endpoint.includes('/api/Auth/register');

  if (response.status === 401 && !isAuthEndpoint) {
    const refreshed = await requestRefreshToken();
    if (refreshed) {
      response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers,
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
