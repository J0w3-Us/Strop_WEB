
import React, { useState } from 'react';

/**
 * Modal para crear/editar proyecto
 * Diseño moderno y minimalista
 */
export default function ProjectFormModal({ isOpen, onClose, project = null }) {
    const [activeTab, setActiveTab] = useState('manual');
    const isEditing = !!project;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header" style={{ position: 'relative' }}>
                    <h2>{isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                    <p>{isEditing ? 'Actualiza la información del proyecto' : 'Crea un proyecto manualmente o importa desde Excel'}</p>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Tab Toggle (solo en modo crear) */}
                    {!isEditing && (
                        <div className="tab-toggle-group">
                            <button
                                className={`tab-toggle-btn ${activeTab === 'manual' ? 'active' : ''}`}
                                onClick={() => setActiveTab('manual')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                Formulario Manual
                            </button>
                            <button
                                className={`tab-toggle-btn ${activeTab === 'import' ? 'active' : ''}`}
                                onClick={() => setActiveTab('import')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Importar Excel
                            </button>
                        </div>
                    )}

                    {activeTab === 'manual' ? (
                        <form className="project-form">
                            {/* Nombre del Proyecto */}
                            <div className="form-field">
                                <label className="form-label required">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej. Torre Aurora"
                                    defaultValue={project?.name || ''}
                                />
                            </div>

                            {/* Cliente y Código */}
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Cliente</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. Grupo Inmobiliario"
                                        defaultValue={project?.client || ''}
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Código</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. TA"
                                        defaultValue={project?.code || ''}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="form-field">
                                <label className="form-label">Ubicación</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. Zona Norte, Ciudad"
                                        defaultValue={project?.location || ''}
                                    />
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="form-label">Fecha de Inicio</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="date"
                                            className="form-input"
                                            defaultValue={project?.startDate || ''}
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Fecha Fin (Estimada)</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="date"
                                            className="form-input"
                                            defaultValue={project?.endDate || ''}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="form-field">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Breve descripción del proyecto..."
                                    defaultValue={project?.description || ''}
                                ></textarea>
                            </div>
                        </form>
                    ) : (
                        /* Dropzone para importar Excel */
                        <div className="upload-dropzone">
                            <div className="dropzone-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <p className="dropzone-text">
                                Arrastra tu archivo Excel aquí o <span className="dropzone-link">selecciona un archivo</span>
                            </p>
                            <p className="dropzone-hint">
                                Formatos soportados: .xlsx, .xls (máx. 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
                    </button>
                </div>
            </div>
        </div>
    );
}
