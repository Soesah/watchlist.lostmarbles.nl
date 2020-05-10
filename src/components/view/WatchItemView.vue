<template>
  <section class="view">
    <h2 v-text="item.title"></h2>

    <h3>
      <span v-text="item.year"></span>
      <span v-show="item.lastYear && item.lastYear !== item.year">
        –
        <span v-text="item.lastYear"></span>
      </span>
      <span v-show="item.finished" class="bracketed">Finished</span>&nbsp;
      <span v-text="typeName"></span>
      <span v-show="item.imdbID && !~item.imdbID.indexOf('NON')" class="dashed">
        <a :href="'http://www.imdb.com/title/' + item.imdbID" target="_new">IMDB</a>
      </span>
    </h3>
    <div v-show="item.watched && item.date_watched">
      <h4 v-show="!isGame">Watched</h4>
      <h4 v-show="isGame">Played</h4>
      <p>{{item.date_watched | watchedDate}}</p>
    </div>
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
        <li v-for="(season, index) in item.seasons" :key="`${season.nr}-${season.year}-${index}`">
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
import Vue from 'vue';
import { WatchItemFactory, WatchlistItems } from '@/services/WatchItemFactory';
import ItemFranchiseView from '@/components/franchises/ItemFranchiseView.vue';
import { Season } from '@/models/SeasonModel';
import { Episode } from '@/models/EpisodeModel';
import { WatchlistType } from '@/core/models/BaseModel';

export default Vue.extend({
  name: 'WatchItemView',
  computed: {
    item(): WatchlistItems {
      return this.$store.state.item;
    },
    typeName(): string {
      return WatchItemFactory.getTypeName(this.item);
    },
    isGame(): boolean {
      return this.item.type === WatchlistType.Game;
    },
  },
  beforeRouteUpdate: function(to, from, next) {
    this.$store.commit('removeNav', '/edit/' + from.params.path);
    this.$store.dispatch('getItemByPath', to.params.path).then((item) => {
      this.$store.commit('addNav', {
        name: 'Edit ' + item.title,
        to: '/edit/' + item.path,
      });
    });
    next();
  },
  created() {
    this.$store
      .dispatch('getItemByPath', this.$route.params.path)
      .then((item) => {
        this.$store.commit('addNav', {
          name: 'Edit ' + item.title,
          to: '/edit/' + item.path,
        });
      });
  },
  destroyed() {
    this.$store.commit('removeNav', '/edit/' + this.item.path);
  },
  methods: {
    async toggleSeasonWatched(season: Season) {
      await this.$store.dispatch('toggleSeasonWatched', {
        item: this.item,
        season: season,
      });
      this.$store.dispatch('getItemByPath', this.$route.params.path);
    },
    async toggleEpisodeWatched(season: Season, episode: Episode) {
      await this.$store.dispatch('toggleEpisodeWatched', {
        item: this.item,
        season: season,
        episode: episode,
      });
      this.$store.dispatch('getItemByPath', this.$route.params.path);
    },
  },
  filters: {
    watchedDate(val: string): string {
      const d = new Date(val);
      const day = `${d.getDate()}`.padStart(2, '0');
      const month = `${d.getMonth() + 1}`.padStart(2, '0');

      return `${day}-${month}-${d.getFullYear()}`;
    },
  },
  components: {
    ItemFranchiseView,
  },
});
</script>
