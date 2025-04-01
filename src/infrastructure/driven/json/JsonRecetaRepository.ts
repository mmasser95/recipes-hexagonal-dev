import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Receta } from "../../../domain/entities/receta";
import { RecetaRepository } from "../../../ports/RecetaRepository";

export class JsonRecetaRepository implements RecetaRepository {
    private readonly FILE_PATH = 'recetas.json';
    async getRecetas(): Promise<Receta[]> {
        // if (Capacitor.getPlatform() === "android") {
        try {
            const file = await Filesystem.readFile({
                path: this.FILE_PATH,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            })
            return JSON.parse(file.data as string)
        } catch (err) {
            console.error(err);
            const res = await fetch('/data/recetas.json')
            const data = await res.json()
            await this.saveRecetas(data)
            return data
        }
        // } else {
        //     const res = await fetch('/data/recetas.json')
        //     return res.json()
        // }
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
    async deleteReceta(id: number): Promise<void> {
        const recetas = await this.getRecetas()
        const updatedRecetas = recetas.filter(r => r.id != id)
        if (updatedRecetas.length == recetas.length)
            throw new Error(`Receta con ID ${id} no encontrada`);
        await this.saveRecetas(updatedRecetas)
    }
}