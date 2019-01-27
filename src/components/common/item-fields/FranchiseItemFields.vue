<template>
  <section class="item-fields">
    <div class="form-item form-item-required">
      <label>Name</label>
      <input
        type="text"
        required="true"
        v-focus
        placeholder="Name"
        v-model="franchise.name"
        @input="update"
      >
    </div>
    <div class="form-item form-item-name">
      <label>Search</label>
      <div class="form-input-group">
        <input type="text" v-if="choice" name="name" readonly v-model="choice.name">
        <input
          type="text"
          v-if="!choice"
          name="name"
          autocomplete="off"
          placeholder="Search"
          v-model="search"
          @input="searchItem"
        >
        <button
          class="search-button action"
          type="button"
          @click="addItem($event)"
          :disabled="!choice"
        >
          <i class="icon icon-plus"></i>
        </button>
        <ul class="suggestions" v-show="suggestions.length && !choice">
          <li v-for="suggestion in suggestions" :key="suggestion.title">
            <a href="#" @click="chooseItem($event, suggestion)">
              <i :class="'icon icon-' + getTypeName(suggestion)"></i>
              <span v-text="suggestion.title + '(' + suggestion.year + ')'"></span>
            </a>
          </li>
          <li class="suggestions-button">
            <button type="button" class="action" @click="chooseAll">Add all</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-item" v-show="items.length">
      <label>Items</label>
      <ul class="franchise-items list">
        <li v-for="item in items" :key="item.title">
          <p>
            <i :class="'icon icon-' + getTypeName(item)"></i>
            <span v-text="item.title"></span>
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import { Franchise } from "@/models/FranchiseModel";

interface FranchiseItemFieldsData {
  franchise: Franchise;
  search: string;
  suggestions: any[];
  choice: WatchlistItems | null;
}

export default Vue.extend({
  name: "FranchiseItemFields",
  props: {
    value: {
      type: Object
    }
  },
  data(): FranchiseItemFieldsData {
    return {
      franchise: <Franchise>WatchItemFactory.create(this.value),
      search: "",
      suggestions: [],
      choice: null
    };
  },
  computed: {
    items: function() {
      return this.$store.getters.franchiseItems(this.franchise.items);
    }
  },
  watch: {
    value: {
      // handle parent component updates to value
      handler() {
        this.franchise = <Franchise>WatchItemFactory.create(this.value);
      },
      deep: true
    }
  },
  methods: {
    // update parent component item
    update() {
      this.$emit("input", this.franchise);
    },
    searchItem() {
      // don't find without a name
      if (this.search) {
        this.suggestions = this.$store.getters.searchItems(
          this.search,
          this.franchise.items
        );
      } else {
        this.suggestions = [];
      }
    },
    chooseItem(evt: Event, item: any) {
      this.choice = item;
      evt.preventDefault();
    },
    chooseAll(evt: Event) {
      this.suggestions.forEach(suggestion => {
        this.franchise.addItem(suggestion);
      });
      this.update();
      this.search = "";
      this.searchItem();
      evt.preventDefault();
    },
    addItem() {
      if (this.choice !== null) {
        const item = this.choice;
        this.franchise.addItem(item);
        this.update();
        this.searchItem();
      }
      this.choice = null;
    },
    getTypeName(item: any) {
      return WatchItemFactory.getTypeName(item);
    }
  }
});
</script>
