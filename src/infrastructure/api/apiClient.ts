import { decryptPayload, createRequestSignature } from '../security/encryption';

const RAW_BASE_URL = (import.meta.env.VITE_API_URL as string) || '';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export function resolveApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // In browser environment, always use relative URLs so all requests route through
  // Vite proxy (dev) or Vercel rewrites (prod) without leaking backend hostname to DevTools
  if (typeof window !== 'undefined') {
    return cleanEndpoint;
  }

  if (!BASE_URL) {
    return cleanEndpoint;
  }
  if (BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${BASE_URL}${cleanEndpoint.slice(4)}`;
  }
  return `${BASE_URL}${cleanEndpoint}`;
}

export function resolveMediaUrl(path?: string | null): string {
  if (!path) return '/hero_farm_bg.webp';

  // If path contains /images/, always normalize to relative /images/...
  // This automatically strips ANY backend domain (runasp, custom server, etc.)
  const imagesIndex = path.indexOf('/images/');
  if (imagesIndex !== -1) {
    return path.slice(imagesIndex);
  }

  // If path contains /uploads/, always normalize to relative /uploads/...
  const uploadsIndex = path.indexOf('/uploads/');
  if (uploadsIndex !== -1) {
    return path.slice(uploadsIndex);
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

let activeRefreshPromise: Promise<boolean> | null = null;

export async function requestRefreshToken(): Promise<boolean> {
  const hasCachedSession =
    typeof window !== 'undefined' &&
    !!localStorage.getItem('aleman_cached_user');

  if (!hasCachedSession) {
    return false;
  }

  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const url = resolveApiUrl('/api/Auth/refresh');
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
        localStorage.removeItem('aleman_cached_user');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem('aleman_cached_user');
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
  const { timestamp, signature } = await createRequestSignature();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-Type': 'web',
    'X-Encrypted-Response': '1',
    'X-App-Time': timestamp,
    'X-App-Signature': signature,
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = resolveApiUrl(endpoint);

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

  const hasCachedSession =
    typeof window !== 'undefined' &&
    !!localStorage.getItem('aleman_cached_user');

  if (response.status === 401 && !isAuthEndpoint && hasCachedSession) {
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

  const data = await response.json();
  if (data && typeof data === 'object' && data.encrypted && data.payload) {
    return (await decryptPayload<T>(data.payload));
  }

  return data as T;
}
