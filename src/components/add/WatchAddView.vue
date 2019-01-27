<template>
  <form class="form" @submit.prevent="add">
    <h2>Add</h2>
    <p>Add a movie, documentary or series to the watchlist</p>

    <item-fields v-model="item"></item-fields>

    <div class="message form-message warning" v-if="doubles.length">
      <i class="icon icon-warning"></i>
      <div class="message-content">
        <p>Did you mean the following?</p>
        <ul>
          <li v-for="double in doubles" :key="double.imdbID">
            <span v-text="double.title"></span>
            <span class="bracketed" v-text="double.year"></span>,
            <span v-text="getTypeName(double)"></span>
          </li>
        </ul>
      </div>
    </div>

    <div class="buttons">
      <button type="submit">Add</button>
      <button type="cancel" @click.prevent="back">Cancel</button>
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
    "item.title": function(title) {
      this.doubles = [];
      this.suggestions = [];

      if (title.length > 2) {
        let suggestions = this.$store.state.items.filter((item: any) => {
          return item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1;
        });

        suggestions.sort((a: any, b: any) => {
          if (
            a.title.toLowerCase().indexOf(title) ===
            b.title.toLowerCase().indexOf(title)
          ) {
            return a.title.length < b.title.length ? -1 : 1;
          } else if (a.title.toLowerCase().indexOf(title) === 0) {
            return -1;
          } else if (b.title.toLowerCase().indexOf(title) === 0) {
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
    async add() {
      await this.$store.dispatch("addItem", this.item);
      this.$router.push(`/view/${this.item.path}`);
    },
    back() {
      this.$router.go(-1);
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
