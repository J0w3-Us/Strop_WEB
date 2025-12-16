import React from 'react';
import { incidentTypeColors, incidentTypeLabels } from '../../store/incidentsStore';

/**
 * Reusable incident list item component
 * Used in both the Incidents page and can be embedded in other contexts.
 */
export function IncidentListItem({ incident, onSelect, showProject = true }) {
    const typeStyle = incidentTypeColors[incident.type] || { bg: '#f3f4f6', text: '#6b7280' };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'critical': return 'priority-critical';
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#fef3c7', text: '#92400e', label: 'Pendiente' },
            approved: { bg: '#d1fae5', text: '#065f46', label: 'Aprobada' },
            rejected: { bg: '#fee2e2', text: '#991b1b', label: 'Rechazada' },
            assigned: { bg: '#dbeafe', text: '#1e40af', label: 'Asignada' },
        };
        return styles[status] || styles.pending;
    };

    const statusStyle = getStatusBadge(incident.status);

    return (
        <div
            className="incident-list-item"
            onClick={() => onSelect?.(incident)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.(incident)}
        >
            {/* Priority indicator */}
            <div className={`priority-bar ${getPriorityClass(incident.priority)}`}></div>

            <div className="incident-content">
                <div className="incident-header">
                    <h3 className="incident-title">{incident.title}</h3>
                    <div className="incident-badges">
                        <span
                            className="badge-type"
                            style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
                        >
                            {incidentTypeLabels[incident.type]}
                        </span>
                        <span
                            className="badge-status"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                            {statusStyle.label}
                        </span>
                    </div>
                </div>

                <p className="incident-description">{incident.description}</p>

                <div className="incident-meta">
                    {showProject && (
                        <span className="meta-project">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 21h18M5 21V7l8-4 8 4v14M17 21v-8.86" />
                            </svg>
                            {incident.projectName}
                        </span>
                    )}
                    <span className="meta-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {incident.location}
                    </span>
                    <span className="meta-reporter">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        {incident.reportedBy}
                    </span>
                    <span className="meta-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {new Date(incident.reportedAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="incident-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </div>
    );
}

export default IncidentListItem;
