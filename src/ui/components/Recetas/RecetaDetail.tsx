import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Receta } from "../../../domain/entities/receta"
import { recetaService } from "../../../infrastructure/config"
import { IonButtons, IonButton, IonIcon, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import PasosInstrucciones from "../Instrucciones/PasosInstrucciones"

const RecetaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [receta, setReceta] = useState<Receta>()
    const navigate = useIonRouter()
    useEffect(() => {
        const loadReceta = async () => {
            const receta = await recetaService.getReceta(parseInt(id))
            setReceta(receta)
        }
        loadReceta()
    })
    if (!receta) return <IonText>Loading</IonText>
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => navigate.goBack()} slot="icon-only">
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{receta.nombre}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonText color="secondary">
                    <h2>Ingredientes:</h2>
                </IonText>
                <ul>
                    {receta.ingredientes.map((ing, i) => (
                        <li key={i}>{ing.nombre}: {ing.cantidad} {ing.magnitud}</li>
                    ))}
                </ul>
                <IonText color="secondary">
                    <h2>Instrucciones:</h2>
                    <PasosInstrucciones pasos={receta.instrucciones} />
                </IonText>
            </IonContent>
        </IonPage>
    )
}
export default RecetaDetail