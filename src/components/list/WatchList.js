import _ from 'Lodash';
import WatchItemFactory from 'services/WatchItemFactory';
import ListFilter from 'components/list-filter/ListFilter';
import WatchListItem from 'components/list/WatchListItem';
import WatchListFranchise from 'components/list/WatchListFranchise';

let WatchList = Vue.component('watch-list', {
  template:`<section class="watch-list">
              <p>A list of movies, series, documentaries and games I want to watch and play.</p>
              <list-filter></list-filter>
              <!p>Showing <strong>{{items.length}}</strong> movies, series, games and documentaries.</p>

              <ul class="list">
                <component :is="componentType(item)" v-for="item in items" :item="item" :key="item.imdbId"></component>
              </ul>
            </section>`,
  computed: {
    items () {
      return _.orderBy(this.$store.getters.filteredItems(), 'name', 'asc');
    }
  },
  created () {
    this.$store.dispatch('getWatchList');
  },
  methods: {
    componentType (item) {
      return item.type === WatchItemFactory.FRANCHISE ? 'watch-list-franchise' : 'watch-list-item';
    }
  },
  components: {
    WatchListItem,
    WatchListFranchise,
    ListFilter
  }
});