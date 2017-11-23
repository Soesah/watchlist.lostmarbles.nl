import WatchItemFactory from 'services/WatchItemFactory';
import WatchListItem from 'components/list/WatchListItem';

let WatchFranchiseView = Vue.component('watch-franchise-view', {
  template:`<section class="view" v-if="franchise">
              <h2 v-text="franchise.name"></h2>


              <ul class="list">
                <watch-list-item v-for="item in items" :item="item" :key="item.imdbId"></watch-list-item>
              </ul>
            </section>`,
  computed: {
    franchise () {
      return this.$store.state.item
    },
    items: function() {
      return this.franchise.items ? this.$store.getters.franchiseItems(this.franchise.items) : [];
    }
  },
  created () {
    this.$store.dispatch('getItemByName', this.$route.params.path).then(item => {
      this.$store.commit('addNav', {
        name: 'Edit ' + item.name,
        to: '/edit/franchise/' + item.path
      });
    });
  },
  destroyed () {
    this.$store.commit('removeNav', '/edit/franchise/' + this.franchise.path);
  },
  methods: {

    back (evt) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  },
  components: {
    WatchListItem
  }
});