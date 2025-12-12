import type { APIRoute } from 'astro';

// Ensure this API route is server-rendered (not statically prerendered)
export const prerender = false;

export const get: APIRoute = async () => {
  return new Response('POST to this endpoint with form data (username,password).', {
    status: 405,
    headers: { 'Content-Type': 'text/plain' },
  });
};

export const post: APIRoute = async ({ request }) => {
  try {
    console.log('[api/auth/login] POST received');
    const form = await request.formData();
    // Log form keys for debugging (avoid logging passwords in real apps)
    const keys = [];
    for (const k of form.keys()) keys.push(k);
    console.log('[api/auth/login] form keys:', keys);
    const username = String(form.get('username') ?? '');
    const password = String(form.get('password') ?? '');

    // Simple mock authentication for local testing
    if (username === 'admin' && password === 'admin') {
      return new Response(JSON.stringify({ redirectTo: '/dashbord' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Usuario o contraseña incorrectos', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    console.error('[api/auth/login] error', err);
    return new Response('Error interno', { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
};

export const options: APIRoute = async () => {
  // Respond to preflight if the browser issues one; keep it simple for local dev
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
