
let FranchisesView = Vue.component('franchises-view', {
  template:`<section class="franchises">
              <h2>Franchises</h2>
              <p>A list of franchises.</p>

              <ul class="list">
                <li class="item" v-for="franchise in franchises" :franchise="franchise" :key="franchise.imdbId">
                  <router-link :to="'/view/franchise/' + franchise.path">
                    <h6 v-text="franchise.name"></h6>
                    <span class="bracketed" v-text="franchise.items.length"></span>
                  </router-link>
                </li>
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
  computed: {
    franchises () {
      return _.orderBy(this.$store.getters.franchises(), 'name', 'asc');
    }
  },
});
