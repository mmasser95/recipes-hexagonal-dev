import { Ingrediente } from "./ingrediente";
import { Paso } from "./paso";


// Entidad Receta (ahora usa Ingrediente[])
export type Receta = {
    id: number;
    nombre: string;
    ingredientes: Ingrediente[]; // <- Cambiado a array de Ingrediente
    instrucciones: Paso[];
    imagen?: string;
};