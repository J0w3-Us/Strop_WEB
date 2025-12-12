const API_BASE = (import.meta.env.PUBLIC_API_URL as string) || 'https://api.strop.example.com/v1';

type RequestOptions = Omit<RequestInit, 'headers' | 'body'> & {
  body?: any;
  token?: string;
};

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, ...rest } = options;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

  // Try to parse JSON safely
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // not a json response
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return (text as unknown) as T;
  }

  // Mobile API uses a wrapper { success, data, message, error }
  if (json && typeof json === 'object' && 'success' in json) {
    if (!json.success) {
      const errMsg = json.error?.message || json.message || 'API error';
      const err = new Error(errMsg);
      // attach payload for debugging
      (err as any).payload = json;
      throw err;
    }
    return json.data as T;
  }

  // Fallback: return parsed JSON
  return json as T;
}

export { API_BASE, request };
