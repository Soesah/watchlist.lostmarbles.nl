<template>
  <form class="form add-franchise" @submit="add">
    <h2>Add a franchise</h2>
    <p>Add a franchise to group movies, series and other.</p>

    <franchise-item-fields v-model="franchise"></franchise-item-fields>

    <div class="buttons">
      <button type="submit">Add</button>
      <button type="cancel" @click="back">Cancel</button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory } from "@/services/WatchItemFactory";
import { WatchlistType } from "@/core/models/BaseModel";
import FranchiseItemFields from "@/components/common/item-fields/FranchiseItemFields.vue";

export default Vue.extend({
  name: "FranchiseAddView",
  data() {
    return {
      franchise: WatchItemFactory.new(WatchlistType.Franchise)
    };
  },
  created() {
    this.$store.commit("addNav", {
      name: "Add a franchise",
      to: "/franchises/add/"
    });
    this.$store.dispatch("getWatchList");
  },
  destroyed() {
    this.$store.commit("removeNav", "/franchises/add");
  },
  methods: {
    add(evt: Event) {
      this.$store
        .dispatch("addItem", this.franchise)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
      return false;
    },
    back(evt: Event) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  },
  components: {
    FranchiseItemFields
  }
});
</script>
