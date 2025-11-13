export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'users';
    phone: string;
    is_active: boolean;
}

export type user = User;

export interface Project {
    id: string;
    name: string;
    status: 'active' | 'archived';
    start_date: string; // ISO Date String
    end_date: string; // ISO Date String
    budget: number;
}

export type project = Project;

export interface Incident {
    id: string;
    project_id: string;
    created_by: string;
    assigned_to?: string;
    title: string;
    description: string;
    type:
        | 'safetyIncident'
        | 'problem'
        | 'progressReport'
        | 'consultation'
        | 'materialRequest';
    status: 'open' | 'assigned' | 'closed';
    is_critical: boolean;
    created_at: string; // ISO Date String
}
