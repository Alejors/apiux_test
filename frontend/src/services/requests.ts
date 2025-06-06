const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const sentHeaders = options.headers || {};
  if (options.headers) {
    delete options.headers;
  }

  const headers = {'Content-Type': 'application/json', ...sentHeaders};

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }

  return res.status !== 204 ? await res.json() : {} as T;
}