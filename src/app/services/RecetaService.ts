import { Receta } from "../../domain/entities/receta";
import { RecetaRepository } from "../../ports/RecetaRepository";

export class RecetaService {
    constructor(private repo: RecetaRepository) { }
    async getAllRecetas(): Promise<Receta[]> {
        return this.repo.getRecetas()
    }
    async getReceta(id: number): Promise<Receta | undefined> {
        return this.repo.getRecetaById(id)
    }
}