<template>
  <li :class="['item franchise', {'franchise-watched': watched}]">
    <router-link :to="'/view/franchise/' + this.item.path">
      <h6 v-text="item.name"></h6>
      <span class="bracketed" v-text="item.items.length"></span>
    </router-link>
    <ul class="list franchise-list">
      <watch-list-item v-for="subitem in items" :item="subitem" :key="subitem.imdbID"></watch-list-item>
    </ul>
  </li>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import WatchListItem from "@/components/list/WatchListItem.vue";

export default Vue.extend({
  name: "WatchListFranchise",
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    items: function() {
      return this.$store.getters.franchiseItems(this.item.items);
    },
    watched: function() {
      return (
        (this as any).items.filter((item: WatchlistItems) => !item.watched)
          .length === 0
      );
    }
  },
  components: {
    WatchListItem
  }
});
</script>
