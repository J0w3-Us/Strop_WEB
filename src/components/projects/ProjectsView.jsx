
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $projects } from '../../store/projectsStore';
import ProjectFormModal from './ProjectFormModal';

export default function ProjectsView() {
    const projects = useStore($projects);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Simular tiempo de carga inicial para animaciones
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleMenuAction = (action, project, e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveMenu(null);

        switch (action) {
            case 'view':
                window.location.href = `/proyectos/${project.id}`;
                break;
            case 'edit':
                setEditingProject(project);
                setIsModalOpen(true);
                break;
            case 'duplicate':
                console.log('Duplicar:', project.name);
                break;
            case 'pause':
                console.log('Pausar:', project.name);
                break;
            case 'archive':
                console.log('Archivar:', project.name);
                break;
            case 'delete':
                if (confirm(`¿Estás seguro de eliminar "${project.name}"? Esta acción no se puede deshacer.`)) {
                    console.log('Eliminar:', project.name);
                }
                break;
        }
    };

    return (
        <div className={`projects-container ${isLoaded ? 'loaded' : ''}`}>
            {/* Toolbar con animación de entrada */}
            <div className="projects-toolbar animate-fade-in-down" style={{ animationDelay: '0ms' }}>
                <div className="search-wrapper">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar proyectos por nombre, código o cliente..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="toolbar-actions">
                    <div className="filter-wrapper">
                        <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="paused">Pausados</option>
                            <option value="completed">Completados</option>
                        </select>
                        <svg className="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    <button className="btn-create-project" onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Nuevo Proyecto</span>
                    </button>
                </div>
            </div>

            {/* Grid con animación escalonada */}
            <div className="projects-grid">
                {filteredProjects.map((project, index) => (
                    <div
                        key={project.id}
                        className="project-card card-animate hover-lift"
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <div className="card-top">
                            <span className="project-code-badge">{project.code}</span>

                            <div className="menu-container">
                                <button
                                    className="project-menu-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveMenu(activeMenu === project.id ? null : project.id);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="5" r="1"></circle>
                                        <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                </button>

                                {activeMenu === project.id && (
                                    <div className="dropdown-menu">
                                        <button className="menu-item" onClick={(e) => handleMenuAction('view', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            Ver Detalles
                                        </button>
                                        <button className="menu-item" onClick={(e) => handleMenuAction('edit', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                            </svg>
                                            Editar Proyecto
                                        </button>
                                        <button className="menu-item" onClick={(e) => handleMenuAction('duplicate', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </svg>
                                            Duplicar
                                        </button>

                                        <div className="menu-divider"></div>

                                        <button className="menu-item" onClick={(e) => handleMenuAction('pause', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                {project.status === 'paused' ? (
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                ) : (
                                                    <>
                                                        <rect x="6" y="4" width="4" height="16" />
                                                        <rect x="14" y="4" width="4" height="16" />
                                                    </>
                                                )}
                                            </svg>
                                            {project.status === 'paused' ? 'Reanudar' : 'Pausar'}
                                        </button>
                                        <button className="menu-item" onClick={(e) => handleMenuAction('archive', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="21 8 21 21 3 21 3 8" />
                                                <rect x="1" y="3" width="22" height="5" />
                                                <line x1="10" y1="12" x2="14" y2="12" />
                                            </svg>
                                            Archivar
                                        </button>

                                        <div className="menu-divider"></div>

                                        <button className="menu-item danger" onClick={(e) => handleMenuAction('delete', project, e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <a href={`/proyectos/${project.id}`} className="card-link">
                            <div className="card-content">
                                <h3 className="project-title">{project.name}</h3>
                                {project.client && <span className="project-client">{project.client}</span>}
                                <p className="project-desc">
                                    {project.description || "Sin descripción disponible."}
                                </p>
                            </div>

                            <div className="card-stats">
                                <div className="stat-item">
                                    <span className={`stat-val animate-count ${project.criticalCount > 0 ? 'critical' : ''}`}>
                                        {project.criticalCount}
                                    </span>
                                    <span className="stat-label">Críticas</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-val animate-count pending">{project.pendingCount}</span>
                                    <span className="stat-label">Pendientes</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-val animate-count success">{project.resolvedCount}</span>
                                    <span className="stat-label">Cerradas</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="status-indicator">
                                    <span className={`status-dot ${project.status}`}></span>
                                    <span className="status-text">
                                        {project.status === 'active' ? 'En Ejecución' :
                                            project.status === 'paused' ? 'En Pausa' : 'Terminado'}
                                    </span>
                                </div>

                                <span className="progress-text">{project.progress}%</span>
                            </div>
                        </a>

                        <div className="card-progress-bar">
                            <div
                                className="progress-fill animate-progress"
                                style={{
                                    width: `${project.progress}%`,
                                    background: project.status === 'active' ? '#10B981' :
                                        project.status === 'paused' ? '#F59E0B' : '#64748B',
                                    animationDelay: `${index * 60 + 200}ms`
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="empty-state animate-fade-in-up">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4 8 4v14" />
                    </svg>
                    <p>No se encontraron proyectos que coincidan con la búsqueda.</p>
                </div>
            )}

            <ProjectFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
                project={editingProject}
            />
        </div>
    );
}
