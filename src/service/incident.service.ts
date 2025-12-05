// Mock data aligned with the mobile IncidentModel (covers 5 types)
import type { Incident } from '../types';

// 1. Simulación de Fetch (GET)
export const getIncidents = async (): Promise<Incident[]> => {
  // Simulamos delay de red
  await new Promise(resolve => setTimeout(resolve, 50));

  return [
    {
      id: 'inc-001',
      projectId: 'p-1',
      type: 'materialRequest',
      title: 'Solicitud de Cemento Gris',
      description: 'Se requiere material urgente para colado de losa en Zona Norte.',
      authorName: 'Ing. Juan Pérez',
      authorRole: 'superintendent',
      status: 'open',
      approvalStatus: 'pending', // ESTADO CLAVE: Habilita botones
      isCritical: false,
      createdAt: new Date().toISOString(),
      hasPhotos: false,
      materialDetails: {
        itemName: 'Cemento Cruz Azul',
        quantity: 50,
        unit: 'bultos',
        justification: 'Colado losa nivel 4'
      }
    },
    {
      id: 'inc-002',
      projectId: 'p-1',
      type: 'safetyIncident',
      title: 'Personal sin casco en altura',
      description: 'Se detectó cuadrilla de pintura trabajando en andamio sin EPP completo.',
      authorName: 'Carlos Ruiz',
      authorRole: 'cabo',
      status: 'open',
      approvalStatus: 'assigned',
      isCritical: true, // ESTADO CLAVE: Alerta visual
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      hasPhotos: true,
      gpsLocation: '19.4326,-99.1332'
    },
    {
      id: 'inc-003',
      projectId: 'p-1',
      type: 'progressReport',
      title: 'Avance de Muros Perimetrales',
      description: 'Terminada la barda colindante sur. Iniciando aplanados.',
      authorName: 'Arq. Ana López',
      authorRole: 'resident',
      status: 'closed',
      isCritical: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      hasPhotos: true
    }
  ];
};

// 2. Simulación de Acción (POST/PUT)
export const updateIncidentStatus = async (id: string, status: 'approved' | 'rejected') => {
    console.log(`[API] Actualizando incidencia ${id} a estado: ${status}`);
    // Aquí iría el fetch real a tu backend
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return { success: true, newStatus: status };
};
