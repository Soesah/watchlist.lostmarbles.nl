
let Modal = Vue.component('modal', {
  template:`<div class="modal-container" v-if="data">
              <section class="modal" :class="{show: show}">
                <component :is="data.modal" @confirm="confirm" @cancel="cancel" :data="data"></component>
              </section>
            </div>`,
  data() {
    return {
      show: false,
      data: null
    }
  },
  created () {
    this.$store.state.event.$on('showModal', this.open);
  },
  methods: {
    open (data) {
      this.data = data;
      this.show = true;
    },
    close () {
      this.show = false;
      this.data = null;
    },
    confirm () {
      this.data.confirm();
      this.close();
    },
    cancel () {
      if (this.data.cancel) {
        this.data.cancel();
      }
      this.close();
    }
  }
});