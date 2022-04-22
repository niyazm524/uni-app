<template>
<ion-modal animated :is-open="isOpen" @will-dismiss="$emit('update:isOpen', false)">
  <request-view :request="request" />
</ion-modal>
</template>

<script lang="ts">
import RequestView from "@/components/request-view.vue";
import { IRequest } from "@/lib/data-storage/models";
import { IonModal } from "@ionic/vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ViewRequestModal",
  components: {
    RequestView,
    IonModal,
  },
  props: {
    isOpen: {type: Boolean, required: true},
    request: {type: Object as PropType<IRequest>, required: true}
  },
  emits: ['update:isOpen', 'add'],
});
</script>

<style scoped>

</style>
