import React, { useState, useEffect, useMemo } from 'react';
import BitacoraItem from './BitacoraItem';
import { dataService } from '../../services/dataService';
import { activityTypeLabels } from '../../store/bitacoraStore';

/**
 * BitacoraList Component
 * Displays a filterable timeline of all system activity
 */
export default function BitacoraList({ initialProjects = [] }) {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');

    // Load activities
    useEffect(() => {
        loadActivities();
    }, [typeFilter, projectFilter, searchQuery]);

    const loadActivities = async () => {
        setIsLoading(true);
        try {
            const data = await dataService.activityLog.list({
                type: typeFilter,
                projectId: projectFilter,
                search: searchQuery
            });
            setActivities(data);
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Group activities by date
    const groupedActivities = useMemo(() => {
        const groups = {};

        activities.forEach(activity => {
            const date = new Date(activity.timestamp).toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
        });

        return groups;
    }, [activities]);

    // Stats
    const stats = useMemo(() => ({
        total: activities.length,
        today: activities.filter(a => {
            const today = new Date().toDateString();
            return new Date(a.timestamp).toDateString() === today;
        }).length
    }), [activities]);

    return (
        <div className="bitacora-container">
            {/* Stats Bar */}
            <div className="bitacora-stats">
                <div className="stat-card">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total registros</span>
                </div>
                <div className="stat-card highlight">
                    <span className="stat-value">{stats.today}</span>
                    <span className="stat-label">Hoy</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bitacora-filters">
                <div className="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar en bitácora..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los tipos</option>
                        {Object.entries(activityTypeLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    <select
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los proyectos</option>
                        {initialProjects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bitacora-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                    La bitácora es un registro inmutable de auditoría. Los registros no pueden ser modificados ni eliminados.
                </span>
            </div>

            {/* Timeline */}
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <span>Cargando registros...</span>
                </div>
            ) : activities.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3>Sin registros</h3>
                    <p>No se encontraron actividades con los filtros seleccionados.</p>
                </div>
            ) : (
                <div className="bitacora-timeline">
                    {Object.entries(groupedActivities).map(([date, items]) => (
                        <div key={date} className="date-group">
                            <div className="date-header">
                                <span className="date-label">{date}</span>
                                <span className="date-count">{items.length} {items.length === 1 ? 'registro' : 'registros'}</span>
                            </div>
                            <div className="date-items">
                                {items.map((activity, idx) => (
                                    <BitacoraItem
                                        key={activity.id}
                                        entry={activity}
                                        isLast={idx === items.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
