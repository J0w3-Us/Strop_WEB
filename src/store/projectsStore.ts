
// src/store/projectsStore.ts
import { atom, computed } from 'nanostores';

/**
 * Store para proyectos y su estado de criticidad
 */

// Tipos
export interface Project {
    id: string;
    name: string;
    code: string; // Código corto del proyecto (ej: "TA", "TB")
    location: string;
    status: 'active' | 'paused' | 'completed';
    criticalCount: number;    // Incidencias críticas abiertas
    pendingCount: number;     // Incidencias pendientes
    resolvedCount: number;    // Incidencias resueltas
    progress: number;         // 0-100
    lastActivity: string;     // Fecha/hora última actividad
    description?: string;
    client?: string;
    startDate?: string;
    endDate?: string;
}

export type CriticalityLevel = 'critical' | 'warning' | 'ok' | 'inactive';

// Función para determinar nivel de criticidad
export function getCriticalityLevel(project: Project): CriticalityLevel {
    if (project.status === 'paused' || project.status === 'completed') return 'inactive';
    if (project.criticalCount > 0) return 'critical';
    if (project.pendingCount > 3) return 'warning';
    return 'ok';
}

// Colores por nivel
export const criticalityColors: Record<CriticalityLevel, { bg: string; border: string; text: string }> = {
    critical: { bg: '#FEE2E2', border: '#EF4444', text: '#B91C1C' },
    warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' },
    ok: { bg: '#D1FAE5', border: '#10B981', text: '#047857' },
    inactive: { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280' },
};

// Datos Mock de Proyectos - Los conteos se calculan dinámicamente en dataService
// Estos valores son usados solo para el HeatmapGrid del dashboard
const mockProjects: Project[] = [
    {
        id: 'proj-1',
        name: 'Torre Aurora',
        code: 'TA',
        location: 'Zona Norte',
        status: 'active',
        criticalCount: 2,  // 2 incidencias críticas (inc-002, inc-006)
        pendingCount: 3,   // 3 pendientes (inc-001, inc-002, inc-006)
        resolvedCount: 1,  // 1 resuelta (inc-004)
        progress: 65,
        lastActivity: 'Hace 10 min',
        client: 'Grupo Inmobiliario Norte',
        description: 'Torre residencial de 20 pisos con amenidades premium y vista panorámica.',
        startDate: '2023-01-15',
        endDate: '2024-06-30'
    },
    {
        id: 'proj-2',
        name: 'Torre Boreal',
        code: 'TB',
        location: 'Zona Norte',
        status: 'active',
        criticalCount: 0,  // 0 incidencias críticas
        pendingCount: 1,   // 1 pendiente (inc-003)
        resolvedCount: 1,  // 1 resuelta (inc-005)
        progress: 45,
        lastActivity: 'Hace 30 min',
        client: 'Corp Boreal',
        description: 'Complejo de oficinas corporativas con certificación LEED.',
        startDate: '2023-03-01',
        endDate: '2024-12-15'
    },
    {
        id: 'proj-3',
        name: 'Residencial Centro',
        code: 'RC',
        location: 'Centro Histórico',
        status: 'active',
        criticalCount: 0,
        pendingCount: 0,
        resolvedCount: 0,
        progress: 85,
        lastActivity: 'Hace 2 horas',
        client: 'Desarrollos Centro',
        description: 'Proyecto de vivienda en el corazón de la ciudad.',
        startDate: '2023-06-01',
        endDate: '2024-08-30'
    },
];

// Stores
export const $projects = atom<Project[]>(mockProjects);
export const $selectedProject = atom<Project | null>(null);
export const $viewMode = atom<'grid' | 'list'>('grid');

// Computed: Estadísticas generales
export const $projectStats = computed($projects, (projects) => {
    const active = projects.filter(p => p.status === 'active').length;
    const critical = projects.filter(p => getCriticalityLevel(p) === 'critical').length;
    const warning = projects.filter(p => getCriticalityLevel(p) === 'warning').length;
    const ok = projects.filter(p => getCriticalityLevel(p) === 'ok').length;

    return { active, critical, warning, ok };
});

// Acciones
export function selectProject(project: Project | null) {
    $selectedProject.set(project);
}

export function setViewMode(mode: 'grid' | 'list') {
    $viewMode.set(mode);
}
