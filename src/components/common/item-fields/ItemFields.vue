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
      <label>Title</label>
      <div class="form-input-group">
        <input
          type="text"
          name="title"
          required
          autocomplete="off"
          v-focus
          placeholder="Title"
          v-model="item.title"
          @input="update"
        >
        <button
          class="search-button action"
          type="button"
          @click="search($event)"
          :disabled="searching || !item.title"
        >
          <i class="icon icon-search" v-show="!searching"></i>
          <i class="icon icon-spinner" v-show="searching"></i>
        </button>
        <ul class="suggestions" v-show="suggestions.length">
          <li v-for="suggestion in suggestions" :key="`${suggestion.title}-${suggestion.year}`">
            <a href="javascript:void(0)" @click="choose(suggestion)">
              <i :class="'icon icon-' + getTypeName(suggestion.type)"></i>
              <span v-text="suggestion.title + '(' + suggestion.year + ')'"></span>
            </a>
          </li>
          <li class="suggestions-count">
            There are
            <span v-text="count"></span> results
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
              @click="updateSeasons(item)"
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
import omdbService from "@/services/OMDBService";
import { WatchlistType } from "@/core/models/BaseModel";
import { Season } from "@/models/SeasonModel";
import { DateTimeUtil } from "@/core/util/DateTimeUtil";
import { Series } from "@/models/SeriesModel";
import { ResultItem } from "@/models/ResultItemModel";
import { Results } from "@/models/ResultsModel";

interface ItemFieldsData {
  item: WatchlistItems;
  searching: boolean;
  updating: boolean;
  suggestions: any[];
  count: number;
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
      count: 0
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
      if (this.item && this.item.title) {
        this.searching = true;
        const year =
          this.item.type !== WatchlistType.Franchise
            ? this.item.year
            : DateTimeUtil.year();
        omdbService.search(this.item.title, year ? year : null).then(
          (res: Results) => {
            this.searching = false;
            this.suggestions = res.results;
            this.count = res.count;
          },
          () => {
            this.searching = false;
          }
        );
      }
    },
    choose(suggestion: { imdbID: string }) {
      let imdbID = suggestion.imdbID,
        date_added = this.item.date_added;
      this.searching = true;
      this.suggestions = [];

      // first use the omdb api to get the full data for the movie, series or game
      omdbService.get(imdbID).then(
        (data: ResultItem) => {
          this.searching = false;
          WatchItemFactory.change(null, data.type).then((item: any) => {
            let year = data.year;

            item.imdbID = data.imdbID;
            item.title = data.title;
            item.date_added = date_added;
            item.actors = data.actors;
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
          });
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
    async updateSeasons(season: Season, nr: number) {
      this.updating = true;
      const seasons = await omdbService.updateSeasons(<Series>this.item);
      this.updating = false;
      this.update();
      (<Series>this.item).seasons = seasons;
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
