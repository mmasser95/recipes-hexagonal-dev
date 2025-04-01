import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import RecetasList from '../components/Recetas/RecetasList';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recetas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Recetas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <RecetasList />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
