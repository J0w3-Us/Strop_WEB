
import React, { useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import {
    $currentIncident,
    $triageProgress,
    $triageQueue,
    $isAnimating,
    processIncident,
    incidentTypeColors,
    priorityColors,
} from '../../store/triageStore';

/**
 * TriageCard Component
 * Tarjeta principal para revisar incidencias con acciones rápidas
 */
export default function TriageCard() {
    const incident = useStore($currentIncident);
    const progress = useStore($triageProgress);
    const queue = useStore($triageQueue);
    const isAnimating = useStore($isAnimating);

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (isAnimating || !incident) return;

        switch (e.key.toLowerCase()) {
            case 'a':
            case 'arrowright':
                processIncident('approve');
                break;
            case 'r':
            case 'arrowleft':
                processIncident('reject');
                break;
            case 's':
            case 'arrowdown':
                processIncident('skip');
                break;
        }
    }, [incident, isAnimating]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Estado vacío
    if (queue.length === 0) {
        return (
            <div className="triage-empty">
                <div className="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <h2 className="empty-title">¡Todo al día!</h2>
                <p className="empty-text">No hay incidencias pendientes de revisión.</p>
                <a href="/dashboard" className="btn-primary">
                    Volver al Dashboard
                </a>
            </div>
        );
    }

    if (!incident) return null;

    const typeColor = incidentTypeColors[incident.type];
    const priorityColor = priorityColors[incident.priority];

    return (
        <div className="triage-wrapper">
            {/* Progress Header */}
            <div className="triage-progress">
                <div className="progress-info">
                    <span className="progress-count">
                        {progress.remaining} pendientes
                    </span>
                    <span className="progress-hint">
                        Usa <kbd>A</kbd> aprobar • <kbd>R</kbd> rechazar • <kbd>S</kbd> saltar
                    </span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress.percent}%` }}
                    ></div>
                </div>
            </div>

            {/* Main Card */}
            <div className={`triage-card ${isAnimating ? 'animating' : ''}`}>
                {/* Photo */}
                <div className="triage-photo">
                    <img
                        src={incident.photoUrl}
                        alt={incident.title}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Sin+Foto';
                        }}
                    />

                    {/* Badges */}
                    <div className="triage-badges">
                        <span
                            className="badge-type"
                            style={{ background: typeColor.bg, color: typeColor.text }}
                        >
                            {typeColor.label}
                        </span>
                        <span
                            className="badge-priority"
                            style={{ background: priorityColor.bg, color: priorityColor.text }}
                        >
                            {priorityColor.label}
                        </span>
                    </div>

                    {/* Project Tag */}
                    <div className="triage-project-tag">
                        <span className="project-code">{incident.projectCode}</span>
                        <span className="project-name">{incident.projectName}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="triage-content">
                    <h2 className="triage-title">{incident.title}</h2>
                    <p className="triage-description">{incident.description}</p>

                    <div className="triage-meta">
                        <div className="meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{incident.location}</span>
                        </div>
                        <div className="meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>{incident.reportedBy}</span>
                        </div>
                        <div className="meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{incident.reportedAt}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="triage-actions">
                    <button
                        className="action-btn reject"
                        onClick={() => processIncident('reject')}
                        disabled={isAnimating}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span>Rechazar</span>
                    </button>

                    <button
                        className="action-btn skip"
                        onClick={() => processIncident('skip')}
                        disabled={isAnimating}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="13 17 18 12 13 7" />
                            <polyline points="6 17 11 12 6 7" />
                        </svg>
                        <span>Saltar</span>
                    </button>

                    <button
                        className="action-btn approve"
                        onClick={() => processIncident('approve')}
                        disabled={isAnimating}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Aprobar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
