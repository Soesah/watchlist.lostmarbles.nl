<template>
  <div class="filters">
    <div class="filter">
      <label>Filter by name</label>
      <div class="filter-row">
        <input
          type="text"
          placeholder="Filter"
          v-model="filter.search"
          @input="updateSearch($event)"
        >
        <button class="clear" @click="clear" v-show="filter.search != ''">
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
        <li v-for="type in types" :key="type.name">
          <a
            href="javascript:void(0)"
            v-text="type.name"
            :class="{active: isActive(type)}"
            @click="setItemType(type.type);"
          ></a>
        </li>
      </ul>
    </div>
    <div class="filter" v-if="showMore">
      <label>Watched</label>
      <ul class="unselectable">
        <li v-for="state in states" :key="state.state">
          <a
            href="javascript:void(0)"
            v-text="state.name"
            :class="{active: filter.itemState === state.state}"
            @click="setItemState(state.state);"
          ></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  WatchItemFactory,
  Type,
  State,
  FilterType
} from "@/services/WatchItemFactory";

export default Vue.extend({
  name: "ListFilter",
  data() {
    return {
      filter: this.$store.state.filter,
      showMore: false,
      type: ""
    };
  },
  computed: {
    types(): FilterType[] {
      return WatchItemFactory.getFilterTypes();
    },
    states(): State[] {
      return WatchItemFactory.getFilterStates();
    }
  },
  methods: {
    updateSearch(evt: any) {
      this.$emit("input", evt.target ? evt.target.value : null);
    },
    clear() {
      this.filter.search = "";
    },
    isActive(type: Type) {
      return <number>this.filter.itemType === type.type;
    },
    setItemType(type: Type) {
      this.filter.itemType = type;
    },
    setItemState(state: State) {
      this.filter.itemState = state;
    }
  }
});
</script>
