<template>
  <form class="form" @submit="edit">
    <h2>Edit</h2>
    <p>
      Update and complete the information for this
      <span v-text="getTypeName(item)"></span>
    </p>

    <item-fields :state-item="stateItem" v-model="item"></item-fields>

    <div class="buttons">
      <button type="submit">Edit</button>
      <button type="button" class="danger" @click="remove">Delete</button>
      <button type="cancel" @click="back">Cancel</button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import ItemFields from "@/components/common/item-fields/ItemFields.vue";
import ConfirmDeleteModal from "@/components/edit/ConfirmDeleteModal.vue";

export default Vue.extend({
  name: "WatchEditView",
  data() {
    return {
      item: WatchItemFactory.new()
    };
  },
  computed: {
    // needed to listen to state's item
    stateItem(): WatchlistItems {
      let item = WatchItemFactory.new();
      if (this.$store.state.item.title) {
        item = this.$store.state.item.clone();
        /* eslint-disable vue/no-side-effects-in-computed-properties */
        this.item = item;
      }
      return item;
    }
  },
  created() {
    this.$store
      .dispatch("getItemByName", this.$route.params.path)
      .then(item => {
        this.$store.commit("addNav", {
          name: "Edit " + item.title,
          to: "/edit/" + item.path
        });
      });
  },
  destroyed() {
    this.$store.commit("removeNav", "/edit/" + this.item.path);
  },
  methods: {
    edit(evt: Event) {
      this.$store
        .dispatch("editItem", this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
    },
    remove(evt: Event) {
      this.$store.state.event.$emit("openModal", {
        modal: "confirm-delete-modal",
        name: this.item.title,
        confirm: this.onConfirmDelete
      });

      evt.preventDefault();
    },
    onConfirmDelete() {
      this.$store.dispatch("removeItem", this.item).then(items => {
        this.$destroy();
        this.$router.push("/");
      });
    },
    back(evt: Event) {
      this.$router.go(-1);
      evt.preventDefault();
    },
    getTypeName(item: WatchlistItems): string {
      return WatchItemFactory.getTypeName(item).toLowerCase();
    }
  },
  components: {
    ItemFields,
    /* eslint-disable vue/no-unused-components */
    ConfirmDeleteModal
  }
});
</script>
