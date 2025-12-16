// import type { User } from '../types';
import { request } from './apiClient';

// These functions are lightweight stubs that can be replaced by real API calls.

export async function getUsersSyncStatus(token?: string): Promise<Array<{ userId: string; name: string; lastSync: string | null; online: boolean }>> {
  try {
    // Try the real API first
    return await request(`/users/sync-status`, { method: 'GET', token });
  } catch (e) {
    // Fallback mock data
    const now = Date.now();
    return [
      { userId: '1', name: 'Juan Pérez', lastSync: new Date(now - 1000 * 60 * 30).toISOString(), online: true },
      { userId: '2', name: 'Ana Torres', lastSync: new Date(now - 1000 * 60 * 60 * 5).toISOString(), online: false },
      { userId: '3', name: 'Carlos Ruiz', lastSync: new Date(now - 1000 * 60 * 60 * 25).toISOString(), online: false },
    ];
  }
}

export async function getGeoIncidents(projectId: string, token?: string): Promise<Array<{ id: string; lat: number; lon: number; severity: 'low' | 'medium' | 'high' | 'critical'; type: string }>> {
  try {
    return await request(`/projects/${projectId}/geo-incidents`, { method: 'GET', token });
  } catch (e) {
    // Mock coordinates around a center
    return [
      { id: 'inc-001', lat: 19.4326, lon: -99.1332, severity: 'critical', type: 'safetyIncident' },
      { id: 'inc-002', lat: 19.4327, lon: -99.1330, severity: 'high', type: 'materialRequest' },
      { id: 'inc-003', lat: 19.4331, lon: -99.1335, severity: 'medium', type: 'progressReport' },
    ];
  }
}

export async function getBudgetHealth(projectId: string, token?: string): Promise<Array<{ material: string; planned: number; consumed: number; alertThresholdPercent: number }>> {
  try {
    return await request(`/projects/${projectId}/budget-health`, { method: 'GET', token });
  } catch (e) {
    return [
      { material: 'Cemento', planned: 1000, consumed: 820, alertThresholdPercent: 90 },
      { material: 'Acero', planned: 5000, consumed: 4200, alertThresholdPercent: 90 },
      { material: 'Blocks', planned: 2000, consumed: 1900, alertThresholdPercent: 95 },
    ];
  }
}

export async function approveOverflow(incidentId: string, reason: string, approverId?: string, token?: string) {
  // In production this would POST to /incidents/{id}/approve-overflow
  try {
    return await request(`/incidents/${incidentId}/approve-overflow`, { method: 'POST', body: { reason, approverId }, token });
  } catch (e) {
    // Mock response
    return { success: true, id: `audit-${Date.now()}`, incidentId, reason, approverId: approverId || 'admin', createdAt: new Date().toISOString() };
  }
}

export default { getUsersSyncStatus, getGeoIncidents, getBudgetHealth, approveOverflow };
