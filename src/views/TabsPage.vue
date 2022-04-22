<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="triangle" />
          <ion-label>Заявки</ion-label>
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="square" />
          <ion-label>Настройки</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { defineComponent, onBeforeMount, ref } from "vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  onIonViewDidEnter, onIonViewWillLeave,
} from "@ionic/vue";
import { ellipse, square, triangle } from 'ionicons/icons';

export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    const authOk = ref<boolean | string>(false)
    onIonViewDidEnter(async () => {
      if(authOk.value) return;
      if(localStorage.getItem('BIOMETRIC_ENABLED') === 'true') {
        // const auth = true
        const auth = (await FingerprintAIO.loadBiometricSecret({title: 'Авторизуйтесь', }).catch(() => 'failure'))
        authOk.value = auth;
      }
      else authOk.value = true;
    });
    return {
      authOk,
      ellipse, 
      square, 
      triangle,
    }
  }
});
</script>
