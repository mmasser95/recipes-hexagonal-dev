import { Receta } from "../domain/entities/receta";

export interface RecetaRepository {
    getRecetas(): Promise<Receta[]>
    getRecetaById(id: number): Promise<Receta | undefined>
    createReceta(receta: Omit<Receta, 'id'>): Promise<Receta>
}