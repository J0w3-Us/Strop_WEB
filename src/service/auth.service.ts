// Simulated auth service (client-side only)
export async function login(email: string, password: string): Promise<string> {
  // small delay to simulate network
  await new Promise((r) => setTimeout(r, 600));

  if (!email || !password) {
    throw new Error('Por favor ingresa email y contraseña');
  }

  const user = {
    id: 1,
    name: email.split('@')[0] || 'Usuario',
    email,
    role: 'admin',
    phone: '000-000-0000',
    is_active: true,
  };

  localStorage.setItem('authToken', 'fake-jwt-' + Date.now());
  localStorage.setItem('user', JSON.stringify(user));

  return '/dashbord';
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