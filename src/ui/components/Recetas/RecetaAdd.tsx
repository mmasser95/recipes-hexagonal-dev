import { IonCol, IonRow, IonGrid, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon } from "@ionic/react"
import ModalLayout from "../../layouts/modal"
import { useState } from "react"
import { Ingrediente, Magnitud } from "../../../domain/entities/ingrediente"
import { Receta } from "../../../domain/entities/receta"
import { Paso } from "../../../domain/entities/paso"
import { add } from "ionicons/icons"

interface Props {
    dismiss: (data: string, role: string) => void
}

const RecetaAdd: React.FC<Props> = ({ dismiss }) => {

    const [receta, setReceta] = useState<Omit<Receta, 'id'>>({
        nombre: "",
        ingredientes: [],
        instrucciones: []
    })

    const [ingrediente, setIngrediente] = useState<Ingrediente>({
        nombre: "",
        cantidad: 0,
        magnitud: "gramos"
    })

    const [paso, setPaso] = useState<Omit<Paso, 'orden'>>({
        texto: ""
    })

    const magnitudes: Magnitud[] = ["gramos", "mililitros", "unidades", "cucharadas"];

    return (
        <ModalLayout
            title="Crear receta"
            dismiss={dismiss}
        >
            <IonInput label="Nombre receta" labelPlacement="floating" onIonChange={e => setReceta({ ...receta, nombre: e.detail.value! })} />
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonInput label="Nombre ingrediente" labelPlacement="floating" onIonChange={e => setIngrediente({ ...ingrediente, nombre: e.detail.value! })} />
                    </IonCol>
                    <IonCol>
                        <IonInput label="Cantidad ingrediente" labelPlacement="floating" onIonChange={e => setIngrediente({ ...ingrediente, cantidad: parseFloat(e.detail.value!) })} />
                    </IonCol>
                    <IonCol>
                        <IonSelect
                            value={ingrediente.magnitud}
                            onIonChange={e => setIngrediente({ ...ingrediente, magnitud: e.detail.value })}
                        >
                            {magnitudes.map(mag =>
                            (
                                <IonSelectOption key={mag} value={mag}>
                                    {mag.toUpperCase()}
                                </IonSelectOption>
                            )
                            )}
                        </IonSelect>

                    </IonCol>
                    <IonCol>
                        <IonButton slot="icon-only">
                            Hola2
                            <IonIcon icon={add} />
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonButton>Hola</IonButton>
        </ModalLayout >
    )
}
export default RecetaAdd