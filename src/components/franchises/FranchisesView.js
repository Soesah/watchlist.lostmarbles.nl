
let FranchisesView = Vue.component('franchises-view', {
  template:`<section class="franchises">
              <p>A list of franchises.</p>

              <ul class="list">
                <franchise-item v-for="franchise in franchises" :franchise="franchise" :key="franchise.imdbId"></franchise-item>
              </ul>
            </section>`,
  created () {
    this.$store.dispatch('getWatchList').then(item => {
      this.$store.commit('addNav', {
        name: 'Add a franchise',
        to: '/franchises/add/'
      });
    });
  },
  destroyed () {
    this.$store.commit('removeNav', '/franchises/add');
  },
  data() {
    return {
      franchises: []
    }
  }
});
