<template>
  <form class="form" @submit="add">
    <h2>Add</h2>
    <p>Add a movie, documentary or series to the watchlist</p>

    <item-fields v-model="item"></item-fields>

    <div class="message form-message warning" v-if="doubles.length">
      <i class="icon icon-warning"></i>
      <div class="message-content">
        <p>Did you mean the following?</p>
        <ul>
          <li v-for="double in doubles" :key="double.imdbID">
            <span v-text="double.name"></span>
            <span class="bracketed" v-text="double.year"></span>,
            <span v-text="getTypeName(double)"></span>
          </li>
        </ul>
      </div>
    </div>

    <div class="buttons">
      <button type="submit">Add</button>
      <button type="cancel" @click="back">Cancel</button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory } from "@/services/WatchItemFactory";
import ItemFields from "@/components/common/item-fields/ItemFields.vue";

export default Vue.extend({
  name: "WatchAddView",
  data() {
    return {
      item: WatchItemFactory.new(),
      suggestions: [],
      doubles: []
    };
  },
  watch: {
    "item.name": function(name) {
      this.doubles = [];
      this.suggestions = [];

      if (name.length > 2) {
        let suggestions = this.$store.state.items.filter((item: any) => {
          return item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        });

        suggestions.sort(function(a: any, b: any) {
          if (
            a.name.toLowerCase().indexOf(name) ===
            b.name.toLowerCase().indexOf(name)
          ) {
            return a.name.length < b.name.length ? -1 : 1;
          } else if (a.name.toLowerCase().indexOf(name) === 0) {
            return -1;
          } else if (b.name.toLowerCase().indexOf(name) === 0) {
            return 1;
          } else {
            return a.year < b.year ? -1 : 1;
          }
        });

        if (suggestions.length) {
          this.doubles = suggestions.splice(0, 3);
        }
      }
    }
  },
  created() {
    this.$store.dispatch("getWatchList");
  },
  methods: {
    add(evt: Event) {
      this.$store
        .dispatch("addItem", this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
      return false;
    },
    back(evt: Event) {
      this.$router.go(-1);
      evt.preventDefault();
    },
    getTypeName(item: any) {
      return WatchItemFactory.getTypeName(item);
    }
  },
  components: {
    ItemFields
  }
});
</script>
