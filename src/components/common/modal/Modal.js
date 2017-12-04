
let Modal = Vue.component('modal', {
  template:`<div class="modal-container" v-if="data">
              <section class="modal" :class="{show: show}">
                <component :is="data.modal" @close="close" :data="data"></component>
              </section>
            </div>`,
  data() {
    return {
      show: false,
      data: null
    }
  },
  created () {
    this.$store.state.event.$on('openModal', this.open);
    this.$store.state.event.$on('closeModal', this.close);
  },
  methods: {
    open (data) {
      this.data = data;
      this.show = true;
    },
    close () {
      this.show = false;
      this.data = null;
    }
  }
});