import { useEffect, useState } from "react"
import { Receta } from "../../../domain/entities/receta"
import { recetaService } from "../../../infrastructure/config"
import { IonItem, IonLabel, IonList, } from "@ionic/react"

const RecetasList: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([])

    useEffect(() => {
        const loadRecetas = async () => {
            const data = await recetaService.getAllRecetas()
            setRecetas(data)
        }
        loadRecetas()
    }, [])

    return (
        <IonList>
            {recetas.map(receta => (
                <IonItem key={receta.id}
                    routerLink={`/receta/${receta.id}`}
                >
                    <IonLabel>
                        {receta.nombre}
                    </IonLabel>
                </IonItem>
            ))
            }
        </IonList >
    )
}
export default RecetasList