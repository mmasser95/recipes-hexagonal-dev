import { IonItem, IonLabel, IonList, IonNote } from "@ionic/react"
import { Paso } from "../../../domain/entities/paso"

interface Props {
    pasos: Paso[]
}
const PasosInstrucciones: React.FC<Props> = ({ pasos }: Props) => {
    return (
        <IonList>
            {pasos.map(paso => (
                <IonItem key={paso.orden}>
                    <IonLabel>
                        <h3>Paso {paso.orden}</h3>
                        <p>{paso.texto}</p>
                        {paso.tiempo && <IonNote color="medium">Tiempo: {paso.tiempo}</IonNote>}
                    </IonLabel>
                </IonItem>
            ))}
        </IonList>
    )
}
export default PasosInstrucciones