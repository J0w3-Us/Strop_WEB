
// src/store/dashboardStore.ts
import { atom } from 'nanostores';

/**
 * Store para datos del Dashboard
 * Estos datos vendrían de Supabase en producción
 */

// Tipos
export interface DashboardStats {
    criticalRisks: number;
    triagePending: number;
    activeProjects: number;
    closedIncidents: number;
    closedIncidentsChange: number; // Porcentaje vs semana pasada
}

export interface ActivityItem {
    id: string;
    type: 'new' | 'resolved' | 'alert';
    title: string;
    timeAgo: string;
    user?: string;
    link?: string;
}

// Estado inicial con datos mock (coherentes con 3 proyectos)
const initialStats: DashboardStats = {
    criticalRisks: 2,      // Solo Torre Aurora tiene críticas
    triagePending: 5,      // Pendientes de los 3 proyectos
    activeProjects: 3,     // 3 proyectos activos
    closedIncidents: 40,   // Total resueltas
    closedIncidentsChange: 15,
};

const initialActivity: ActivityItem[] = [
    { id: '1', type: 'new', title: 'Nueva foto en Torre Aurora', timeAgo: 'Hace 5 min', user: 'Carlos M.', link: '/proyectos/proj-1' },
    { id: '2', type: 'resolved', title: 'Incidencia resuelta en Torre Boreal', timeAgo: 'Hace 1 hora', user: 'Ana R.', link: '/proyectos/proj-2' },
    { id: '3', type: 'alert', title: 'Alerta crítica en Torre Aurora', timeAgo: 'Hace 3 horas', user: 'Sistema', link: '/triage' },
];

// Stores
export const $dashboardStats = atom<DashboardStats>(initialStats);
export const $recentActivity = atom<ActivityItem[]>(initialActivity);
export const $isLoading = atom<boolean>(false);

// Acciones
export function refreshDashboardData() {
    $isLoading.set(true);

    // Simular carga de datos
    setTimeout(() => {
        // En producción, aquí haríamos fetch a Supabase
        // Por ahora solo actualizamos con datos ligeramente diferentes para demostrar dinamismo
        $dashboardStats.set({
            criticalRisks: Math.floor(Math.random() * 5) + 1,
            triagePending: Math.floor(Math.random() * 15) + 5,
            activeProjects: 8,
            closedIncidents: Math.floor(Math.random() * 10) + 20,
            closedIncidentsChange: Math.floor(Math.random() * 20) + 5,
        });
        $isLoading.set(false);
    }, 500);
}
