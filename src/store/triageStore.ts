
// src/store/triageStore.ts
import { atom, computed } from 'nanostores';

/**
 * Store para el módulo de Triage
 * Gestiona la cola de incidencias pendientes de revisión
 */

// Tipos
export interface Incident {
    id: string;
    projectId: string;
    projectName: string;
    projectCode: string;
    type: 'progress' | 'problem' | 'consultation' | 'safety' | 'material';
    title: string;
    description: string;
    location: string;
    reportedBy: string;
    reportedAt: string;
    photoUrl: string; // URL de la foto (usaremos placeholder)
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
}

export type TriageAction = 'approve' | 'reject' | 'skip';

// Datos Mock de Incidencias (solo de los 3 proyectos existentes)
const mockIncidents: Incident[] = [
    {
        id: 'inc-001',
        projectId: 'proj-1',
        projectName: 'Torre Aurora',
        projectCode: 'TA',
        type: 'problem',
        title: 'Fisura en muro de carga piso 5',
        description: 'Se detectó una fisura diagonal de aproximadamente 15cm en el muro principal del piso 5. Requiere evaluación estructural urgente.',
        location: 'Piso 5, Sector A',
        reportedBy: 'Juan Pérez',
        reportedAt: 'Hace 2 horas',
        photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        priority: 'high',
        status: 'pending',
    },
    {
        id: 'inc-002',
        projectId: 'proj-2',
        projectName: 'Torre Boreal',
        projectCode: 'TB',
        type: 'material',
        title: 'Falta de cemento para siguiente fase',
        description: 'El inventario de cemento está por debajo del mínimo requerido. Se necesitan 50 bultos para continuar con la obra.',
        location: 'Almacén principal',
        reportedBy: 'María García',
        reportedAt: 'Hace 5 horas',
        photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        priority: 'medium',
        status: 'pending',
    },
    {
        id: 'inc-003',
        projectId: 'proj-3',
        projectName: 'Residencial Centro',
        projectCode: 'RC',
        type: 'progress',
        title: 'Avance de instalación eléctrica completado',
        description: 'Se completó la instalación del cableado principal en los pisos 1-3. Listo para inspección técnica.',
        location: 'Pisos 1-3',
        reportedBy: 'Roberto Sánchez',
        reportedAt: 'Hace 1 día',
        photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
        priority: 'low',
        status: 'pending',
    },
];

// Stores
export const $triageQueue = atom<Incident[]>(mockIncidents.filter(i => i.status === 'pending'));
export const $currentIndex = atom<number>(0);
export const $processedCount = atom<number>(0);
export const $isAnimating = atom<boolean>(false);

// Computed: Incidencia actual
export const $currentIncident = computed([$triageQueue, $currentIndex], (queue, index) => {
    return queue[index] || null;
});

// Computed: Progreso
export const $triageProgress = computed([$triageQueue, $currentIndex, $processedCount], (queue, index, processed) => {
    const total = queue.length + processed;
    return {
        current: processed + 1,
        total: total,
        remaining: queue.length - index,
        percent: total > 0 ? Math.round((processed / total) * 100) : 0,
    };
});

// Acciones
export function processIncident(action: TriageAction) {
    const queue = $triageQueue.get();
    const index = $currentIndex.get();
    const incident = queue[index];

    if (!incident || $isAnimating.get()) return;

    $isAnimating.set(true);

    // Simular delay de animación
    setTimeout(() => {
        // Actualizar estado del incidente
        const newQueue = [...queue];
        newQueue[index] = { ...incident, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped' };

        // Remover del queue y avanzar
        const updatedQueue = newQueue.filter((_, i) => i !== index);
        $triageQueue.set(updatedQueue);

        // Incrementar contador si no es skip
        if (action !== 'skip') {
            $processedCount.set($processedCount.get() + 1);
        }

        // Si no quedan más, mantener index en 0
        if (updatedQueue.length === 0) {
            $currentIndex.set(0);
        }

        $isAnimating.set(false);

        console.log(`[Triage] ${action.toUpperCase()}: ${incident.title}`);
    }, 300);
}

// Colores por tipo de incidencia
export const incidentTypeColors: Record<Incident['type'], { bg: string; text: string; label: string }> = {
    progress: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Avance' },
    problem: { bg: '#FEE2E2', text: '#B91C1C', label: 'Problema' },
    consultation: { bg: '#E0E7FF', text: '#4338CA', label: 'Consulta' },
    safety: { bg: '#FEF3C7', text: '#B45309', label: 'Seguridad' },
    material: { bg: '#D1FAE5', text: '#047857', label: 'Material' },
};

// Colores por prioridad
export const priorityColors: Record<Incident['priority'], { bg: string; text: string; label: string }> = {
    low: { bg: '#F3F4F6', text: '#6B7280', label: 'Baja' },
    medium: { bg: '#FEF3C7', text: '#B45309', label: 'Media' },
    high: { bg: '#FED7AA', text: '#C2410C', label: 'Alta' },
    critical: { bg: '#FEE2E2', text: '#B91C1C', label: 'Crítica' },
};
