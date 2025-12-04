// src/types/index.ts

// --- ROLES (Espejo de UserEntity.dart) ---
export type UserRole = 'superadmin' | 'owner' | 'superintendent' | 'resident' | 'cabo';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    is_active: boolean;
    lastSync?: string; // ISO Date para auditoría de conectividad
}

export type user = User;

// --- PROYECTO (Espejo de ProjectModel.dart) ---
// NOTA: Se eliminó 'budget' y 'type' porque no existen en móvil.
export interface Project {
    id: string;
    name: string;
    clientName: string;       // Requerido por móvil
    address: string;          // Dirección física (Calle/Número)
    location: string;         // Ciudad/Estado
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    startDate: string;
    estimatedEndDate: string;
    progress: number;         // Float 0.0 - 1.0
    
    // Jerarquía (Para ProjectTeamScreen)
    superintendentId?: string;
    residentIds?: string[];
    
    // KPIs Calculados (Para Smart Feed)
    openIncidents: number;
    pendingApprovals: number; 
    teamCount: number;
}

export type project = Project;

// --- INCIDENCIA (Espejo de IncidentModel.dart) ---
export type IncidentType = 'safetyIncident' | 'problem' | 'progressReport' | 'consultation' | 'materialRequest';
export type IncidentStatus = 'open' | 'closed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'assigned';

export interface Incident {
    id: string;
    projectId: string;
    type: IncidentType;
    title: string;
    description: string;
    authorName: string;
    authorRole: UserRole; // Vital para saber si es Cabo o Jefe
    status: IncidentStatus;
    approvalStatus?: ApprovalStatus; // CRÍTICO para Materiales
    isCritical: boolean;
    createdAt: string;
    
    // Payload específico para Solicitudes de Material
    materialDetails?: {
        itemName: string;
        quantity: number;
        unit: string;
        justification: string;
    };
    
    hasPhotos: boolean;
    gpsLocation?: string;
}

// --- COMENTARIOS (Espejo de IncidentComments) ---
export interface Comment {
    id: string;
    incidentId: string;
    authorName: string;
    content: string;
    createdAt: string;
    isSystemMessage?: boolean;
}

