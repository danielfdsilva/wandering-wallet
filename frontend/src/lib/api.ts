const API_URL = import.meta.env.VITE_API_URL;

export function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = { ...options.headers } as Record<string, string>;
  if (options.body && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('session_token');
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });
}
