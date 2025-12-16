// src/components/topbar/TopbarActions.jsx
import React from 'react';
import NotificationDropdown from '../notifications/NotificationDropdown';

/**
 * Componente de acciones del Topbar (React para interactividad)
 * Incluye: Búsqueda, Notificaciones, Perfil de Usuario
 */
export default function TopbarActions() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
            {/* Búsqueda */}
            <button
                onClick={() => {
                    // TODO: Implementar Command Palette / Búsqueda
                    console.log('Abrir búsqueda');
                }}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#F3F4F6',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                title="Buscar (Ctrl+K)"
                aria-label="Buscar"
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E5E7EB';
                    e.currentTarget.style.color = '#1E293B';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F3F4F6';
                    e.currentTarget.style.color = '#64748B';
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>

            {/* Notificaciones (componente completo) */}
            <NotificationDropdown />

            {/* Divisor */}
            <div style={{
                width: '1px',
                height: '32px',
                background: '#E5E7EB'
            }}></div>

            {/* Perfil de Usuario */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    // TODO: Implementar menú de usuario
                    console.log('Abrir menú de usuario');
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    lineHeight: 1.3
                }}>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1E293B'
                    }}>Admin User</span>
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#94A3B8',
                        letterSpacing: '0.05em'
                    }}>OWNER</span>
                </div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <svg style={{ color: '#94A3B8' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
}
