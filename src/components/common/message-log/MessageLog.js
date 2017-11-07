
let MessageLog = Vue.component('message-log', {
  template: `<div :class="'messages ' + name" v-if="messages.length">
                <p v-for="message in messages" :class="'message ' + message.type">
                  <i :class="'icon icon-' +message.type"></i>
                  <span v-text="message.text"></span>
                  <button type="button" @click="dismiss(message.id)">
                    <i class="icon icon-delete"></i>
                  </button>
                </p>
             </div>`,
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      messages: this.$store.state.messages
    }
  },
  methods: {
    dismiss(id) {
      this.$store.commit('dismiss', id);
    }
  }
});