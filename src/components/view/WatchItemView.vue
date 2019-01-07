<template>
  <section class="view">
    <h2 v-text="item.name"></h2>

    <h3>
      <span v-text="item.year"></span>
      <span v-show="item.lastYear && item.lastYear !== item.year">
        –
        <span v-text="item.lastYear"></span>
      </span>
      <span v-show="item.finished" class="bracketed">Finished</span>
      <span v-text="typeName"></span>
      <span v-show="item.imdbId && !~item.imdbId.indexOf('NON')" class="dashed">
        <a :href="'http://www.imdb.com/title/' + item.imdbId" target="_new">IMDB</a>
      </span>
    </h3>

    <div class="actors" v-show="item.actors && item.actors.length">
      <h4>Actors</h4>
      <ul>
        <li v-for="actor in item.actors" :key="actor" v-text="actor"></li>
      </ul>
    </div>

    <div v-show="item.director">
      <h4>Director</h4>
      <p v-text="item.director"></p>
    </div>
    <div v-show="item.length">
      <h4>Runtime</h4>
      <p v-text="item.length"></p>
    </div>
    <div v-show="item.plot">
      <h4>Plot</h4>
      <p v-text="item.plot"></p>
    </div>
    <div v-show="item.genre">
      <h4>Genre</h4>
      <p v-text="item.genre"></p>
    </div>
    <div v-show="item.publisher">
      <h4>Publisher</h4>
      <p v-text="item.publisher"></p>
    </div>

    <div v-if="item.seasons && item.seasons.length">
      <h4 v-show="item.seasons.length > 1">Seasons</h4>
      <ul class="seasons">
        <li v-for="season in item.seasons" :key="season.nr">
          <h5 class="season-title">
            <span v-show="item.seasons.length > 1">
              Season
              <span v-text="season.nr"></span>
            </span>
            <span class="season-year bracketed" v-text="season.year"></span>
            <i class="icon icon-series" @click="toggleSeasonWatched(season)"></i>
            <router-link :to="'/edit/' + item.path + '/season/' + season.nr">Edit</router-link>
          </h5>
          <ul class="episodes">
            <li v-for="episode in season.episodes" :key="episode.nr">
              <p class="episode-title" :class="{'episode-watched': episode.watched}">
                <span v-text="episode.nr" class="episode-nr"></span>
                <span class="episode-name" v-text="episode.title"></span>
                <i class="icon icon-series" @click="toggleEpisodeWatched(season, episode)"></i>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <item-franchise-view :item="item"></item-franchise-view>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import ItemFranchiseView from "@/components/franchises/ItemFranchiseView.vue";
import { Season } from "@/models/SeasonModel";
import { Episode } from "@/models/EpisodeModel";

export default Vue.extend({
  name: "WatchItemView",
  computed: {
    item(): WatchlistItems {
      return this.$store.state.item;
    },
    typeName(): string {
      return WatchItemFactory.getTypeName(this.item);
    }
  },
  beforeRouteUpdate: function(to, from, next) {
    this.$store.commit("removeNav", "/edit/" + from.params.path);
    this.$store.dispatch("getItemByName", to.params.path).then(item => {
      this.$store.commit("addNav", {
        name: "Edit " + item.name,
        to: "/edit/" + item.path
      });
    });
    next();
  },
  created() {
    this.$store
      .dispatch("getItemByName", this.$route.params.path)
      .then(item => {
        this.$store.commit("addNav", {
          name: "Edit " + item.name,
          to: "/edit/" + item.path
        });
      });
  },
  destroyed() {
    this.$store.commit("removeNav", "/edit/" + this.item.path);
  },
  methods: {
    toggleSeasonWatched(season: Season) {
      this.$store.dispatch("toggleSeasonWatched", {
        item: this.item,
        season: season
      });
    },
    toggleEpisodeWatched(season: Season, episode: Episode) {
      this.$store.dispatch("toggleEpisodeWatched", {
        item: this.item,
        season: season,
        episode: episode
      });
    }
  }
});
</script>