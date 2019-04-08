<template>
  <div class="filters" v-if="filterSettings">
    <div class="filter">
      <label>Filter by name</label>
      <div class="filter-row">
        <input
          type="text"
          placeholder="Filter"
          v-model="filterSettings.search"
          @input="updateSearch($event)"
        >
        <button class="clear" @click="clear" v-show="filterSettings.search != ''">
          <i class="icon icon-delete"></i>
        </button>
        <button
          type="button"
          :class="['advanced option icon-only ', {active: showMore}]"
          @click="showMore = !showMore;"
        >
          <i class="icon icon-cogs"></i>
        </button>
      </div>
    </div>
    <div class="filter" v-if="showMore">
      <label>Filter by type</label>
      <ul class="unselectable">
        <li>
          <a
            href="#"
            :class="{ active: filterSettings.itemTypes.length === 0 }"
            @click.prevent="resetItemTypes();"
          >All</a>
        </li>
        <li v-for="type in types" :key="type.name">
          <a
            href="#"
            v-text="type.name"
            :class="{ active: filterSettings.itemTypes.includes(type.value) }"
            @click.prevent="toggleItemType(type.value);"
          ></a>
        </li>
      </ul>
    </div>
    <div class="filter" v-if="showMore">
      <label>Watched</label>
      <ul class="unselectable">
        <li>
          <a
            href="#"
            :class="{ active: filterSettings.itemStates.length === 0 }"
            @click.prevent="resetItemStates();"
          >Both</a>
        </li>
        <li v-for="state in states" :key="state.state">
          <a
            href="#"
            v-text="state.name"
            :class="{ active: filterSettings.itemStates.includes(state.value) }"
            @click.prevent="setItemState(state.value);"
          ></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, Type, State } from "@/services/WatchItemFactory";
import { mapState } from "vuex";
import { Filter } from "../../store";
import { WatchlistType } from "../../core/models/BaseModel";

export default Vue.extend({
  name: "ListFilter",
  data() {
    return {
      showMore: false,
      filterSettings: <Filter>{
        search: "",
        itemTypes: [],
        itemStates: []
      }
    };
  },
  computed: {
    types(): Type[] {
      return WatchItemFactory.getTypeList();
    },
    states(): State[] {
      return WatchItemFactory.getFilterStates();
    },
    ...mapState(["filter"])
  },
  watch: {
    filter(newValue) {
      this.filterSettings = Object.assign({}, newValue);
    }
  },
  created() {
    this.clear();
  },
  methods: {
    updateSearch(evt: any) {
      this.$store.commit("setFilterSearch", evt.target ? evt.target.value : "");
    },
    clear() {
      this.$store.commit("setFilterSearch", "");
    },
    toggleItemType(type: WatchlistType) {
      this.$store.commit("toggleItemType", type);
    },
    resetItemTypes() {
      this.$store.commit("resetItemTypes");
    },
    setItemState(state: State) {
      this.$store.commit("setItemState", state);
    },
    resetItemStates() {
      this.$store.commit("resetItemStates");
    }
  }
});
</script>
