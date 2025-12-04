import type { User } from '../types';

const API_BASE = (import.meta.env.PUBLIC_API_URL as string) || '/api';

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch (err) {
    throw new Error('Invalid JSON from server');
  }
}

export async function getAllUsers(token?: string): Promise<User[]> {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error(`GET /users failed: ${res.status}`);
    return await safeJson<User[]>(res);
  } catch (err) {
    // Fallback to local stub so UI can work offline
    return [
      {
        id: 1,
        name: 'Carlos Rivera',
        email: 'carlos@strop.com',
        role: 'superintendent',
        phone: '+34 600 111 222',
        is_active: true,
      },
      {
        id: 2,
        name: 'Ana Torres',
        email: 'ana@strop.com',
        role: 'resident',
        phone: '+34 600 333 444',
        is_active: true,
      },
      {
        id: 3,
        name: 'Pedro Gómez',
        email: 'pedro@strop.com',
        role: 'cabo',
        phone: '+34 600 555 666',
        is_active: true,
      },
      {
        id: 4,
        name: 'María López',
        email: 'maria@strop.com',
        role: 'owner',
        phone: '+34 600 777 888',
        is_active: true,
      },
    ];
  }
}

export async function getUserById(id: number, token?: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`GET /users/${id} failed: ${res.status}`);
  return await safeJson<User>(res);
}

export async function createUser(payload: Partial<User>, token?: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST /users failed: ${res.status}`);
  return await safeJson<User>(res);
}

export async function updateUser(id: number, payload: Partial<User>, token?: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT /users/${id} failed: ${res.status}`);
  return await safeJson<User>(res);
}

export async function deleteUser(id: number, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`DELETE /users/${id} failed: ${res.status}`);
}

