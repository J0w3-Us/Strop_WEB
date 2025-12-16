import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { incidentTypeColors, incidentTypeLabels } from '../../store/incidentsStore';
import '../../styles/incident-detail.css';

const IncidentDetail = ({ incident }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const typeColor = incidentTypeColors[incident.type];

    // Status labels
    const statusLabels = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        assigned: 'Asignada'
    };

    // Activity labels
    const activityLabels = {
        created: 'Incidencia reportada',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        status_change: 'Estado actualizado'
    };

    // Format date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShortDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('es-MX', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Lightbox component with portal
    const Lightbox = ({ photo, onClose }) => {
        useEffect(() => {
            document.body.style.overflow = 'hidden';
            const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
            window.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEscape);
            };
        }, [onClose]);

        return ReactDOM.createPortal(
            <div className="photo-lightbox" onClick={onClose}>
                <button className="lightbox-close" onClick={onClose}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <img src={photo} alt="Evidencia" onClick={(e) => e.stopPropagation()} />
            </div>,
            document.body
        );
    };

    return (
        <div className={`incident-detail-container ${isLoaded ? 'loaded' : ''}`}>
            {/* Hero Section */}
            <div className={`incident-hero priority-${incident.priority} animate-slide-up`}>
                {/* Back Link */}
                <a href={`/proyectos/${incident.projectId}`} className="back-link">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al proyecto
                </a>

                {/* Title Row */}
                <div className="incident-title-row">
                    <div className="incident-title-group">
                        <h1 className="incident-title">{incident.title}</h1>
                        <div className="incident-meta-tags">
                            <span className="meta-tag">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {incident.projectName}
                            </span>
                            <span className="meta-tag">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {incident.location}
                            </span>
                            <span className={`priority-badge ${incident.priority}`}>
                                {incident.priority}
                            </span>
                        </div>
                    </div>

                    <span className={`status-badge-large ${incident.status}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            {incident.status === 'pending' && <circle cx="12" cy="12" r="10" />}
                            {incident.status === 'approved' && <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />}
                            {incident.status === 'rejected' && <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            {incident.status === 'assigned' && <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                        </svg>
                        {statusLabels[incident.status]}
                    </span>
                </div>
            </div>

            {/* Content Grid */}
            <div className="incident-content-grid">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Description */}
                    <div className="incident-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="incident-card-header">
                            <h3 className="incident-card-title">Descripción</h3>
                        </div>
                        <div className="incident-card-body">
                            <p className="incident-description-text">{incident.description}</p>
                        </div>
                    </div>

                    {/* Photo Gallery */}
                    <div className="incident-card animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="incident-card-header">
                            <h3 className="incident-card-title">
                                Evidencia Fotográfica ({incident.photos?.length || 0})
                            </h3>
                        </div>
                        <div className="incident-card-body">
                            {incident.photos && incident.photos.length > 0 ? (
                                <div className="photo-gallery">
                                    {incident.photos.map((photo, idx) => (
                                        <div
                                            key={idx}
                                            className="photo-thumbnail"
                                            onClick={() => setSelectedPhoto(photo)}
                                        >
                                            <img src={photo} alt={`Evidencia ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="photo-empty">
                                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <p>Sin fotos adjuntas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Details Card */}
                    <div className="incident-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="incident-card-header">
                            <h3 className="incident-card-title">Detalles</h3>
                        </div>
                        <div className="incident-card-body">
                            <div className="detail-item">
                                <div className="detail-label">Reportado por</div>
                                <div className="detail-value">
                                    <span className="detail-avatar">
                                        {incident.reportedBy?.charAt(0) || 'U'}
                                    </span>
                                    {incident.reportedBy}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Fecha de reporte</div>
                                <div className="detail-value">{formatDate(incident.reportedAt)}</div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Tipo de incidencia</div>
                                <div className="detail-value">
                                    <span
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: typeColor?.text || '#64748b'
                                        }}
                                    />
                                    {incidentTypeLabels[incident.type] || incident.type}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="incident-card animate-slide-up" style={{ animationDelay: '250ms' }}>
                        <div className="incident-card-header">
                            <h3 className="incident-card-title">Historial</h3>
                        </div>
                        <div className="incident-card-body">
                            <div className="activity-timeline">
                                {incident.activityLog?.map((log) => (
                                    <div key={log.id} className="activity-item">
                                        <div className={`activity-dot ${log.type}`}></div>
                                        <div className="activity-content">
                                            <div className="activity-title">
                                                {activityLabels[log.type] || log.type}
                                            </div>
                                            <div className="activity-meta">
                                                {formatShortDate(log.timestamp)} • {log.user}
                                            </div>
                                            {(log.details || log.comment) && (
                                                <div className="activity-comment">
                                                    {log.details || log.comment}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Lightbox */}
            {selectedPhoto && (
                <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
            )}
        </div>
    );
};

export default IncidentDetail;
