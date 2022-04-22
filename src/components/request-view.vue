<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="secondary">
        <ion-back-button />
      </ion-buttons>

      <ion-title>Заявка {{request.title}}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div>
      <ion-input :value="request.title" placeholder="Заголовок" readonly />
      <ion-textarea :value="request.body" stacked readonly>Описание проблемы</ion-textarea>
      <ion-note><ion-icon :icon="locationOutline" size="large"></ion-icon>{{request.position || 'Без гео-точки'}}</ion-note>
    </div>

    <ion-list>
      <ion-list-header> <h3>Комментарии</h3> </ion-list-header>
      <div>
        <div class="send-row">
          <ion-input style="flex: 1 1" v-model="newComment.username" placeholder="Представьтесь" />
          <ion-button @click="sendComment">
            <ion-icon slot="icon-only" :icon="sendIcon"></ion-icon>
          </ion-button>
        </div>
        <ion-textarea v-model="newComment.text" stacked>Комментарий...</ion-textarea>
      </div>
      <ion-item v-for="(comment, key) in comments" :key="key">
        <ion-avatar slot="start">
          <ion-img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
        </ion-avatar>
        <ion-label>
          <h2>{{comment.username}}</h2>
          <p>{{comment.text}}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import {locationOutline} from "ionicons/icons";
import { storage } from "@/lib/data-storage";
import { IComment, IRequest } from "@/lib/data-storage/models";
import {
  IonIcon,
  IonBackButton,
  IonContent,
  IonHeader,
  IonInput,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonImg, IonNote,
} from "@ionic/vue";
import { defineComponent, PropType, reactive, ref, toRaw, watch } from "vue";
import {send} from "ionicons/icons";

export default defineComponent({
  name: "RequestView",
  components: {
    IonContent, IonHeader, IonTitle, IonInput, IonTextarea, IonToolbar, IonBackButton, IonButtons, IonIcon, IonButton, IonAvatar, IonItem, IonLabel, IonList, IonImg, IonNote
  },
  props: {
    request: {type: Object as PropType<IRequest>, required: true}
  },
  setup(props, {emit}) {
    const comments = ref<IComment[]>([]);
    const loadComments = async () => {
      if(!props.request.id) return;
      comments.value = await storage.comments.load(props.request.id)
    }
    watch(() => props.request, async () => {
      await loadComments()
    }, {immediate: true})
    const newComment = reactive<IComment>({
      username: '',
      text: '',
      request_id: 0,
    })
    const sendComment = async () => {
      if(props.request.id == null) return;
      await storage.comments.add({
        ...toRaw(newComment),
        request_id: props.request.id,
      })
      await loadComments();
    }
    return {newComment, sendComment, comments, sendIcon: send, locationOutline }
  }
});
</script>

<style>
.send-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
</style>
