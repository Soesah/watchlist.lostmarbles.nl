<template>
  <section class="view" v-if="franchise">
    <h2 v-text="franchise.name"></h2>

    <ul class="list">
      <watch-list-item v-for="item in items" :item="item" :key="item.imdbId"></watch-list-item>
    </ul>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import WatchListItem from "@/components/list/WatchListItem.vue";
import { Franchise } from "@/models/FranchiseModel";

export default Vue.extend({
  name: "WatchFranchiseView",
  computed: {
    franchise(): Franchise {
      return this.$store.state.item;
    },
    items(): WatchlistItems {
      return this.franchise.items
        ? this.$store.getters.franchiseItems(this.franchise.items)
        : [];
    }
  },
  created() {
    this.$store
      .dispatch("getItemByName", this.$route.params.path)
      .then(item => {
        this.$store.commit("addNav", {
          name: "Edit " + item.name,
          to: "/edit/franchise/" + item.path
        });
      });
  },
  destroyed() {
    this.$store.commit("removeNav", "/edit/franchise/" + this.franchise.path);
  },
  methods: {
    back(evt: Event) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  },
  components: {
    WatchListItem
  }
});
</script>
