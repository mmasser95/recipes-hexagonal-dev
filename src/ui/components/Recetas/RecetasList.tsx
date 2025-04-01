import { useEffect, useState } from "react"
import { Receta } from "../../../domain/entities/receta"
import { recetaService } from "../../../infrastructure/config"
import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, useIonModal, } from "@ionic/react"
import { add } from "ionicons/icons"
import RecetaAdd from "./RecetaAdd"
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces"

const RecetasList: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([])

    useEffect(() => {
        const loadRecetas = async () => {
            const data = await recetaService.getAllRecetas()
            setRecetas(data)
        }
        loadRecetas()
    }, [])

    const [presentCreateRecipes, dismissCreateRecipes] = useIonModal(RecetaAdd, {
        dismiss: (data: string, role: string) => dismissCreateRecipes(data, role),
    })

    const showCreateRecipesModal = () => {
        presentCreateRecipes({
            onWillDismiss: (e: CustomEvent<OverlayEventDetail>) => {
                if (e.detail.role === 'confirm')
                    console.log(`Hello, ${e.detail.data}`);
            }
        })
    }

    return (
        <>
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
            <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={showCreateRecipesModal}>
                <IonFabButton>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </>
    )
}
export default RecetasList