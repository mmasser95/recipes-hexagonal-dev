import { Receta } from "../../../domain/entities/receta";
import { RecetaRepository } from "../../../ports/RecetaRepository";

export class JsonRecetaRepository implements RecetaRepository {
    async getRecetas(): Promise<Receta[]> {
        const res = await fetch('/data/recetas.json')
        return res.json()
    }
    async getRecetaById(id: number): Promise<Receta | undefined> {
        const recetas = await this.getRecetas()
        return recetas.find(r => r.id === id)
    }
}