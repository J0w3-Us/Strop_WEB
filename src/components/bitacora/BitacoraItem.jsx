import React from 'react';
import { activityTypeLabels, activityTypeStyles } from '../../store/bitacoraStore';

/**
 * Individual activity log item component
 * Displays a single entry in the bitácora timeline
 */
const BitacoraItem = ({ entry, isLast = false }) => {
    const style = activityTypeStyles[entry.type] || activityTypeStyles.status_change;
    const label = activityTypeLabels[entry.type] || entry.type;

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render icon based on type
    const renderIcon = () => {
        switch (entry.type) {
            case 'created':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />;
            case 'approved':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />;
            case 'rejected':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />;
            case 'assigned':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
            case 'comment':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
            default:
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
        }
    };

    return (
        <div className="bitacora-item">
            {/* Timeline connector */}
            <div className="timeline-connector">
                <div
                    className="timeline-dot"
                    style={{ backgroundColor: style.bg, borderColor: style.color }}
                >
                    <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke={style.color}
                        viewBox="0 0 24 24"
                    >
                        {renderIcon()}
                    </svg>
                </div>
                {!isLast && <div className="timeline-line"></div>}
            </div>

            {/* Content */}
            <div className="bitacora-content">
                <div className="bitacora-header">
                    <span
                        className="activity-type-badge"
                        style={{ backgroundColor: style.bg, color: style.color }}
                    >
                        {label}
                    </span>
                    <span className="activity-time">{formatTime(entry.timestamp)}</span>
                </div>

                <div className="bitacora-body">
                    <a
                        href={`/incidencias/${entry.target.id}`}
                        className="target-link"
                    >
                        {entry.target.title}
                    </a>

                    {entry.details && (
                        <p className="activity-details">{entry.details}</p>
                    )}

                    <div className="activity-meta">
                        <span className="meta-actor">
                            <span className="actor-avatar">
                                {entry.actor.name.charAt(0)}
                            </span>
                            {entry.actor.name}
                            <span className="actor-role">({entry.actor.role})</span>
                        </span>

                        {entry.project && (
                            <a
                                href={`/proyectos/${entry.project.id}`}
                                className="meta-project"
                            >
                                <span className="project-code">{entry.project.code}</span>
                                {entry.project.name}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitacoraItem;
