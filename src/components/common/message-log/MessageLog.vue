<template>
  <section :class="'messages ' + name" v-if="messages && messages.length">
    <div v-for="message in messages" :class="'message ' + type(message.type)" :key="message.id">
      <i :class="'icon icon-' + type(message.type)"></i>
      <p v-text="message.text"></p>
      <button type="button" @click="dismiss(message.id)">
        <i class="icon icon-delete"></i>
      </button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import messageService, {
  MessageType,
  Message
} from "@/services/MessageService";

export default Vue.extend({
  name: "MessageLog",
  props: {
    name: {
      type: String
    }
  },
  computed: {
    messages(): Message[] {
      return this.$store.state.messages;
    }
  },
  methods: {
    type(type: MessageType): string {
      return MessageType[type].toLowerCase();
    },
    dismiss(id: number) {
      this.$store.dispatch("dismiss", id);
    }
  }
});
</script>
