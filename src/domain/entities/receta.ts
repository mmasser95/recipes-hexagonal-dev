import { Ingrediente } from "./ingrediente";


// Entidad Receta (ahora usa Ingrediente[])
export type Receta = {
    id: number;
    nombre: string;
    ingredientes: Ingrediente[]; // <- Cambiado a array de Ingrediente
    instrucciones: string;
    imagen?: string;
};