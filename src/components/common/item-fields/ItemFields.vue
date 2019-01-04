<template>
  <section class="item-fields">
    <div class="form-item form-item-required">
      <label>Type</label>
      <choice v-model="item.type" :items="types"></choice>
      <svg
        class="select-arrow"
        width="100px"
        height="63px"
        viewBox="0 0 100 63"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="25.2873563 0 0 0 50 0 74.7126437 0 50 31.8333333"></polygon>
      </svg>
    </div>
    <div class="form-item form-item-required form-item-name">
      <label>Name</label>
      <div class="form-input-group">
        <input
          type="text"
          name="name"
          required
          autocomplete="off"
          v-focus
          placeholder="Name"
          v-model="item.name"
          @input="update"
        >
        <button
          class="search-button action"
          type="button"
          @click="search($event)"
          :disabled="searching || !item.name"
        >
          <i class="icon icon-search" v-show="!searching"></i>
          <i class="icon icon-spinner" v-show="searching"></i>
        </button>
        <ul class="suggestions" v-show="suggestions.length">
          <li v-for="suggestion in suggestions" :key="suggestion.Title">
            <a href="javascript:void(0)" @click="choose(suggestion)">
              <i :class="'icon icon-' + suggestion.Type"></i>
              <span v-text="suggestion.Title + '(' + suggestion.Year + ')'"></span>
            </a>
          </li>
          <li class="suggestions-count">
            There are
            <span v-text="totalSuggestions"></span> results
          </li>
        </ul>
      </div>
    </div>
    <div class="form-item form-item-required" v-if="!isSeries(item)">
      <label>Year</label>
      <input
        type="number"
        required="true"
        placeholder="2017"
        class="year"
        v-model.number="item.year"
        @input="update"
      >
    </div>
    <div class="form-item" v-if="isMovie(item) || isSeries(item) || isGame(item)">
      <label>Plot</label>
      <textarea placeholder="Plot" v-model="item.plot" @input="update"></textarea>
    </div>
    <div class="form-item" v-if="isMovie(item) || isDocumentary(item)">
      <label>Director</label>
      <input type="text" placeholder="Name" v-model="item.director" @input="update">
    </div>
    <div class="form-item" v-if="isMovie(item)">
      <label>Runtime</label>
      <input type="text" placeholder="100 min" class="length" v-model="item.length" @input="update">
    </div>
    <div class="form-item" v-if="isGame(item)">
      <label>Genre</label>
      <input type="text" placeholder="FPS" v-model="item.genre" @input="update">
    </div>
    <div class="form-item" v-if="isGame(item)">
      <label>Publisher</label>
      <input type="text" placeholder="..." v-model="item.publisher" @input="update">
    </div>
    <ul class="series-list" v-if="isSeries(item)">
      <li v-for="(season, index) in item.seasons" :key="season.nr">
        <div class="form-item form-item-required">
          <label>
            Season
            <span v-text="index + 1"></span> year
          </label>
          <div class="form-input-group">
            <input
              type="number"
              required="true"
              :placeholder="2017 + index"
              class="year"
              v-model.number="season.year"
            >
            <button
              class="update-button option"
              type="button"
              tooltip="'Update season episodes'|top"
              @click="updateSeason(item, season.nr)"
            >
              <i class="icon icon-series" v-show="!updating"></i>
              <i class="icon icon-spinner" v-show="updating"></i>
            </button>
            <button
              class="add-button option"
              type="button"
              tooltip="'Add a season'|top"
              @click="addSeason(season.year)"
              v-if="!item.finished"
            >
              <i class="icon icon-plus"></i>
            </button>
            <span class="bracketed season-episode-count" v-show="season.episodes.length">
              <span v-text="season.episodes.length"></span> episodes
            </span>
          </div>
        </div>
      </li>
    </ul>
    <div class="form-item form-item-checkbox" v-if="isSeries(item)">
      <input type="checkbox" id="item.finished" v-model="item.finished" @input="update">
      <label for="item.finished">Finished</label>
    </div>
    <list-input :label="'Actors'" :placeholder="'Actor'" v-model="item.actors" @input="update"></list-input>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Choice from "@/components/common/choice/Choice.vue";
