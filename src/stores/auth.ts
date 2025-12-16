// src/stores/auth.ts
import { atom, computed } from 'nanostores';

/**
 * Store de autenticación y perfil de usuario
 */

// Tipos
export type UserRole = 'owner_admin' | 'superintendent' | 'resident' | 'cabo';

export interface Profile {
    id: string;
    organization_id: string;
    full_name: string;
    email: string;
    role: UserRole;
    photo_url?: string;
    fcm_token?: string;
    created_at: string;
    updated_at: string;
}

// Mock data para desarrollo
const mockProfile: Profile = {
    id: 'user-001',
    organization_id: 'org-001',
    full_name: 'Admin User',
    email: 'admin@strop.mx',
    role: 'owner_admin',
    photo_url: undefined,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z',
};

// ==================== ATOMS ====================

// Perfil del usuario autenticado
export const $userProfile = atom<Profile | null>(mockProfile);

// Estado de carga de autenticación
export const $authLoading = atom<boolean>(false);

// ==================== COMPUTED ====================

// ¿Está autenticado?
export const $isAuthenticated = computed(
    $userProfile,
    (profile) => profile !== null
);

// ¿Es administrador?
export const $isAdmin = computed(
    $userProfile,
    (profile) => profile?.role === 'owner_admin'
);

// ¿Es manager (admin o superintendent)?
export const $isManager = computed(
    $userProfile,
    (profile) => profile?.role === 'owner_admin' || profile?.role === 'superintendent'
);

// Inicial del usuario para el avatar
export const $userInitials = computed(
    $userProfile,
    (profile) => {
        if (!profile?.full_name) return '?';
        const names = profile.full_name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0].substring(0, 2).toUpperCase();
    }
);

// ==================== ACTIONS ====================

// Establecer el perfil del usuario
export function setUserProfile(profile: Profile | null): void {
    $userProfile.set(profile);
}

// Actualizar campos del perfil
export function updateUserProfile(updates: Partial<Profile>): void {
    const current = $userProfile.get();
    if (current) {
        $userProfile.set({
            ...current,
            ...updates,
            updated_at: new Date().toISOString(),
        });
    }
}

// Limpiar autenticación (logout)
export function clearAuth(): void {
    $userProfile.set(null);
    $authLoading.set(false);
}

// ==================== HELPERS ====================

// Traduce el rol del sistema a texto legible
export function getRoleDisplay(role: UserRole | string): string {
    const roles: Record<string, string> = {
        owner_admin: 'Administrador',
        superintendent: 'Superintendente',
        resident: 'Residente',
        cabo: 'Cabo',
    };
    return roles[role] || role;
}

// Formatea la fecha de creación
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
