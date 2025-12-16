

import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import ProjectIncidentsList from './ProjectIncidentsList';

/**
 * Componente de detalle de proyecto
 * Diseño moderno con Hero, Tabs y Secciones de información
 */
export default function ProjectDetail({ project }) {
    const [activeTab, setActiveTab] = useState('resumen');
    const [incidents, setIncidents] = useState([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);

    // Fetch incidents when component mounts
    useEffect(() => {
        if (project?.id) {
            setLoadingIncidents(true);
            dataService.incidents.list({ projectId: project.id })
                .then(data => setIncidents(data))
                .catch(err => console.error("Error fetching incidents:", err))
                .finally(() => setLoadingIncidents(false));
        }
    }, [project?.id]);

    // Calcular estadísticas REALES basadas en las incidencias cargadas
    const computedStats = React.useMemo(() => {
        const criticalCount = incidents.filter(i =>
            i.priority === 'critical' && (i.status === 'pending' || i.status === 'assigned')
        ).length;
        const pendingCount = incidents.filter(i =>
            i.status === 'pending' || i.status === 'assigned'
        ).length;
        const resolvedCount = incidents.filter(i =>
            i.status === 'approved' || i.status === 'rejected'
        ).length;
        const totalCount = incidents.length;

        return { criticalCount, pendingCount, resolvedCount, totalCount };
    }, [incidents]);

    if (!project) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Proyecto no encontrado</p>
            </div>
        );
    }

    const statusLabel = {
        active: 'En Ejecución',
        paused: 'En Pausa',
        completed: 'Completado'
    };

    return (
        <div className="project-detail-page">
            {/* HERO HEADER */}
            <div className="project-hero">
                <div className="hero-top">
                    <div className="hero-title-group">
                        <div className="project-avatar">
                            {project.code}
                        </div>
                        <div>
                            <h1 className="hero-title">{project.name}</h1>
                            <div className="hero-meta">
                                <span className={`status-badge ${project.status}`}>
                                    <span className="status-dot"></span>
                                    {statusLabel[project.status]}
                                </span>
                                <span className="location-tag">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {project.location}
                                </span>
                                <span className="code-tag">{project.code}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-actions">
                        <button className="btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            Editar
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="hero-stats">
                    <div className={`stat-card ${loadingIncidents ? 'loading' : computedStats.criticalCount > 0 ? 'critical' : ''}`}>
                        <div className={`stat-value ${computedStats.criticalCount > 0 ? 'critical' : ''}`}>
                            {loadingIncidents ? '...' : computedStats.criticalCount}
                        </div>
                        <div className="stat-label">Críticas</div>
                    </div>
                    <div className={`stat-card ${loadingIncidents ? 'loading' : computedStats.pendingCount > 3 ? 'warning' : ''}`}>
                        <div className={`stat-value ${computedStats.pendingCount > 3 ? 'warning' : ''}`}>
                            {loadingIncidents ? '...' : computedStats.pendingCount}
                        </div>
                        <div className="stat-label">Pendientes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value success">
                            {loadingIncidents ? '...' : computedStats.resolvedCount}
                        </div>
                        <div className="stat-label">Resueltas</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{project.progress}%</div>
                        <div className="stat-label">Avance Global</div>
                        <div className="progress-bar-horizontal">
                            <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="project-tabs">
                <button className={`tab-button ${activeTab === 'resumen' ? 'active' : ''}`} onClick={() => setActiveTab('resumen')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Resumen
                </button>
                <button className={`tab-button ${activeTab === 'incidencias' ? 'active' : ''}`} onClick={() => setActiveTab('incidencias')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Incidencias
                    <span className="tab-badge">{loadingIncidents ? '...' : computedStats.totalCount}</span>
                </button>
                <button className={`tab-button ${activeTab === 'cronograma' ? 'active' : ''}`} onClick={() => setActiveTab('cronograma')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Cronograma
                </button>
                <button className={`tab-button ${activeTab === 'equipo' ? 'active' : ''}`} onClick={() => setActiveTab('equipo')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Equipo
                </button>
            </div>

            {/* INFO SECTION (Tab Resumen) */}
            {activeTab === 'resumen' && (
                <div className="info-section">
                    <h3 className="info-section-title">Información General</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Cliente</span>
                            <span className="info-value">{project.client || 'No especificado'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Última Actividad</span>
                            <span className="info-value">{project.lastActivity}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Fecha de Inicio</span>
                            <span className="info-value">{project.startDate || 'No especificada'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Fecha Fin (Estimada)</span>
                            <span className="info-value">{project.endDate || 'No especificada'}</span>
                        </div>
                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                            <span className="info-label">Descripción</span>
                            <p className="info-value description">{project.description || 'Sin descripción disponible.'}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'incidencias' && (
                <div className="info-section">
                    <h3 className="info-section-title">Incidencias del Proyecto</h3>
                    {loadingIncidents ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <ProjectIncidentsList
                            incidents={incidents}
                            projectName={project.name}
                        />
                    )}
                </div>
            )}

            {activeTab === 'cronograma' && (
                <div className="info-section">
                    <h3 className="info-section-title">Cronograma</h3>
                    <div className="text-center py-12 text-gray-400">
                        <p>Próximamente: Vista de Gantt o timeline del proyecto</p>
                    </div>
                </div>
            )}

            {activeTab === 'equipo' && (
                <div className="info-section">
                    <h3 className="info-section-title">Equipo Asignado</h3>
                    <div className="text-center py-12 text-gray-400">
                        <p>Próximamente: Miembros del equipo y sus roles</p>
                    </div>
                </div>
            )}
        </div>
    );
}
