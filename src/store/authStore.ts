
// src/store/authStore.ts
import { map } from 'nanostores';

/**
 * Estado de autenticación global compartible entre islas (React, etc.)
 */

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    organization_id: string;
}

export const $auth = map({
    isAuthenticated: false,
    user: null as User | null,
    token: null as string | null,
    isLoading: false,
    error: null as string | null,
});

/**
 * Acciones para mutar el estado de autenticación
 */
export const setAuthSuccess = (user: User, token: string) => {
    $auth.set({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        error: null
    });

    // Persistir en localStorage para el cliente (opcional, cookies es mejor para SSR)
    if (typeof window !== 'undefined') {
        localStorage.setItem('sb-access-token', token);
    }
};

export const setAuthLoading = (loading: boolean) => {
    $auth.setKey('isLoading', loading);
};

export const setAuthError = (error: string) => {
    $auth.setKey('error', error);
    $auth.setKey('isLoading', false);
};

export const logout = () => {
    $auth.set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null
    });
    if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-access-token');
        // Forzar recarga o redirección
        window.location.href = '/login';
    }
};
