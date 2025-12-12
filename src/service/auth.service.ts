// Simulated auth service (client-side only)
export async function login(email: string, password: string): Promise<string> {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  if (!email || !password) {
    throw new Error('Por favor ingresa email y contraseña');
  }

  try {
    const res = await fetch('/mock/users.json', { method: 'GET', credentials: 'same-origin' });
    if (!res.ok) throw new Error('No se pudo leer el mock de usuarios');
    const users = await res.json().catch(() => []);

    const match = Array.isArray(users)
      ? users.find((u: any) => (u.email === email || u.username === email) && u.password === password)
      : null;

    if (!match) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const user = {
      id: match.id ?? 1,
      name: match.name ?? (email.split('@')[0] || 'Usuario'),
      email: match.email ?? email,
      role: match.role ?? 'user',
      is_active: match.is_active ?? true,
    };

    localStorage.setItem('authToken', 'mock-jwt-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));

    return match.redirectTo || '/dashbord';
  } catch (err: any) {
    throw new Error(err?.message || 'Error interno');
  }
}

export async function register(userData: { fullName: string; email: string; password: string }): Promise<{ redirectUrl: string }> {
  await new Promise((r) => setTimeout(r, 800));
  if (!userData.fullName || !userData.email || !userData.password) {
    throw new Error('Por favor completa todos los campos');
  }
  // always succeed in simulation
  return { redirectUrl: '/login' };
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  if (typeof window !== 'undefined') window.location.replace('/login');
}