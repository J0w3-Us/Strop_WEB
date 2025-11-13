import type { User } from '../types';

export async function getAllUsers(_token?: string): Promise<User[]> {
  return [
    {
      id: 1,
      name: 'Admin Local',
      email: 'admin@local',
      role: 'admin',
      phone: '000',
      is_active: true,
    },
  ];
}
