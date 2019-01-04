<template>
  <section class="watch-list">
    <p>A list of movies, series, documentaries and games I want to watch and play.</p>
    <list-filter></list-filter>
    <p>
      Showing
      <strong>{{count}}</strong> movies, series, games and documentaries.
    </p>

    <ul class="list">
      <component :is="componentType(item)" v-for="item in items" :item="item" :key="item.imdbId"></component>
    </ul>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory } from "@/services/WatchItemFactory";
import ListFilter from "@/components/list-filter/ListFilter.vue";
import WatchListItem from "@/components/list/WatchListItem.vue";
import WatchListFranchise from "@/components/list/WatchListFranchise.vue";
import { WatchlistItems } from "@/services/WatchItemFactory";
import { WatchlistType } from "@/core/models/BaseModel";

export default Vue.extend({
  name: "WatchList",
  computed: {
    items(): WatchlistItems[] {
      return this.$store.getters
        .filteredItems()
        .sort((a: WatchlistItems, b: WatchlistItems) =>
          a.name > b.name ? -1 : 1
        );
    },
    count(): number {
      return this.items.reduce(
        (acc: number, item: WatchlistItems) => (acc += item.count),
        0
      );
    }
  },
  created() {
    this.$store.dispatch("getWatchList");
  },
  methods: {
    componentType(item: WatchlistItems) {
      return item.type === WatchlistType.Franchise
        ? "watch-list-franchise"
        : "watch-list-item";
    }
  },
  components: {
    WatchListItem,
    WatchListFranchise,
    ListFilter
  }
});
</script>
