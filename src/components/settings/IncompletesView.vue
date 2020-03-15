<template>
  <section class="settings">
    <h2>Incomplete Items</h2>

    <p>See incomplete items (movies with N/A for runttime, series without seasons, etc.).</p>

    <section>
      <h3>Items without imdbId</h3>
      <ul class="list">
        <component
          :is="componentType(item)"
          v-for="item in incompletes"
          :item="item"
          :key="item.imdbID"
        ></component>
      </ul>
    </section>
  </section>
</template>
<script lang="ts">
import Vue from 'vue';
import { WatchlistItems } from '@/services/WatchItemFactory';
import { WatchlistType } from '@/core/models/BaseModel';
import WatchListItem from '@/components/list/WatchListItem.vue';
import WatchListFranchise from '@/components/list/WatchListFranchise.vue';

export default Vue.extend({
  name: 'IncompletesView',
  computed: {
    incompletes(): WatchlistItems[] {
      return this.$store.state.items.filter(
        (i: WatchlistItems) =>
          !~~i.imdbID.indexOf('NON-IMDB-ID') &&
          i.type !== WatchlistType.Franchise,
      );
    },
  },
  created() {
    this.$store.dispatch('getWatchList');
  },
  methods: {
    componentType(item: WatchlistItems) {
      return item.type === WatchlistType.Franchise
        ? 'watch-list-franchise'
        : 'watch-list-item';
    },
  },
  components: {
    WatchListItem,
    WatchListFranchise,
  },
});
</script>
