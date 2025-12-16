// src/store/notificationsStore.ts
import { atom, computed } from 'nanostores';

/**
 * Store para el sistema de notificaciones
 */

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
    icon?: string;
}

// Estado inicial con notificaciones mock
const initialNotifications: Notification[] = [
    {
        id: 'notif-1',
        type: 'warning',
        title: 'Incidencia crítica detectada',
        message: 'Torre Aurora tiene 2 incidencias sin resolver hace más de 48 horas.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos
        read: false,
        link: '/proyectos/proj-1'
    },
    {
        id: 'notif-2',
        type: 'success',
        title: 'Proyecto actualizado',
        message: 'El avance de Torre Boreal se actualizó a 75%.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos
        read: false,
        link: '/proyectos/proj-2'
    },
    {
        id: 'notif-3',
        type: 'info',
        title: 'Nuevo comentario',
        message: 'Ana R. comentó en la incidencia #104.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas
        read: true,
        link: '/incidencias/inc-104'
    },
    {
        id: 'notif-4',
        type: 'error',
        title: 'Fallo en sincronización',
        message: 'No se pudo sincronizar las fotos del proyecto Residencial Centro.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas
        read: true,
    },
];

// Stores
export const $notifications = atom<Notification[]>(initialNotifications);
export const $isNotificationPanelOpen = atom<boolean>(false);

// Computed
export const $unreadCount = computed($notifications, (notifications) =>
    notifications.filter(n => !n.read).length
);

// Acciones
export function toggleNotificationPanel() {
    $isNotificationPanelOpen.set(!$isNotificationPanelOpen.get());
}

export function closeNotificationPanel() {
    $isNotificationPanelOpen.set(false);
}

export function openNotificationPanel() {
    $isNotificationPanelOpen.set(true);
}

export function markAsRead(notificationId: string) {
    const notifications = $notifications.get();
    $notifications.set(
        notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        )
    );
}

export function markAllAsRead() {
    const notifications = $notifications.get();
    $notifications.set(notifications.map(n => ({ ...n, read: true })));
}

export function removeNotification(notificationId: string) {
    const notifications = $notifications.get();
    $notifications.set(notifications.filter(n => n.id !== notificationId));
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date(),
        read: false,
    };
    $notifications.set([newNotification, ...$notifications.get()]);
}

// Helper para formatear tiempo relativo
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
}
