<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Настройки</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>Вход по сенсору</ion-label>
          <ion-toggle :disabled="!isAvailable" v-model="isBiometricEnabled" slot="end"></ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { debounce } from "@/lib/utils";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { defineComponent, onBeforeMount, ref, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonToggle,
} from "@ionic/vue";

export default defineComponent({
  name: 'Tab3Page',
  components: { IonList, IonItem, IonLabel, IonToggle, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
    let isBiometricEnabled = ref(false);
    const isAvailable = ref(false);
    let skip = 0;
    onBeforeMount(async () => {
      isAvailable.value = await FingerprintAIO.isAvailable();
      isBiometricEnabled.value = localStorage.getItem('BIOMETRIC_ENABLED') === 'true';
      skip = 1;
    })
    watch(isBiometricEnabled, async (isEnabled) => {
      if(skip) {
        skip = 0;
        return;
      }
      if(isEnabled)
        await FingerprintAIO.registerBiometricSecret({title: 'Регистрация отпечатка', secret: '12354'}).catch(() => 'failure')
      localStorage.setItem('BIOMETRIC_ENABLED', `${isEnabled}`)
    })

    return {isAvailable, isBiometricEnabled}
  }
});
</script>
