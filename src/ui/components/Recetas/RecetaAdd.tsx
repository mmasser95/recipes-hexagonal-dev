import { IonCol, IonRow, IonGrid, IonInput, IonSelect, IonSelectOption, IonButton, IonTextarea, IonList, IonItem, IonIcon, IonButtons, IonText, useIonAlert, IonReorderGroup, IonReorder, ItemReorderEventDetail, useIonActionSheet } from "@ionic/react"
import ModalLayout from "../../layouts/modal"
import { useEffect, useRef, useState } from "react"
import { Ingrediente, Magnitud } from "../../../domain/entities/ingrediente"
import { Receta } from "../../../domain/entities/receta"
import { Paso } from "../../../domain/entities/paso"
import { recetaService } from "../../../infrastructure/config"
import { add, pencilOutline, trashOutline } from "ionicons/icons"

interface Props {
    dismiss: (data: string, role: string) => void,
    recetaId?: number
}

const RecetaAdd: React.FC<Props> = ({ dismiss, recetaId }) => {

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

    const [updating, setUpdating] = useState<boolean>(false)

    const [presentAlert] = useIonAlert()

    const [presentActionSheet] = useIonActionSheet()

    const pressTimer = useRef<NodeJS.Timeout | null>(null)

    const handleLongPress = (orden: number) => {
        presentActionSheet({
            header: "Actions",
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        deletePaso(orden)
                    }
                },
                {
                    text: 'Update',
                    handler: () => {
                        presentAlert(`Update ${orden}`)
                    }
                }
            ]
        })
    }

    const startPressTimer = (orden: number) => {
        pressTimer.current = setTimeout(() => {
            handleLongPress(orden)
        }, 600);
    }

    const clearPressTimer = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current)
            pressTimer.current = null
        }
    }

    const magnitudes: Magnitud[] = ["gramos", "mililitros", "unidades", "cucharadas"];

    const createIt = async () => {
        try {
            await recetaService.createReceta(receta)
            dismiss("", "confirm")
        } catch (error) {
            console.error(error);
        }
    }

    const updateIt = async () => {
        try {
            await recetaService.updateReceta(recetaId!, { ...receta, id: recetaId! })
            dismiss("", "confirm")
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (recetaId) {
            setUpdating(true)
            recetaService.getReceta(recetaId)
                .then(r => r && setReceta(r))
        }
    }, [])

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

    const deleteIngrediente = (ingrediente: Ingrediente) => {
        presentAlert({
            header: "¿Estas seguro?",
            message: "¿Estás seguro que quieres eliminar el ingrediente? Esta acción no se puede deshacer.",
            buttons: [
                {
                    text: "Si",
                    role: "destructive",
                    handler: () => {
                        const updatedReceta: Omit<Receta, 'id'> = {
                            ...receta,
                            ingredientes: receta.ingredientes.filter(e => e.nombre !== ingrediente.nombre || e.cantidad !== ingrediente.cantidad || e.magnitud !== ingrediente.magnitud)
                        }
                        setReceta(updatedReceta)
                    }
                }, {
                    text: "No",
                    role: "cancel"
                }
            ]
        })
    }

    const deletePaso = (orden: number) => {
        presentAlert({
            header: "¿Estás seguro?",
            message: "¿Estás seguro que quieres borrar este paso? Esta acción no se puede deshacer.",
            buttons: [
                {
                    text: 'Si',
                    role: "destructive",
                    handler: () => {
                        const updatedReceta: Omit<Receta, 'id'> = {
                            ...receta,
                            instrucciones: receta.instrucciones
                                .filter(e => e.orden !== orden)
                                .map((paso, idx) => ({
                                    ...paso,
                                    orden: idx + 1
                                }))
                        }
                        setReceta(updatedReceta)
                    }
                },
                {
                    text: "No",
                    role: "cancel"
                }
            ]
        })
    }

    const handleReorder = (e: CustomEvent<ItemReorderEventDetail>) => {
        const reorderdItems = e.detail.complete(receta.instrucciones)
        const updatedInstrucciones = reorderdItems.map((paso: Paso, idx: number) => ({
            ...paso,
            orden: idx + 1
        }))
        setReceta({
            ...receta,
            instrucciones: updatedInstrucciones
        })
    }

    // const updateIngrediente = (ingrediente: Ingrediente) => {
    // }
    // const updatePaso = (orden: number) => {
    // }

    return (
        <ModalLayout
            title={updating ? "Actualizar receta" : "Crear receta"}
            dismiss={dismiss}
        >
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonInput label="Nombre receta" labelPlacement="floating" onIonChange={e => setReceta({ ...receta, nombre: e.detail.value! })} value={receta.nombre} />
                    </IonCol>
                </IonRow>
                <IonRow className="ion-align-items-center">
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
                                    <IonText>{el.nombre} - {el.cantidad} {el.magnitud}</IonText>
                                    <IonButtons slot="end">
                                        <IonButton color="tertiary">
                                            <IonIcon icon={pencilOutline} slot="icon-only" />
                                        </IonButton>
                                        <IonButton color="danger" onClick={() => deleteIngrediente(el)}>
                                            <IonIcon icon={trashOutline} slot="icon-only" />
                                        </IonButton>
                                    </IonButtons>
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
                            <IonReorderGroup disabled={false} onIonItemReorder={(e) => handleReorder(e)}>
                                {receta.instrucciones.map(el => (
                                    <IonItem
                                        onTouchStart={() => startPressTimer(el.orden)}
                                        onTouchEnd={clearPressTimer}
                                        onMouseDown={() => startPressTimer(el.orden)}
                                        onMouseUp={clearPressTimer}
                                        onMouseLeave={clearPressTimer}
                                        key={el.orden}>
                                        <IonReorder slot="start"></IonReorder>
                                        <IonText>{el.orden} {el.tiempo && `(${el.tiempo} min) `}- {el.texto}</IonText>
                                    </IonItem>
                                ))}
                            </IonReorderGroup>
                        </IonList>}
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton expand="block" onClick={updating ? updateIt : createIt}>{updating ? "Actualizar receta" : "Crear receta"}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </ModalLayout >
    )
}
export default RecetaAdd