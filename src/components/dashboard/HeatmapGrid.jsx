
import React from 'react';
import ReactDOM from 'react-dom';
import { useStore } from '@nanostores/react';
import {
    $projects,
    $selectedProject,
    $viewMode,
    getCriticalityLevel,
    criticalityColors,
    selectProject,
    setViewMode
} from '../../store/projectsStore';

/**
 * HeatmapGrid Component
 * Visualiza proyectos en una cuadrícula con colores según criticidad
 * Incluye animaciones escalonadas
 */
export default function HeatmapGrid() {
    const projects = useStore($projects);
    const selectedProject = useStore($selectedProject);
    const viewMode = useStore($viewMode);

    return (
        <div className="heatmap-container">
            {/* Header con controles */}
            <div className="heatmap-header animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div>
                    <h3 className="heatmap-title">Mapa de Calor: Estado de Obras</h3>
                    <p className="heatmap-subtitle">
                        Visualización en tiempo real de la criticidad por proyecto.
                    </p>
                </div>

                <div className="heatmap-controls">
                    <div className="btn-toggle-group">
                        <button
                            className={`btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            Mapa
                        </button>
                        <button
                            className={`btn-toggle ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                            Lista
                        </button>
                    </div>
                </div>
            </div>

            {/* Leyenda con animación */}
            <div className="heatmap-legend animate-fade-in" style={{ animationDelay: '150ms' }}>
                <div className="legend-item">
                    <span className="legend-dot critical"></span>
                    <span>Crítico</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot warning"></span>
                    <span>Atención</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot ok"></span>
                    <span>OK</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot inactive"></span>
                    <span>Inactivo</span>
                </div>
            </div>

            {/* Grid de Proyectos con animación escalonada */}
            {viewMode === 'grid' ? (
                <div className="heatmap-grid">
                    {projects.map((project, index) => {
                        const level = getCriticalityLevel(project);
                        const colors = criticalityColors[level];
                        const isSelected = selectedProject?.id === project.id;

                        return (
                            <div
                                key={project.id}
                                className={`project-cell ${level} ${isSelected ? 'selected' : ''} card-animate`}
                                style={{
                                    backgroundColor: colors.bg,
                                    borderColor: colors.border,
                                    animationDelay: `${200 + index * 40}ms`
                                }}
                                onClick={() => selectProject(isSelected ? null : project)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="project-code" style={{ color: colors.text }}>
                                    {project.code}
                                </div>
                                <div className="project-name">{project.name}</div>

                                {project.criticalCount > 0 && (
                                    <div className="project-badge critical">
                                        {project.criticalCount}
                                    </div>
                                )}

                                <div className="project-progress">
                                    <div
                                        className="progress-bar animate-progress"
                                        style={{
                                            width: `${project.progress}%`,
                                            backgroundColor: colors.border,
                                            animationDelay: `${300 + index * 40}ms`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="heatmap-list stagger-fast">
                    {projects.map((project, index) => {
                        const level = getCriticalityLevel(project);
                        const colors = criticalityColors[level];

                        return (
                            <div
                                key={project.id}
                                className={`list-item ${level}`}
                                onClick={() => selectProject(project)}
                                style={{ animationDelay: `${200 + index * 50}ms` }}
                            >
                                <div
                                    className="list-indicator"
                                    style={{ backgroundColor: colors.border }}
                                ></div>
                                <div className="list-content">
                                    <div className="list-header">
                                        <span className="list-code" style={{ color: colors.text }}>{project.code}</span>
                                        <span className="list-name">{project.name}</span>
                                    </div>
                                    <div className="list-meta">
                                        <span>{project.location}</span>
                                        <span>•</span>
                                        <span>{project.lastActivity}</span>
                                    </div>
                                </div>
                                <div className="list-stats">
                                    {project.criticalCount > 0 && (
                                        <span className="stat critical">{project.criticalCount} críticas</span>
                                    )}
                                    <span className="stat pending">{project.pendingCount} pendientes</span>
                                </div>
                                <div className="list-progress">
                                    <span className="progress-text">{project.progress}%</span>
                                    <div className="progress-container">
                                        <div
                                            className="progress-bar animate-progress"
                                            style={{
                                                width: `${project.progress}%`,
                                                backgroundColor: colors.border,
                                                animationDelay: `${250 + index * 50}ms`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Panel de Detalle con animación */}
            {selectedProject && (
                <ProjectDetailPanel project={selectedProject} onClose={() => selectProject(null)} />
            )}
        </div>
    );
}

// Sub-componente: Panel de Detalle
function ProjectDetailPanel({ project, onClose }) {
    const level = getCriticalityLevel(project);
    const colors = criticalityColors[level];

    // Lock body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Escape key to close
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Use portal to render at document.body level for full-screen centering
    return ReactDOM.createPortal(
        <div className="project-detail-overlay" onClick={onClose}>
            <div className="project-detail-panel" onClick={(e) => e.stopPropagation()}>
                <button className="btn-close" onClick={onClose} title="Cerrar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="detail-header" style={{ borderLeftColor: colors.border }}>
                    <span className="detail-code animate-fade-in" style={{ color: colors.text }}>{project.code}</span>
                    <h3 className="detail-name animate-fade-in-up" style={{ animationDelay: '50ms' }}>{project.name}</h3>
                    <p className="detail-location animate-fade-in-up" style={{ animationDelay: '100ms' }}>{project.location}</p>
                </div>

                <div className="detail-stats-grid stagger-fast">
                    <div className="detail-stat" style={{ animationDelay: '150ms' }}>
                        <span className="stat-value text-red-600 animate-count">{project.criticalCount}</span>
                        <span className="stat-label">Críticas</span>
                    </div>
                    <div className="detail-stat" style={{ animationDelay: '200ms' }}>
                        <span className="stat-value text-yellow-600 animate-count">{project.pendingCount}</span>
                        <span className="stat-label">Pendientes</span>
                    </div>
                    <div className="detail-stat" style={{ animationDelay: '250ms' }}>
                        <span className="stat-value text-green-600 animate-count">{project.resolvedCount}</span>
                        <span className="stat-label">Resueltas</span>
                    </div>
                </div>

                <div className="detail-progress animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="progress-header">
                        <span>Progreso General</span>
                        <span className="progress-percent">{project.progress}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill animate-progress"
                            style={{ width: `${project.progress}%`, backgroundColor: colors.border, animationDelay: '400ms' }}
                        ></div>
                    </div>
                </div>

                <div className="detail-footer animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                    <span className="last-activity">Última actividad: {project.lastActivity}</span>
                    <a href={`/proyectos/${project.id}`} className="btn-link">
                        Ver Detalles Completos
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
}
