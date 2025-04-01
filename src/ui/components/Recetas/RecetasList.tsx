import { useEffect, useState } from "react"
import { Receta } from "../../../domain/entities/receta"
import { recetaService } from "../../../infrastructure/config"
import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonAlert, useIonModal, } from "@ionic/react"
import { add, trashOutline } from "ionicons/icons"
import RecetaAdd from "./RecetaAdd"
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces"

const RecetasList: React.FC = () => {
    const [recetas, setRecetas] = useState<Receta[]>([])

    const loadRecetas = async () => {
        const data = await recetaService.getAllRecetas()
        setRecetas(data)
    }
    useEffect(() => {
        loadRecetas()
    }, [])

    const [presentCreateRecipes, dismissCreateRecipes] = useIonModal(RecetaAdd, {
        dismiss: (data: string, role: string) => dismissCreateRecipes(data, role),
    })

    const [presentAlert] = useIonAlert()

    const showCreateRecipesModal = () => {
        presentCreateRecipes({
            onWillDismiss: (e: CustomEvent<OverlayEventDetail>) => {
                if (e.detail.role === 'confirm')
                    loadRecetas()
            }
        })
    }

    const handleDelete = (id: number) => {
        presentAlert({
            header: "Estas seguro?",
            message: "Estas seguro que quieres borrar la receta? Esta accion será irreversible",
            buttons: [
                {
                    text: "Si",
                    handler: async () => {
                        await recetaService.deleteReceta(id)
                        await loadRecetas()
                    }
                },
                {
                    text: "No",
                }
            ]
        })
    }

    const handleRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
        await loadRecetas()
        e.detail.complete()
    }

    return (
        <>
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <IonList>
                {recetas.map(receta => (
                    <IonItem key={receta.id}
                        routerLink={`/receta/${receta.id}`}
                    >
                        <IonLabel>
                            {receta.nombre}
                        </IonLabel>
                        <IonButtons slot="end">
                            <IonButton onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleDelete(receta.id)
                            }} color="danger" fill="clear" shape="round" slot="icon-only">
                                <IonIcon icon={trashOutline} />
                            </IonButton>
                        </IonButtons>
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