export type Paso = {
    orden: number; // 1, 2, 3...
    texto: string;
    tiempo?: string; // Opcional: "15 min", "2 horas"
    imagen?: string; // Opcional: URL o referencia
};