
let Modal = Vue.component('modal', {
  template:`<div class="modal-container" v-if="data">
              <section class="modal" :class="{show: show}">
                <component :is="data.modal" @close="close" :data="data"></component>
              </section>
            </div>`,
  data() {
    return {
      data: null
    }
  },
  computed: {
    show() {
      return !!this.data;
    }
  },
  created () {
    this.$store.state.event.$on('openModal', this.open);
    this.$store.state.event.$on('closeModal', this.close);
  },
  methods: {
    open (data) {
      this.data = data;
    },
    close () {
      this.data = null;
    }
  }
});