<template>
<ion-modal animated :is-open="isOpen" @will-dismiss="$emit('update:isOpen', false)">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="primary">
        <ion-button @click="createNew">Создать</ion-button>
      </ion-buttons>

      <ion-title>Новая заявка</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div>
      <ion-input v-model="newRequest.title" placeholder="Заголовок" />
      <ion-textarea v-model="newRequest.body" placeholder="Описание проблемы" />
      <ion-note style="display: block"><ion-icon :size="locationOutline"></ion-icon>{{newRequest.position || 'Без гео-точки'}}</ion-note>
      <ion-button style="margin-top: 8px; margin-left: 8px;" @click="attachGeo">
        <ion-icon slot="start" :icon="attachOutline"></ion-icon>
        {{ !newRequest.position ? 'Прикрепить' : 'Обновить' }} гео-локацию
      </ion-button>
    </div>
  </ion-content>
</ion-modal>
</template>

<script lang="ts">
import {locationOutline, attachOutline} from "ionicons/icons";
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTextarea, IonTitle, IonToolbar, IonIcon } from "@ionic/vue";
import { Geolocation } from "@awesome-cordova-plugins/geolocation";
import { defineComponent, reactive, toRaw } from "vue";

export default defineComponent({
  name: "CreateRequestModal",
  components: {
    IonModal, IonContent, IonHeader, IonTitle, IonInput, IonTextarea, IonToolbar, IonButton, IonButtons, IonIcon
  },
  props: {
    isOpen: {type: Boolean, required: true}
  },
  emits: ['update:isOpen', 'add'],
  setup(props, {emit}) {
    const newRequest = reactive({
      title: '',
      body: '',
      position: '',
    })
    const createNew = () => {
      emit('add', toRaw(newRequest));
      Object.assign(newRequest, {
        title: '',
        body: '',
        position: ''
      });
      emit('update:isOpen', false)
    }
    const attachGeo = async () => {
      const geo = await Geolocation.getCurrentPosition({enableHighAccuracy: true})
      newRequest.position = `(${geo.coords.latitude},${geo.coords.longitude})`
    }
    return { newRequest, createNew, attachGeo, locationOutline, attachOutline }
  }
});
</script>

<style scoped>

</style>
