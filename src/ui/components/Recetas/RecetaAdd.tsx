import { IonCol, IonRow, IonGrid, IonInput, IonSelect, IonSelectOption, IonButton, IonTextarea, IonList, IonItem, IonIcon } from "@ionic/react"
import ModalLayout from "../../layouts/modal"
import { useState } from "react"
import { Ingrediente, Magnitud } from "../../../domain/entities/ingrediente"
import { Receta } from "../../../domain/entities/receta"
import { Paso } from "../../../domain/entities/paso"
import { recetaService } from "../../../infrastructure/config"
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

    const createIt = async () => {
        try {
            await recetaService.createReceta(receta)
            dismiss("", "confirm")
        } catch (error) {
            console.error(error);
        }
    }

    const addIngrediente = () => {
        setReceta({
            ...receta,
            ingredientes: [...receta.ingredientes, ingrediente]
        })
        setIngrediente({
            nombre: "",
            cantidad: 0,
            magnitud: "gramos"
        })
    }

    const addPaso = () => {
        const newPasoId = Math.max(0, ...receta.instrucciones.map(el => el.orden)) + 1
        const newPaso: Paso = { ...paso, orden: newPasoId }
        setReceta({
            ...receta,
            instrucciones: [...receta.instrucciones, newPaso]
        })
        setPaso({
            texto: ""
        })
    }

    return (
        <ModalLayout
            title="Crear receta"
            dismiss={dismiss}
        >
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonInput label="Nombre receta" labelPlacement="floating" onIonChange={e => setReceta({ ...receta, nombre: e.detail.value! })} />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="5">
                        <IonInput label="Nombre ingrediente" labelPlacement="floating" onIonChange={e => setIngrediente({ ...ingrediente, nombre: e.detail.value! })} value={ingrediente.nombre} />
                    </IonCol>
                    <IonCol size="2">
                        <IonInput type="number" label="Cantidad" labelPlacement="floating" onIonChange={e => setIngrediente({ ...ingrediente, cantidad: parseFloat(e.detail.value!) })} value={ingrediente.cantidad} />
                    </IonCol>
                    <IonCol size="3">
                        <IonSelect
                            id="ingredienteMag"
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
                        <IonButton shape="round" fill="outline" onClick={addIngrediente}>
                            <IonIcon slot="icon-only" icon={add} />
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        {receta.ingredientes.length > 0 && <IonList>
                            {receta.ingredientes.map(el => (
                                <IonItem>
                                    {el.nombre} - {el.cantidad} {el.magnitud}
                                </IonItem>
                            ))}
                        </IonList>}
                    </IonCol>
                </IonRow>
                <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonCol size="7">
                        <IonTextarea autoGrow={true} label="Texto" labelPlacement="floating" onIonChange={e => setPaso({ ...paso, texto: e.detail.value! })} value={paso.texto} />
                    </IonCol>
                    <IonCol size="3">
                        <IonInput type="number" label="Tiempo" labelPlacement="floating" onIonChange={e => setPaso({ ...paso, tiempo: e.detail.value! })} value={paso.tiempo ? paso.tiempo : ""} />
                    </IonCol>
                    <IonCol>
                        <IonButton onClick={addPaso} shape="round" fill="outline">
                            <IonIcon slot="icon-only" icon={add} />
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        {receta.instrucciones.length > 0 && <IonList>
                            {receta.instrucciones.map(el => (
                                <IonItem>
                                    {el.orden} {el.tiempo && `(${el.tiempo} min) `}- {el.texto}
                                </IonItem>
                            ))}
                        </IonList>}
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton expand="block" onClick={createIt}>Crear receta</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </ModalLayout >
    )
}
export default RecetaAdd