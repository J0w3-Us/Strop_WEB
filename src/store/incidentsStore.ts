import { atom } from 'nanostores';

export type IncidentType = 'progress_report' | 'problem' | 'consultation' | 'safety_incident' | 'material_request';
export type IncidentStatus = 'pending' | 'approved' | 'rejected' | 'assigned';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ActivityLogItem {
    id: string;
    type: 'created' | 'assigned' | 'status_change' | 'comment' | 'approved' | 'rejected';
    user: string;
    timestamp: string;
    details?: string;
    comment?: string;
}

export interface Incident {
    id: string;
    projectId: string;
    projectName: string;
    projectCode: string;
    type: IncidentType;
    title: string;
    description: string;
    location: string;
    reportedBy: string;
    reportedAt: string;
    priority: IncidentPriority;
    status: IncidentStatus;

    // Extended fields for detail view
    photos: string[];
    activityLog: ActivityLogItem[];
}

export const incidentTypeLabels: Record<IncidentType, string> = {
    progress_report: 'Reporte de Avance',
    problem: 'Problema',
    consultation: 'Consulta Técnica',
    safety_incident: 'Incidente de Seguridad',
    material_request: 'Solicitud de Material',
};

export const incidentTypeColors: Record<IncidentType, { bg: string; text: string }> = {
    progress_report: { bg: '#DBEAFE', text: '#1E40AF' },
    problem: { bg: '#FEE2E2', text: '#991B1B' },
    consultation: { bg: '#E0E7FF', text: '#3730A3' },
    safety_incident: { bg: '#FEF3C7', text: '#92400E' },
    material_request: { bg: '#D1FAE5', text: '#065F46' },
};

// Mock data store
export const $incidents = atom<Incident[]>([]);
