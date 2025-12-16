
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const { cookies, redirect, url } = context;

    // Lista de rutas protegidas
    const protectedRoutes = ['/dashboard', '/proyectos', '/incidencias', '/triage', '/bitacora'];

    // Rutas públicas (login, registro, assets, api)
    const isPublicRoute =
        url.pathname === '/login' ||
        url.pathname === '/registro' ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/_astro');

    // Verificar si la ruta actual es protegida
    const isProtected = protectedRoutes.some(route => url.pathname.startsWith(route));

    if (isProtected) {
        const accessToken = cookies.get('sb-access-token');

        // Si no hay token, redirigir al login
        if (!accessToken) {
            return redirect('/login');
        }

        // Aquí se validaría el token con Supabase en el futuro
        // const { data: { user }, error } = await supabase.auth.getUser(accessToken.value);
        // if (error) return redirect('/login');
        // context.locals.user = user;
    }

    // Redirigir de root a dashboard si está logueado, o login si no
    if (url.pathname === '/') {
        const accessToken = cookies.get('sb-access-token');
        if (accessToken) {
            return redirect('/dashboard');
        } else {
            return redirect('/login');
        }
    }

    return next();
});
