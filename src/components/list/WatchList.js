import _ from 'Lodash';
import ListFilter from 'components/list-filter/ListFilter';
import WatchListItem from 'components/list/WatchListItem';

let WatchList = Vue.component('watch-list', {
  template:`<section class="watch-list">
              <p>A list of movies, series, documentaries and games I want to watch and play.</p>
              <list-filter></list-filter>
              <!p>Showing <strong>{{items.length}}</strong> movies, series, games and documentaries.</p>

              <ul class="list">
                <watch-list-item v-for="item in items" :item="item" :key="item.imdbId"></watch-list-item>
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
  components: {
    WatchListItem,
    ListFilter
  }
});