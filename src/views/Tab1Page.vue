<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Заявки</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-fab vertical="top" horizontal="end" slot="fixed" edge>
        <ion-fab-button @click="state.isDialogOpen = true">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-card v-for="(req, key) in state.requests" :key="key" button @click="onRequestClick(req)">
        <ion-card-header>
          <ion-card-subtitle>{{new Date(req.created_at).toLocaleDateString()}}</ion-card-subtitle>
          <ion-card-title>{{req.title}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>{{req.body}}</ion-card-content>
      </ion-card>
      <template v-if="state.requests.length === 0">
        <ion-text color="gray">
          Заявок не найдено
        </ion-text>
      </template>
    </ion-content>
    <create-request-modal v-model:is-open="state.isDialogOpen" @add="onRequestAdd" />
    <view-request-modal v-model:is-open="state.isRequestsOpen" :request="state.openedRequest" />
  </ion-page>
</template>

<script lang="ts">
import CreateRequestModal from "@/components/create-request-modal.vue";
import ViewRequestModal from "@/components/view-request-modal.vue";
import { initSql, sqlStore, storage } from "@/lib/data-storage";
import { IRequest } from "@/lib/data-storage/models";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  modalController,
  IonText,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { computed, defineComponent, nextTick, onMounted, reactive, ref, toRaw } from "vue";
import { useSQLite } from "vue-sqlite-hook";

export default  defineComponent({
  name: 'Tab1Page',
  components: { ViewRequestModal, CreateRequestModal, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonIcon, IonFab, IonFabButton, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent },
  setup() {
    const state = reactive({
      requests: [] as IRequest[],
      isDialogOpen: false,
      isRequestsOpen: false,
      openedRequest: null as any,
    })
    const sql = useSQLite()
    const logs = ref<any>('')
    const sqlLogs = computed(() => sqlStore.logs)
    onMounted(async () => {
      try {
        await nextTick()
        await initSql(sql)
        state.requests = await storage.requests.load()
        logs.value += JSON.stringify(await storage.requests.load(), null, 2)
      } catch (e: any) {
        logs.value += 'error: '+ (e?.message)+'   stack ' + e?.stack
      }


    })
    const onRequestAdd = async (request: IRequest) => {
      await storage.requests.modify(request);
      state.requests = await storage.requests.load()
    }
    const onRequestClick = async (request: IRequest) => {
      state.openedRequest = request;
      state.isRequestsOpen = true;

    }
    return { logs, add, sqlLogs, state, onRequestAdd, onRequestClick };
  }
});
</script>
