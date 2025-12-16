import { atom } from 'nanostores';

/**
 * Store para el módulo de Bitácora (Activity Log)
 * Registro inmutable de todas las acciones del sistema
 */

export type ActivityType = 'created' | 'assigned' | 'status_change' | 'comment' | 'approved' | 'rejected';

export interface ActivityLogEntry {
    id: string;
    timestamp: string;
    type: ActivityType;
    actor: {
        id: string;
        name: string;
        role: string;
    };
    target: {
        type: 'incident' | 'project';
        id: string;
        title: string;
    };
    project?: {
        id: string;
        name: string;
        code: string;
    };
    details?: string;
    previousValue?: string;
    newValue?: string;
}

// Labels for activity types
export const activityTypeLabels: Record<ActivityType, string> = {
    created: 'Incidencia creada',
    assigned: 'Asignada',
    status_change: 'Cambio de estado',
    comment: 'Comentario agregado',
    approved: 'Aprobada',
    rejected: 'Rechazada',
};

// Colors/icons for activity types
export const activityTypeStyles: Record<ActivityType, { color: string; bg: string; icon: string }> = {
    created: { color: '#3b82f6', bg: '#dbeafe', icon: 'plus' },
    assigned: { color: '#8b5cf6', bg: '#ede9fe', icon: 'user' },
    status_change: { color: '#f59e0b', bg: '#fef3c7', icon: 'refresh' },
    comment: { color: '#6b7280', bg: '#f3f4f6', icon: 'chat' },
    approved: { color: '#10b981', bg: '#d1fae5', icon: 'check' },
    rejected: { color: '#ef4444', bg: '#fee2e2', icon: 'x' },
};

// Store
export const $activityLog = atom<ActivityLogEntry[]>([]);
export const $isLoading = atom<boolean>(false);
