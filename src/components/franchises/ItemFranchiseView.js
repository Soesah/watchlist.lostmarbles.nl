import WatchListItem from 'components/list/WatchListItem';

let ItemFranchiseView = Vue.component('item-franchise-view', {
  template:`<section class="item-franchise-view" v-if="franchise">
              <h3>Franchise</h3>
              <h4 v-text="franchise.name"></h4>

              <ul class="list">
                <watch-list-item v-for="item in items" :item="item" :key="item.imdbId"></watch-list-item>
              </ul>
            </section>`,
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  computed: {
    franchise () {
      return this.$store.getters.getItemFranchise(this.item);
    },
    items: function() {
      return this.franchise ? this.$store.getters.franchiseItems(this.franchise.items) : [];
    }
  },
  components: {
    WatchListItem
  }
});