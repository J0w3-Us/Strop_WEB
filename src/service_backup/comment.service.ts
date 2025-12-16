import type { Comment } from '../types/index';

// Mock data: comentarios existentes por incidencia
const mockCommentsByIncident: { [incidentId: string]: Comment[] } = {
  'inc-001': [
    {
      id: 'cmt-001',
      incidentId: 'inc-001',
      authorName: 'Laura Paez',
      authorRole: 'Admin',
      content: 'Confirmado con el proveedor. La entrega será mañana a las 10:00.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isSystemMessage: false,
    },
    {
      id: 'cmt-002',
      incidentId: 'inc-001',
      authorName: 'Ricardo Gomez',
      authorRole: 'Superintendente',
      content: 'Aprobado. Coordinar recepción con el almacén.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      isSystemMessage: false,
    },
  ],
  'inc-002': [
    {
      id: 'cmt-003',
      incidentId: 'inc-002',
      authorName: 'Sistema',
      authorRole: 'Admin',
      content: 'Estado cambiado a: En Revisión',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isSystemMessage: true,
    },
  ],
  'inc-003': [
    {
      id: 'cmt-004',
      incidentId: 'inc-003',
      authorName: 'Miguel Torres',
      authorRole: 'Capataz',
      content: 'Se completó la reparación. Requiere inspección final.',
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      isSystemMessage: false,
    },
  ],
};

// Counter para generar IDs únicos
let commentIdCounter = 100;

/**
 * Obtiene los comentarios de una incidencia específica con delay simulado
 * @param incidentId - ID de la incidencia
 * @returns Promise con array de comentarios
 */
export async function getCommentsByIncidentId(
  incidentId: string
): Promise<Comment[]> {
  // Simular delay de red (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Retornar comentarios existentes o array vacío
  return mockCommentsByIncident[incidentId] || [];
}

/**
 * Crea un nuevo comentario para una incidencia
 * @param incidentId - ID de la incidencia
 * @param content - Contenido del comentario
 * @returns Promise con el comentario creado
 */
export async function postComment(
  incidentId: string,
  content: string
): Promise<Comment> {
  // Simular delay de envío (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newComment: Comment = {
    id: `cmt-${commentIdCounter++}`,
    incidentId,
    authorName: 'Admin', // En producción, viene del usuario autenticado
    authorRole: 'Admin',
    content,
    createdAt: new Date().toISOString(),
    isSystemMessage: false,
  };

  // Guardar en mock (en producción iría a una API)
  if (!mockCommentsByIncident[incidentId]) {
    mockCommentsByIncident[incidentId] = [];
  }
  mockCommentsByIncident[incidentId].push(newComment);

  return newComment;
}

/**
 * Obtiene un comentario específico por ID
 * @param commentId - ID del comentario
 * @returns Promise con el comentario o null
 */
export async function getCommentById(commentId: string): Promise<Comment | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (const comments of Object.values(mockCommentsByIncident)) {
    const found = comments.find((c) => c.id === commentId);
    if (found) return found;
  }
  return null;
}

/**
 * Elimina un comentario (solo admins en producción)
 * @param commentId - ID del comentario a eliminar
 * @returns Promise<boolean> - true si se eliminó
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  for (const key in mockCommentsByIncident) {
    const idx = mockCommentsByIncident[key].findIndex((c) => c.id === commentId);
    if (idx !== -1) {
      mockCommentsByIncident[key].splice(idx, 1);
      return true;
    }
  }
  return false;
}