import ListInput from "@/components/common/list-input/ListInput.vue";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import watchlistService from "@/services/WatchlistService";
import omdbApiService from "@/services/OMDbApiService";
import { WatchlistType } from "@/core/models/BaseModel";
import { Season } from "@/models/SeasonModel";
import { DateTimeUtil } from "@/core/util/DateTimeUtil";
import { Series } from "@/models/SeriesModel";
import { OMDbObject } from "@/models/OMDbObjectModel";

interface ItemFieldsData {
  item: WatchlistItems;
  searching: boolean;
  updating: boolean;
  suggestions: any[];
  totalSuggestions: number;
}

export default Vue.extend({
  name: "ItemFields",
  props: {
    value: {
      type: Object
    }
  },
  data(): ItemFieldsData {
    return {
      item: WatchItemFactory.create(this.value),
      searching: false,
      updating: false,
      suggestions: [],
      totalSuggestions: 0
    };
  },
  computed: {
    types() {
      return WatchItemFactory.getTypeList().filter(
        item => item.type !== WatchlistType.Franchise
      );
    }
  },
  watch: {
    value: {
      // handle parent component updates to value
      handler() {
        this.item = WatchItemFactory.create(this.value);
      },
      deep: true
    },
    "item.type": function(type) {
      WatchItemFactory.change(this.item, type).then((item: any) => {
        this.item = item;
        this.update();
      });
    }
  },
  methods: {
    // update parent component item
    update() {
      this.$emit("input", this.item);
    },
    search() {
      this.searching = true;
      // don't find without a name
      if (this.item && this.item.name) {
        this.searching = true;
        const year =
          this.item.type !== WatchlistType.Franchise
            ? this.item.year
            : DateTimeUtil.year();
        omdbApiService.search(this.item.name, year.toString()).then(
          (data: any) => {
            this.searching = false;
            this.suggestions = data.results;
            this.totalSuggestions = data.count;
          },
          (response: any) => {
            this.searching = false;
          }
        );
      }
    },
    choose(suggestion: { imdbID: string }) {
      let imdbId = suggestion.imdbID,
        date_added = this.item.date_added;
      this.searching = true;
      this.suggestions = [];

      // first use the omdb api to get the full data for the movie, series or game
      omdbApiService.get(imdbId).then(
        (data: OMDbObject) => {
          this.searching = false;
          WatchItemFactory.change(null, data.getInternalType()).then(
            (item: any) => {
              let year = parseInt(data.year);

              item.imdbId = data.imdbId;
              item.name = data.title;
              item.date_added = date_added;
              item.actors = data.actors.split(",").map(actor => {
                return actor.trim();
              });
              if (this.isMovie(item)) {
                item.plot = data.plot;
                item.director = data.director;
                item.length = data.runtime;
              } else if (this.isGame(item)) {
                item.plot = data.plot;
              }
              if (this.isSeries(item)) {
                item.plot = data.plot;
                // add a season for the first year
                // parse year, since values can be '2016-'
                item.addSeason(year);
                // try adding seasons for subsequent years
                // while (item.seasons.length < data.seasons) {
                //   item.addSeason(year + item.seasons.length);
                // }
              } else {
                item.year = year;
              }
              this.item = item;
              this.update();
            }
          );
        },
        () => {
          this.searching = false;
        }
      );
    },
    isDocumentary(item: any): boolean {
      return item.type === WatchlistType.Documentary;
    },
    isGame(item: any): boolean {
      return item.type === WatchlistType.Game;
    },
    isMovie(item: any): boolean {
      return item.type === WatchlistType.Movie;
    },
    isSeries(item: any): boolean {
      return item.type === WatchlistType.Series;
    },
    updateSeason(season: Season, nr: number) {
      this.updating = true;
      omdbApiService.updateSeason(<Series>this.item, nr).then(_ => {
        this.updating = false;
        this.update();
      });
    },
    addSeason(year: string) {
      (<Series>this.item).addSeason(year ? parseInt(year) + 1 : null);
      this.update();
    },
    getTypeName(item: any) {
      return WatchItemFactory.getTypeName(item);
    }
  },
  components: {
    Choice,
    ListInput
  }
});
</script>
