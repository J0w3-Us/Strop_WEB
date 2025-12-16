import React, { useState, useMemo } from 'react';
import { IncidentListItem } from './IncidentListItem';

/**
 * IncidentsList Component
 * Provides a filterable list view of incidents with search and status filters.
 * This is separate from Triage which focuses on quick approval/rejection.
 */
export default function IncidentsList({ incidents, onNavigateToDetail = null, showProjectColumn = true }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'compact'

    const handleIncidentSelect = (incident) => {
        if (onNavigateToDetail) {
            onNavigateToDetail(incident.id);
        } else {
            window.location.href = `/incidencias/${incident.id}`;
        }
    };

    // Filter and search logic
    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            // Status filter
            if (statusFilter !== 'all' && incident.status !== statusFilter) return false;

            // Priority filter
            if (priorityFilter !== 'all' && incident.priority !== priorityFilter) return false;

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    incident.title.toLowerCase().includes(query) ||
                    incident.description.toLowerCase().includes(query) ||
                    incident.projectName.toLowerCase().includes(query) ||
                    incident.reportedBy.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [incidents, searchQuery, statusFilter, priorityFilter]);

    // Stats for header
    const stats = useMemo(() => ({
        total: incidents.length,
        pending: incidents.filter(i => i.status === 'pending').length,
        critical: incidents.filter(i => i.priority === 'critical').length,
    }), [incidents]);

    return (
        <div className="incidents-list-container">
            {/* Stats Bar */}
            <div className="incidents-stats">
                <div className="stat-item">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-item pending">
                    <span className="stat-value">{stats.pending}</span>
                    <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-item critical">
                    <span className="stat-value">{stats.critical}</span>
                    <span className="stat-label">Críticas</span>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="incidents-filters">
                <div className="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar incidencias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="approved">Aprobadas</option>
                        <option value="rejected">Rechazadas</option>
                        <option value="assigned">Asignadas</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Todas las prioridades</option>
                        <option value="critical">Crítica</option>
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                    </select>
                </div>

                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="Vista lista"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'compact' ? 'active' : ''}`}
                        onClick={() => setViewMode('compact')}
                        title="Vista compacta"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Quick Action: Go to Triage */}
            {stats.pending > 0 && (
                <a href="/triage" className="triage-cta">
                    <div className="cta-content">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <div>
                            <span className="cta-title">Modo Triage</span>
                            <span className="cta-desc">Revisa {stats.pending} pendientes rápidamente</span>
                        </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </a>
            )}

            {/* Results Count */}
            <div className="results-count">
                Mostrando {filteredIncidents.length} de {incidents.length} incidencias
            </div>

            {/* List View */}
            <div className={`incidents-list ${viewMode}`}>
                {filteredIncidents.length > 0 ? (
                    filteredIncidents.map(incident => (
                        <IncidentListItem
                            key={incident.id}
                            incident={incident}
                            onSelect={handleIncidentSelect}
                            showProject={showProjectColumn}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <h3>No se encontraron incidencias</h3>
                        <p>Intenta ajustar los filtros o términos de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
