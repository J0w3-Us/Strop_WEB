
import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $dashboardStats, $recentActivity, $isLoading, refreshDashboardData } from '../../store/dashboardStore';
import HeatmapGrid from './HeatmapGrid';
import ProjectFormModal from '../projects/ProjectFormModal';
import '../../styles/heatmap.css';

/**
 * Componente principal del Dashboard con KPIs y Heatmap
 * Incluye animaciones de entrada escalonadas
 */
export default function DashboardStats() {
    const stats = useStore($dashboardStats);
    const activity = useStore($recentActivity);
    const isLoading = useStore($isLoading);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshDashboardData();
        }, 30000);
        return () => clearInterval(interval);
    }, []);


    const getActivityDotColor = (type) => {
        const colors = { new: '#3B82F6', resolved: '#10B981', alert: '#F59E0B' };
        return colors[type] || '#94A3B8';
    };

    return (
        <>
            {/* Fila 1: KPIs con animación escalonada */}
            <div className={`dash-card card-animate hover-lift ${isLoading ? 'opacity-60' : ''}`} style={{ animationDelay: '0ms' }}>
                <div className="card-header">
                    <span className="card-title">Riesgos Críticos</span>
                    <div className="card-icon-wrapper danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                </div>
                <div className="card-value animate-count" style={{ animationDelay: '200ms' }}>{stats.criticalRisks}</div>
                <div className="card-footer">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                        Atención requerida
                    </span>
                </div>
            </div>

            <div className={`dash-card card-animate hover-lift ${isLoading ? 'opacity-60' : ''}`} style={{ animationDelay: '60ms' }}>
                <a href="/triage" className="absolute inset-0 z-0" aria-label="Ir a Triage"></a>
                <div className="card-header relative z-10 pointer-events-none">
                    <span className="card-title">Triage Pendiente</span>
                    <div className="card-icon-wrapper warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                </div>
                <div className="card-value animate-count relative z-10 pointer-events-none" style={{ animationDelay: '260ms' }}>{stats.triagePending}</div>
                <div className="card-footer relative z-10 pointer-events-none">
                    <span className="text-gray-900 font-bold">+5 nuevas</span>
                    <span className="text-gray-400 text-xs ml-1">HOY</span>
                </div>
            </div>

            <div className={`dash-card card-animate hover-lift ${isLoading ? 'opacity-60' : ''}`} style={{ animationDelay: '120ms' }}>
                <a href="/proyectos" className="absolute inset-0 z-0" aria-label="Ir a Proyectos"></a>
                <div className="card-header relative z-10">
                    <span className="card-title pointer-events-none">Proyectos Activos</span>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsProjectModalOpen(true);
                            }}
                            className="btn-icon btn-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors z-20 flex items-center justify-center p-0 w-8 h-8 rounded-lg border border-blue-100"
                            title="Nuevo Proyecto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <div className="card-icon-wrapper pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18" />
                                <path d="M5 21V7l8-4 8 4v14" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="card-value animate-count relative z-10 pointer-events-none" style={{ animationDelay: '320ms' }}>{stats.activeProjects}</div>
                <div className="card-footer text-gray-400 text-xs relative z-10 pointer-events-none">
                    2 próximos a entrega
                </div>
            </div>

            {/* Fila 2: Heatmap con animación */}
            <div className="dash-card col-span-2 row-span-2 card-animate" style={{ minHeight: '400px', animationDelay: '180ms' }}>
                <HeatmapGrid />
            </div>

            {/* Columna lateral derecha */}
            <div className={`dash-card card-animate hover-lift ${isLoading ? 'opacity-60' : ''}`} style={{ animationDelay: '240ms' }}>
                <a href="/incidencias" className="absolute inset-0 z-0" aria-label="Ir a Incidencias"></a>
                <div className="card-header relative z-10 pointer-events-none">
                    <span className="card-title">Incidencias Cerradas</span>
                    <div className="card-icon-wrapper success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>
                <div className="card-value animate-count relative z-10 pointer-events-none" style={{ animationDelay: '440ms' }}>{stats.closedIncidents}</div>
                <div className="card-footer text-green-600 font-medium text-xs flex items-center gap-1 relative z-10 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    </svg>
                    {stats.closedIncidentsChange}% <span className="text-gray-400 ml-1">vs semana pasada</span>
                </div>
            </div>

            <div className="dash-card card-animate" style={{ animationDelay: '300ms' }}>
                <div className="card-header">
                    <span className="card-title">Última Actividad</span>
                    <button
                        onClick={() => refreshDashboardData()}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'transparent',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        disabled={isLoading}
                        title="Actualizar"
                    >
                        {isLoading ? (
                            <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        )}
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                    {activity.map((item) => (
                        <a
                            key={item.id}
                            href={item.link || '#'}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '10px 8px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                transition: 'background 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    marginTop: '6px',
                                    flexShrink: 0,
                                    backgroundColor: getActivityDotColor(item.type)
                                }}
                            ></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: '#374151',
                                    lineHeight: 1.4,
                                    margin: 0
                                }}>
                                    {item.title}
                                </p>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#9CA3AF',
                                    marginTop: '2px',
                                    margin: 0
                                }}>
                                    {item.user && <span style={{ color: '#6B7280' }}>{item.user}</span>}
                                    {item.user && <span style={{ margin: '0 4px' }}>·</span>}
                                    {item.timeAgo}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Modal de Nuevo Proyecto */}
            <ProjectFormModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
            />
        </>
    );
}
