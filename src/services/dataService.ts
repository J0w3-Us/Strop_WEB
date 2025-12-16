import { type Project } from '../store/projectsStore';
import { type Incident, type IncidentStatus } from '../store/incidentsStore';

// User Profile Type
export type UserRole = 'owner_admin' | 'superintendent' | 'resident' | 'cabo';

export interface UserProfile {
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

// Mock Data Delay
const MOCK_DELAY = 600;

// Mock user profile
const mockUserProfile: UserProfile = {
    id: 'user-001',
    organization_id: 'org-001',
    full_name: 'Admin User',
    email: 'admin@strop.mx',
    role: 'owner_admin',
    photo_url: undefined,
    fcm_token: undefined,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z',
};

// Simulate backend database
const MOCK_DB = {
    projects: [
        {
            id: 'proj-1',
            name: 'Torre Aurora',
            code: 'TA',
            location: 'Zona Norte',
            status: 'active',
            progress: 65,
            lastActivity: '2023-11-01T10:00:00Z',
            description: 'Torre residencial de 20 pisos.',
            client: 'Grupo Inmobiliario Norte',
            startDate: '2023-01-15',
            endDate: '2024-06-30'
        },
        {
            id: 'proj-2',
            name: 'Torre Boreal',
            code: 'TB',
            location: 'Zona Norte',
            status: 'active',
            progress: 45,
            lastActivity: '2023-11-01T09:30:00Z',
            description: 'Complejo de oficinas.',
            client: 'Corp Boreal',
            startDate: '2023-03-01',
            endDate: '2024-12-15'
        },
        // ... more mock data can be added here or imported if needed
    ] as Array<Omit<Project, 'criticalCount' | 'pendingCount' | 'resolvedCount'>>,
    incidents: [
        {
            id: 'inc-001',
            projectId: 'proj-1',
            projectName: 'Torre Aurora',
            projectCode: 'TA',
            type: 'problem',
            title: 'Fisura en muro de carga piso 5',
            description: 'Se detectó una fisura diagonal de aproximadamente 15cm en el muro principal del piso 5. Requiere evaluación estructural inmediata.',
            location: 'Piso 5, Sector A',
            reportedBy: 'Juan Pérez',
            reportedAt: '2025-12-12T10:30:00Z',
            priority: 'high',
            status: 'pending',
            photos: [
                'https://placehold.co/600x400/png?text=Fisura+1',
                'https://placehold.co/600x400/png?text=Fisura+2',
                'https://placehold.co/600x400/png?text=Plano',
            ],
            activityLog: [
                {
                    id: 'log-1',
                    type: 'created',
                    user: 'Juan Pérez',
                    timestamp: '2025-12-12T10:30:00Z',
                    details: 'Incidencia creada desde móvil'
                }
            ]
        },
        {
            id: 'inc-002',
            projectId: 'proj-1',
            projectName: 'Torre Aurora',
            projectCode: 'TA',
            type: 'safety_incident',
            title: 'Trabajador sin casco en zona de riesgo',
            description: 'Se observó a un trabajador operando maquinaria pesada sin el equipo de protección adecuado.',
            location: 'Área de excavación',
            reportedBy: 'Carlos López',
            reportedAt: '2025-12-12T09:15:00Z',
            priority: 'critical',
            status: 'pending',
            photos: [
                'https://placehold.co/600x400/png?text=Evidencia'
            ],
            activityLog: [
                {
                    id: 'log-2',
                    type: 'created',
                    user: 'Carlos López',
                    timestamp: '2025-12-12T09:15:00Z'
                }
            ]
        },
        {
            id: 'inc-003',
            projectId: 'proj-2',
            projectName: 'Torre Boreal',
            projectCode: 'TB',
            type: 'material_request',
            title: 'Falta de cemento para siguiente fase',
            description: 'El inventario de cemento está por debajo del mínimo requerido. Se necesitan 50 bultos para continuar.',
            location: 'Almacén principal',
            reportedBy: 'María García',
            reportedAt: '2025-12-11T16:20:00Z',
            priority: 'medium',
            status: 'pending',
            photos: [],
            activityLog: [
                {
                    id: 'log-3',
                    type: 'created',
                    user: 'María García',
                    timestamp: '2025-12-11T16:20:00Z'
                }
            ]
        },
        {
            id: 'inc-004',
            projectId: 'proj-1',
            projectName: 'Torre Aurora',
            projectCode: 'TA',
            type: 'progress_report',
            title: 'Avance de cimentación completado 100%',
            description: 'Se terminó la cimentación del edificio principal. Listo para continuar con la estructura.',
            location: 'Sótano nivel -2',
            reportedBy: 'Roberto Sánchez',
            reportedAt: '2025-12-10T14:00:00Z',
            priority: 'low',
            status: 'approved',
            photos: ['https://placehold.co/600x400/png?text=Cimentacion'],
            activityLog: [
                { id: 'log-4', type: 'created', user: 'Roberto Sánchez', timestamp: '2025-12-10T14:00:00Z' },
                { id: 'log-5', type: 'approved', user: 'Admin User', timestamp: '2025-12-10T16:30:00Z' }
            ]
        },
        {
            id: 'inc-005',
            projectId: 'proj-2',
            projectName: 'Torre Boreal',
            projectCode: 'TB',
            type: 'consultation',
            title: 'Consulta sobre acabados de fachada',
            description: '¿Se puede cambiar el color del recubrimiento exterior según la última revisión del cliente?',
            location: 'Fachada principal',
            reportedBy: 'Ana Martínez',
            reportedAt: '2025-12-09T11:45:00Z',
            priority: 'low',
            status: 'rejected',
            photos: [],
            activityLog: [
                { id: 'log-6', type: 'created', user: 'Ana Martínez', timestamp: '2025-12-09T11:45:00Z' },
                { id: 'log-7', type: 'rejected', user: 'Admin User', timestamp: '2025-12-09T15:00:00Z', comment: 'Fuera de alcance del proyecto actual' }
            ]
        },
        {
            id: 'inc-006',
            projectId: 'proj-1',
            projectName: 'Torre Aurora',
            projectCode: 'TA',
            type: 'problem',
            title: 'Fuga de agua en instalación hidráulica',
            description: 'Se detectó una fuga en la tubería principal del piso 3. Requiere reparación urgente.',
            location: 'Piso 3, Baño principal',
            reportedBy: 'Pedro Hernández',
            reportedAt: '2025-12-15T08:20:00Z',
            priority: 'critical',
            status: 'pending',
            photos: ['https://placehold.co/600x400/png?text=Fuga+1', 'https://placehold.co/600x400/png?text=Fuga+2'],
            activityLog: [
                { id: 'log-8', type: 'created', user: 'Pedro Hernández', timestamp: '2025-12-15T08:20:00Z' }
            ]
        },
    ] as Incident[]

};

// Helper function to compute incident stats for a project
function computeProjectStats(projectId: string): { criticalCount: number; pendingCount: number; resolvedCount: number } {
    const projectIncidents = MOCK_DB.incidents.filter(i => i.projectId === projectId);

    const criticalCount = projectIncidents.filter(i =>
        i.priority === 'critical' && (i.status === 'pending' || i.status === 'assigned')
    ).length;

    const pendingCount = projectIncidents.filter(i =>
        i.status === 'pending' || i.status === 'assigned'
    ).length;

    const resolvedCount = projectIncidents.filter(i =>
        i.status === 'approved' || i.status === 'rejected'
    ).length;

    return { criticalCount, pendingCount, resolvedCount };
}

// Helper to enrich project with computed stats
function enrichProjectWithStats(project: typeof MOCK_DB.projects[0]): Project {
    const stats = computeProjectStats(project.id);
    return {
        ...project,
        criticalCount: stats.criticalCount,
        pendingCount: stats.pendingCount,
        resolvedCount: stats.resolvedCount,
    } as Project;
}

export const dataService = {
    projects: {
        list: async (): Promise<Project[]> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Enrich each project with computed incident stats
                    const enrichedProjects = MOCK_DB.projects.map(enrichProjectWithStats);
                    resolve(enrichedProjects);
                }, MOCK_DELAY);
            });
        },

        getById: async (id: string): Promise<Project | undefined> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const project = MOCK_DB.projects.find(p => p.id === id);
                    if (project) {
                        resolve(enrichProjectWithStats(project));
                    } else {
                        resolve(undefined);
                    }
                }, MOCK_DELAY);
            });
        },

        create: async (projectData: Omit<Project, 'id' | 'criticalCount' | 'pendingCount' | 'resolvedCount' | 'progress' | 'lastActivity'>): Promise<Project> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newProject: Project = {
                        ...projectData,
                        id: `proj-${Date.now()}`,
                        criticalCount: 0,
                        pendingCount: 0,
                        resolvedCount: 0,
                        progress: 0,
                        lastActivity: new Date().toISOString(),
                    };
                    MOCK_DB.projects.push(newProject);
                    resolve(newProject);
                }, MOCK_DELAY);
            });
        },

        // Mock import feature
        importFromExcel: async (file: File): Promise<{ success: true; count: number }> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Logic to parse excel would go here.
                    // For now, we simulate a successful import of 5 projects.
                    console.log(`Importing file: ${file.name}`);
                    resolve({ success: true, count: 5 });
                }, MOCK_DELAY * 2);
            });
        }
    },
    incidents: {
        list: async (filters?: { projectId?: string; status?: IncidentStatus }): Promise<Incident[]> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let filtered = MOCK_DB.incidents;
                    if (filters?.projectId) filtered = filtered.filter(i => i.projectId === filters.projectId);
                    if (filters?.status) filtered = filtered.filter(i => i.status === filters.status);
                    resolve(filtered);
                }, MOCK_DELAY);
            });
        },

        getById: async (id: string): Promise<Incident | undefined> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const incident = MOCK_DB.incidents.find(i => i.id === id);
                    resolve(incident);
                }, MOCK_DELAY);
            });
        },

        updateStatus: async (id: string, status: IncidentStatus, comment?: string): Promise<Incident> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const incidentIndex = MOCK_DB.incidents.findIndex(i => i.id === id);
                    if (incidentIndex === -1) {
                        reject(new Error("Incident not found"));
                        return;
                    }

                    const updatedIncident = { ...MOCK_DB.incidents[incidentIndex], status };

                    // Add log entry
                    updatedIncident.activityLog = [
                        ...updatedIncident.activityLog,
                        {
                            id: `log-${Date.now()}`,
                            type: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'status_change',
                            user: 'Admin User', // Hardcoded for now
                            timestamp: new Date().toISOString(),
                            comment: comment
                        }
                    ];

                    MOCK_DB.incidents[incidentIndex] = updatedIncident;
                    resolve(updatedIncident);
                }, MOCK_DELAY);
            });
        }
    },

    // Activity Log for Bitácora
    activityLog: {
        list: async (filters?: {
            type?: string;
            projectId?: string;
            dateFrom?: string;
            dateTo?: string;
            search?: string;
        }): Promise<any[]> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Generate activity log from all incidents
                    const allActivities: any[] = [];

                    MOCK_DB.incidents.forEach(incident => {
                        incident.activityLog.forEach(log => {
                            allActivities.push({
                                id: log.id,
                                timestamp: log.timestamp,
                                type: log.type,
                                actor: {
                                    id: 'user-1',
                                    name: log.user,
                                    role: 'Residente'
                                },
                                target: {
                                    type: 'incident',
                                    id: incident.id,
                                    title: incident.title
                                },
                                project: {
                                    id: incident.projectId,
                                    name: incident.projectName,
                                    code: incident.projectCode
                                },
                                details: log.details || log.comment
                            });
                        });
                    });

                    // Add some extra mock entries for variety
                    const extraEntries = [
                        {
                            id: 'log-extra-1',
                            timestamp: '2025-12-15T14:30:00Z',
                            type: 'assigned',
                            actor: { id: 'user-admin', name: 'Admin User', role: 'Administrador' },
                            target: { type: 'incident', id: 'inc-001', title: 'Fisura en muro de carga piso 5' },
                            project: { id: 'proj-1', name: 'Torre Aurora', code: 'TA' },
                            details: 'Asignada a Pedro Hernández para supervisión'
                        },
                        {
                            id: 'log-extra-2',
                            timestamp: '2025-12-14T11:00:00Z',
                            type: 'comment',
                            actor: { id: 'user-2', name: 'Carlos López', role: 'Superintendente' },
                            target: { type: 'incident', id: 'inc-002', title: 'Trabajador sin casco en zona de riesgo' },
                            project: { id: 'proj-1', name: 'Torre Aurora', code: 'TA' },
                            details: 'Se realizó plática de seguridad con el equipo'
                        },
                        {
                            id: 'log-extra-3',
                            timestamp: '2025-12-13T09:15:00Z',
                            type: 'status_change',
                            actor: { id: 'user-admin', name: 'Admin User', role: 'Administrador' },
                            target: { type: 'incident', id: 'inc-003', title: 'Falta de cemento para siguiente fase' },
                            project: { id: 'proj-2', name: 'Torre Boreal', code: 'TB' },
                            previousValue: 'pending',
                            newValue: 'assigned',
                            details: 'En proceso de compra'
                        },
                    ];

                    allActivities.push(...extraEntries);

                    // Sort by timestamp descending
                    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    // Apply filters
                    let filtered = allActivities;

                    if (filters?.type && filters.type !== 'all') {
                        filtered = filtered.filter(a => a.type === filters.type);
                    }

                    if (filters?.projectId && filters.projectId !== 'all') {
                        filtered = filtered.filter(a => a.project?.id === filters.projectId);
                    }

                    if (filters?.search) {
                        const query = filters.search.toLowerCase();
                        filtered = filtered.filter(a =>
                            a.target.title.toLowerCase().includes(query) ||
                            a.actor.name.toLowerCase().includes(query) ||
                            a.details?.toLowerCase().includes(query)
                        );
                    }

                    resolve(filtered);
                }, MOCK_DELAY);
            });
        }
    },

    // Profile Management
    profile: {
        getProfile: async (userId: string): Promise<{
            data: UserProfile | null;
            error: { message: string } | null;
        }> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (mockUserProfile.id === userId) {
                        resolve({ data: { ...mockUserProfile }, error: null });
                    } else {
                        resolve({ data: null, error: { message: 'User not found' } });
                    }
                }, MOCK_DELAY);
            });
        },

        updateProfile: async (
            userId: string,
            updates: { full_name?: string; photo_url?: string }
        ): Promise<{
            data: UserProfile | null;
            error: { message: string } | null;
        }> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (mockUserProfile.id === userId) {
                        // Update mock data
                        Object.assign(mockUserProfile, {
                            ...updates,
                            updated_at: new Date().toISOString(),
                        });
                        resolve({ data: { ...mockUserProfile }, error: null });
                    } else {
                        resolve({ data: null, error: { message: 'User not found' } });
                    }
                }, MOCK_DELAY);
            });
        },

        getCurrentUser: (): UserProfile => {
            return { ...mockUserProfile };
        },
    },
};

