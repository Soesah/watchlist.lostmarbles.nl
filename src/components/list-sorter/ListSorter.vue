<template>
  <p class="sorting" v-if="options">
    Sort by
    <ul>
      <li v-for="option in options" :key="option.name">
        <a href="#" :class="{ active: sortOptions.includes(option.name), disabled: option.name === 'Name' }" @click.prevent="toggleItemSorting(option.name)" v-text="option.name"></a>
      </li>
    </ul>
  </p>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, Type, State, Sort } from "@/services/WatchItemFactory";
import { mapState } from "vuex";

export default Vue.extend({
  name: "ListSorter",
  computed: {
    options(): Sort[] {
      return WatchItemFactory.getSortOptions();
    },
    ...mapState(["sortOptions"])
  },
  methods: {
    toggleItemSorting(option: string) {
      if (option !== 'Name') {
        this.$store.commit("toggleItemSorting", option);
      }
    },
    resetItemTypes() {
      this.$store.commit("resetItemSorting");
    },
  }
});
</script>
