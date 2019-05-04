<template>
  <section class="watch-list">
    <p>
      Showing
      <strong>{{filteredItemCount}}</strong> movies, series, games and documentaries.
    </p>
    <list-sorter></list-sorter>
    <list-filter></list-filter>
    <ul class="list">
      <component
        :is="componentType(item)"
        v-for="item in filteredItems"
        :item="item"
        :key="item.imdbID"
      ></component>
    </ul>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory } from "@/services/WatchItemFactory";
import ListFilter from "@/components/list-filter/ListFilter.vue";
import ListSorter from "@/components/list-sorter/ListSorter.vue";
import WatchListItem from "@/components/list/WatchListItem.vue";
import WatchListFranchise from "@/components/list/WatchListFranchise.vue";
import { WatchlistItems } from "@/services/WatchItemFactory";
import { WatchlistType } from "@/core/models/BaseModel";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "WatchList",
  computed: {
    ...mapGetters(["filteredItems", "filteredItemCount"])
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
    ListFilter,
    ListSorter
  }
});
</script>
