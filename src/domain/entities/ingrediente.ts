// Definimos un tipo para la magnitud (puede ser un enum o un string literal)
export type Magnitud =
    | "gramos"
    | "mililitros"
    | "unidades"
    | "cucharadas"
    | "tazas"
    | "litros"
    | string; // Para personalizadas

// Entidad Ingrediente
export type Ingrediente = {
    nombre: string;
    cantidad: number;
    magnitud: Magnitud;
    unidad?: string; // Opcional (ej: "cucharada sopera")
};