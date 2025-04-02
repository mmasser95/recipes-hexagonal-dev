import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from "@ionic/react"
import { close } from "ionicons/icons"

interface Props {
    title: string
    children: React.ReactNode
    dismiss: (data: string, role: string) => void
}
const ModalLayout: React.FC<Props> = ({ title, children, dismiss }) => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => dismiss("", 'cancel')} slot="icon-only">
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {children}
            </IonContent>
        </IonPage>
    )
}
export default ModalLayout