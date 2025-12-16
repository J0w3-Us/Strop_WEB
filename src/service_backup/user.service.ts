import type { User } from '../types';
import { request } from './apiClient';

export async function getAllUsers(token?: string): Promise<User[]> {
  try {
    return await request<User[]>('/users', { method: 'GET', token });
  } catch (err) {
    // Fallback local stub so UI remains functional during development
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

export async function getUserById(id: string | number, token?: string): Promise<User> {
  return await request<User>(`/users/${id}`, { method: 'GET', token });
}

export async function createUser(payload: Partial<User>, token?: string): Promise<User> {
  return await request<User>('/users', { method: 'POST', body: payload, token });
}

export async function updateUser(id: string | number, payload: Partial<User>, token?: string): Promise<User> {
  return await request<User>(`/users/${id}`, { method: 'PUT', body: payload, token });
}

export async function deleteUser(id: string | number, token?: string): Promise<void> {
  await request<void>(`/users/${id}`, { method: 'DELETE', token });
}

