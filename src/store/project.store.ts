import { atom } from 'nanostores';

// Un "átomo" es una pieza de estado global.
// Guardará el ID del proyecto que el admin seleccione.
export const selectedProjectId = atom<string | null>(null);

// Función para cambiar el proyecto
export function setSelectedProject(id: string) {
  selectedProjectId.set(id);
}