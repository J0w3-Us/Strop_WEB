import React, { useState, useMemo } from 'react';
import { incidentTypeColors, incidentTypeLabels } from '../../store/incidentsStore';

/**
 * ProjectIncidentsList - Versión compacta y contextualizada de incidencias
 * Diseñada específicamente para mostrarse dentro de la vista de proyecto
 */
export default function ProjectIncidentsList({ incidents, projectName }) {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIncidents = useMemo(() => {
        return incidents.filter(inc => {
            const matchesFilter = filter === 'all' ||
                (filter === 'pending' && inc.status === 'pending') ||
                (filter === 'critical' && inc.priority === 'critical') ||
                (filter === 'resolved' && (inc.status === 'approved' || inc.status === 'rejected'));

            const matchesSearch = !searchTerm ||
                inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inc.location.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [incidents, filter, searchTerm]);

    const stats = useMemo(() => ({
        total: incidents.length,
        pending: incidents.filter(i => i.status === 'pending').length,
        critical: incidents.filter(i => i.priority === 'critical').length,
        resolved: incidents.filter(i => i.status === 'approved' || i.status === 'rejected').length
    }), [incidents]);

    const getPriorityStyle = (priority) => {
        const styles = {
            critical: { bg: '#FEE2E2', border: '#EF4444', dot: '#DC2626' },
            high: { bg: '#FEF3C7', border: '#F59E0B', dot: '#D97706' },
            medium: { bg: '#FEF9C3', border: '#EAB308', dot: '#CA8A04' },
            low: { bg: '#F1F5F9', border: '#CBD5E1', dot: '#94A3B8' }
        };
        return styles[priority] || styles.low;
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Pendiente', bg: '#FEF3C7', color: '#92400E' },
            approved: { label: 'Aprobada', bg: '#D1FAE5', color: '#065F46' },
            rejected: { label: 'Rechazada', bg: '#FEE2E2', color: '#991B1B' },
            assigned: { label: 'Asignada', bg: '#DBEAFE', color: '#1E40AF' }
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Hace menos de 1 hora';
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="project-incidents-wrapper">
            {/* Quick Stats Pills */}
            <div className="incident-quick-stats">
                <button
                    className={`stat-pill ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <span className="pill-count">{stats.total}</span>
                    <span className="pill-label">Todas</span>
                </button>
                <button
                    className={`stat-pill pending ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    <span className="pill-count">{stats.pending}</span>
                    <span className="pill-label">Pendientes</span>
                </button>
                <button
                    className={`stat-pill critical ${filter === 'critical' ? 'active' : ''}`}
                    onClick={() => setFilter('critical')}
                >
                    <span className="pill-count">{stats.critical}</span>
                    <span className="pill-label">Críticas</span>
                </button>
                <button
                    className={`stat-pill resolved ${filter === 'resolved' ? 'active' : ''}`}
                    onClick={() => setFilter('resolved')}
                >
                    <span className="pill-count">{stats.resolved}</span>
                    <span className="pill-label">Resueltas</span>
                </button>
            </div>

            {/* Compact Search */}
            <div className="incident-search-compact">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por título o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Incidents List */}
            <div className="project-incidents-list">
                {filteredIncidents.length > 0 ? (
                    filteredIncidents.map((incident, index) => {
                        const priorityStyle = getPriorityStyle(incident.priority);
                        const statusBadge = getStatusBadge(incident.status);
                        const typeColor = incidentTypeColors[incident.type] || { bg: '#F3F4F6', text: '#6B7280' };

                        return (
                            <a
                                key={incident.id}
                                href={`/incidencias/${incident.id}`}
                                className="project-incident-card"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    borderLeftColor: priorityStyle.dot
                                }}
                            >
                                <div className="incident-card-main">
                                    <div className="incident-card-header">
                                        <h4 className="incident-card-title">{incident.title}</h4>
                                        <span
                                            className="incident-status-badge"
                                            style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
                                        >
                                            {statusBadge.label}
                                        </span>
                                    </div>

                                    <p className="incident-card-desc">{incident.description}</p>

                                    <div className="incident-card-meta">
                                        <span className="meta-item">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {incident.location}
                                        </span>
                                        <span className="meta-item">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {formatDate(incident.reportedAt)}
                                        </span>
                                        <span
                                            className="meta-type"
                                            style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                                        >
                                            {incidentTypeLabels[incident.type]}
                                        </span>
                                    </div>
                                </div>

                                <div className="incident-card-arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </a>
                        );
                    })
                ) : (
                    <div className="no-incidents-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4>Sin incidencias</h4>
                        <p>
                            {filter !== 'all'
                                ? 'No hay incidencias que coincidan con el filtro seleccionado.'
                                : 'Este proyecto no tiene incidencias registradas.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
