import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5024';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  saveTokens(await res.json());
  return true;
}

async function readErrorMessage(response: Response) {
  const fallback = response.status === 429 ? 'Trop de tentatives. Réessayez dans une minute.' : 'API error';
  const raw = await response.text();
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.message === 'string') return parsed.message;
    if (typeof parsed?.title === 'string') return parsed.title;
  } catch {
    return raw;
  }

  return fallback;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, withAuth = false): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (withAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (response.status === 401 && withAuth && (await tryRefreshToken())) {
    const retryHeaders = new Headers(init.headers || {});
    if (!retryHeaders.has('Content-Type') && !(init.body instanceof FormData)) {
      retryHeaders.set('Content-Type', 'application/json');
    }
    const token = getAccessToken();
    if (token) retryHeaders.set('Authorization', `Bearer ${token}`);
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: retryHeaders });
  }

  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  if (response.status === 204) return {} as T;
  return response.json();
}

export async function uploadFiles<T>(path: string, files: File[]): Promise<T> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const headers = new Headers();
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', headers, body: formData });
  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  return response.json();
}

export function mediaUrl(path?: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}
