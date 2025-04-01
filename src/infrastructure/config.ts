import { RecetaService } from "../app/services/RecetaService";
import { JsonRecetaRepository } from "./driven/json/JsonRecetaRepository";

const recetaRepository = new JsonRecetaRepository()
export const recetaService = new RecetaService(recetaRepository)