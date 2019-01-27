<template>
  <form class="form add-franchise" @submit.prevent="edit">
    <h2>Edit a franchise</h2>
    <p>
      Update and complete the information for this
      <span v-text="getTypeName(item)"></span>
    </p>

    <franchise-item-fields :state-item="stateItem" v-model="item"></franchise-item-fields>

    <div class="buttons">
      <button type="submit">Edit</button>
      <button type="cancel" @click="back">Cancel</button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import FranchiseItemFields from "@/components/common/item-fields/FranchiseItemFields.vue";
import { Franchise } from "@/models/FranchiseModel";
import { WatchlistType } from "@/core/models/BaseModel";

export default Vue.extend({
  name: "WatchFranchiseEditView",
  data() {
    return {
      item: WatchItemFactory.new(WatchlistType.Franchise)
    };
  },
  computed: {
    // needed to listen to state's item
    stateItem(): Franchise {
      let item = <Franchise>WatchItemFactory.new(WatchlistType.Franchise);
      if (this.$store.state.item.name) {
        item = this.$store.state.item.clone();
        // set this item as the data item, to allow mutation
        this.item = item;
      }
      return item;
    }
  },
  created() {
    this.$store
      .dispatch("getItemByPath", this.$route.params.path)
      .then(item => {
        this.$store.commit("addNav", {
          name: "Edit " + item.name,
          to: "/edit/franchise/" + item.path
        });
      });
  },
  destroyed() {
    this.$store.commit("removeNav", "/edit/franchise/" + this.item.path);
  },
  methods: {
    edit() {
      this.$store
        .dispatch("editItem", this.item)
        .then(items => this.$router.go(-1));
    },
    back() {
      this.$router.go(-1);
    },
    getTypeName(item: WatchlistItems): string {
      return WatchItemFactory.getTypeName(item).toLowerCase();
    }
  },
  components: {
    FranchiseItemFields
  }
});
</script>
