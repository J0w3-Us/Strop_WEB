// src/components/notifications/NotificationDropdown.jsx
import React, { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import {
    $notifications,
    $isNotificationPanelOpen,
    $unreadCount,
    toggleNotificationPanel,
    closeNotificationPanel,
    markAsRead,
    markAllAsRead,
    formatTimeAgo
} from '../../store/notificationsStore';

/**
 * Dropdown de notificaciones para el Topbar
 */
export default function NotificationDropdown() {
    const notifications = useStore($notifications);
    const isOpen = useStore($isNotificationPanelOpen);
    const unreadCount = useStore($unreadCount);
    const dropdownRef = useRef(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeNotificationPanel();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                closeNotificationPanel();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            case 'success':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                );
            default: // info
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'warning': return { bg: '#FEF3C7', color: '#D97706' };
            case 'success': return { bg: '#D1FAE5', color: '#059669' };
            case 'error': return { bg: '#FEE2E2', color: '#DC2626' };
            default: return { bg: '#DBEAFE', color: '#2563EB' };
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
        closeNotificationPanel();
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Botón de notificaciones */}
            <button
                onClick={toggleNotificationPanel}
                style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isOpen ? '#E5E7EB' : '#F3F4F6',
                    color: isOpen ? '#1E293B' : '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                title="Notificaciones"
                aria-label="Notificaciones"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '10px',
                        height: '10px',
                        background: '#EF4444',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }}></span>
                )}
            </button>

            {/* Panel desplegable */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '380px',
                    maxHeight: '480px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'slideDown 0.2s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>
                                Notificaciones
                            </span>
                            {unreadCount > 0 && (
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: '#EF4444',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#2563EB',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Lista de notificaciones */}
                    <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: '#94A3B8'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', opacity: 0.5 }}>
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                <p style={{ margin: 0, fontSize: '0.875rem' }}>No tienes notificaciones</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const typeStyles = getTypeStyles(notification.type);
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '14px 20px',
                                            cursor: notification.link ? 'pointer' : 'default',
                                            background: notification.read ? 'white' : '#F8FAFC',
                                            borderBottom: '1px solid #F1F5F9',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'white' : '#F8FAFC'}
                                    >
                                        {/* Icono */}
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            background: typeStyles.bg,
                                            color: typeStyles.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Contenido */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.875rem',
                                                    fontWeight: notification.read ? 500 : 600,
                                                    color: '#1E293B',
                                                    lineHeight: 1.4
                                                }}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <span style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: '#2563EB',
                                                        flexShrink: 0,
                                                        marginTop: '5px'
                                                    }}></span>
                                                )}
                                            </div>
                                            <p style={{
                                                margin: '4px 0 0',
                                                fontSize: '0.8rem',
                                                color: '#64748B',
                                                lineHeight: 1.4
                                            }}>
                                                {notification.message}
                                            </p>
                                            <p style={{
                                                margin: '6px 0 0',
                                                fontSize: '0.7rem',
                                                color: '#94A3B8'
                                            }}>
                                                {formatTimeAgo(notification.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div style={{
                            padding: '12px 20px',
                            borderTop: '1px solid #E5E7EB',
                            textAlign: 'center'
                        }}>
                            <a
                                href="/notificaciones"
                                style={{
                                    fontSize: '0.8rem',
                                    color: '#2563EB',
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Ver todas las notificaciones
                            </a>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
