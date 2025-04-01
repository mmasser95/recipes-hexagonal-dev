import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Receta } from "../../../domain/entities/receta";
import { RecetaRepository } from "../../../ports/RecetaRepository";
import { Capacitor } from "@capacitor/core";

export class JsonRecetaRepository implements RecetaRepository {
    private readonly FILE_PATH = 'recetas.json';
    async getRecetas(): Promise<Receta[]> {
        if (Capacitor.getPlatform() === "android") {
            const file = await Filesystem.readFile({
                path: this.FILE_PATH,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            })
            return JSON.parse(file.data as string)
        } else {
            const res = await fetch('/data/recetas.json')
            return res.json()
        }
    }
    async getRecetaById(id: number): Promise<Receta | undefined> {
        const recetas = await this.getRecetas()
        return recetas.find(r => r.id === id)
    }
    async createReceta(receta: Omit<Receta, 'id'>): Promise<Receta> {
        const recetas = await this.getRecetas()
        const newId = Math.max(0, ...recetas.map(r => r.id)) + 1
        const newReceta: Receta = { ...receta, id: newId }
        const updatedRecetas = [...recetas, newReceta]
        await this.saveRecetas(updatedRecetas)
        return newReceta
    }
    private async saveRecetas(recetas: Receta[]) {
        await Filesystem.writeFile({
            path: this.FILE_PATH,
            data: JSON.stringify(recetas),
            directory: Directory.Data,
            encoding: Encoding.UTF8
        })
    }
}