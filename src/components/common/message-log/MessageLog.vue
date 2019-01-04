<template>
  <section :class="'messages ' + name" v-if="messages.length">
    <p v-for="message in messages" :class="'message ' + message.type" :key="message.id">
      <i :class="'icon icon-' +message.type"></i>
      <span v-text="message.text"></span>
      <button type="button" @click="dismiss(message.id)">
        <i class="icon icon-delete"></i>
      </button>
    </p>
  </section>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MessageLog",
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      messages: this.$store.state.messages
    };
  },
  methods: {
    dismiss(id: number) {
      this.$store.commit("dismiss", id);
    }
  }
});
</script>
