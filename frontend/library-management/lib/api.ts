export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  email: string;
  role?: string;
  userId?: string;
  username?: string;
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MIN_API_DELAY_MS = 500;
const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  email: 'email',
  username: 'username',
  userId: 'userId',
  role: 'role',
} as const;

export const getJwtPayload = (token: string) => {
  const payload = token.split('.')[1];
  if (!payload) return null;

  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
  return JSON.parse(atob(paddedPayload));
};

const buildUrl = (path: string, params?: RequestOptions['params']) => {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  const url = new URL(path, API_BASE_URL);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export const resolveAssetUrl = (path?: string | null) => {
  if (!path) return null;

  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);
    const apiBase = new URL(API_BASE_URL);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.protocol = apiBase.protocol;
      url.host = apiBase.host;
    }

    return url.toString();
  }

  return new URL(path.startsWith('/') ? path : `/${path}`, API_BASE_URL).toString();
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const startedAt = Date.now();
  const { params, headers, body, ...init } = options;
  const requestHeaders = new Headers(headers);
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const session = getAuthSession();
    if (session?.accessToken && !requestHeaders.has('Authorization')) {
      requestHeaders.set('Authorization', `Bearer ${session.accessToken}`);
    }
  }

  try {
    const response = await fetch(buildUrl(path, params), {
      ...init,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new ApiError('You are not authorized to access this resource.', response.status, data);
      }

      throw new ApiError(data?.message || response.statusText || 'Request failed', response.status, data);
    }

    return data as T;
  } finally {
    if (typeof window !== 'undefined') {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_API_DELAY_MS) {
        await delay(MIN_API_DELAY_MS - elapsed);
      }
    }
  }
};

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken) || undefined,
    email: localStorage.getItem(AUTH_STORAGE_KEYS.email) || '',
    username: localStorage.getItem(AUTH_STORAGE_KEYS.username) || undefined,
    userId: localStorage.getItem(AUTH_STORAGE_KEYS.userId) || undefined,
    role: localStorage.getItem(AUTH_STORAGE_KEYS.role) || undefined,
  };
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.email);
  localStorage.removeItem(AUTH_STORAGE_KEYS.username);
  localStorage.removeItem(AUTH_STORAGE_KEYS.userId);
  localStorage.removeItem(AUTH_STORAGE_KEYS.role);
};

export const logout = () => {
  clearAuthSession();
};

export const saveAuthSession = (accessToken: string, refreshToken: string | undefined, email: string) => {
  const payload = getJwtPayload(accessToken);
  const role = payload?.role || payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const userId = payload?.nameid || payload?.sub || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  const username = payload?.unique_name || payload?.name || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  if (refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  }
  localStorage.setItem(AUTH_STORAGE_KEYS.email, email);
  if (role) {
    localStorage.setItem(AUTH_STORAGE_KEYS.role, role);
  }
  if (userId) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userId, userId);
  }
  if (username) {
    localStorage.setItem(AUTH_STORAGE_KEYS.username, username);
  }

  return role as string | undefined;
};

export const isAdminSession = () => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const payload = getJwtPayload(token);
    const role = payload?.role || payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const expiresAt = Number(payload?.exp || 0) * 1000;

    if (!role || Date.now() >= expiresAt) {
      logout();
      return false;
    }

    localStorage.setItem(AUTH_STORAGE_KEYS.role, role);
    return role.toLowerCase() === 'admin';
  } catch {
    logout();
    return false;
  }
};
