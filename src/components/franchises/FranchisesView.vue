<template>
  <section class="franchises">
    <h2>Franchises</h2>
    <p>A list of franchises.</p>

    <ul class="list">
      <li
        class="item"
        v-for="franchise in franchises"
        :franchise="franchise"
        :key="franchise.imdbID"
      >
        <router-link :to="'/view/franchise/' + franchise.path">
          <h6 v-text="franchise.name"></h6>
          <span class="bracketed" v-text="franchise.items.length"></span>
        </router-link>
      </li>
    </ul>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { Franchise } from "@/models/FranchiseModel";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "FranchisesView",
  created() {
    this.$store.dispatch("getWatchList").then(item => {
      this.$store.commit("addNav", {
        name: "Add a franchise",
        to: "/franchises/add/"
      });
    });
  },
  destroyed() {
    this.$store.commit("removeNav", "/franchises/add");
  },
  computed: {
    ...mapGetters(["franchises"])
  }
});
</script>
