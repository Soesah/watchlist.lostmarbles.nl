
let Version = Vue.component('version', {
  template: `<div class="version" v-text="version"></div>`,
  computed: {
    version () {
      return '1.6.8';
    }
  }
});

