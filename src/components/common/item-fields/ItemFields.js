import Focus from 'directives/Focus';
import WatchItemFactory from 'services/WatchItemFactory';
import watchlistService from 'services/WatchlistService';
import omdbApiService from 'services/OMDbApiService';

let ItemFields = Vue.component('item-fields', {
  template:`<section class="item-fields">
              <div class="form-item form-item-required">
                <label>Type</label>
                <select v-model="item.type">
                  <option v-for="type in types" :value="type.type" v-text="type.name"></option>
                </select>
                <svg class="select-arrow" width="100px" height="63px" viewBox="0 0 100 63" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="25.2873563 0 0 0 50 0 74.7126437 0 50 31.8333333"></polygon>
                </svg>
              </div>
              <div class="form-item form-item-required form-item-name">
                <label>Name</label>
                <div class="form-input-group">
                  <input type="text" name="name" required autocomplete="off" v-focus placeholder="Name" v-model="item.name" @input="update"/>
                  <button class="search-button action" type="button" @click="search($event)" :disabled="searching || !item.name">
                    <i class="icon icon-search" v-show="!searching"></i>
                    <i class="icon icon-spinner" v-show="searching"></i>
                  </button>
                  <ul class="suggestions" v-show="suggestions.length">
                    <li v-for="suggestion in suggestions">
                      <a href="javascript:void(0)" @click="choose(suggestion)">
                        <i :class="'icon icon-' + suggestion.Type"></i>
                        <span v-text="suggestion.Title + '(' + suggestion.Year + ')'"></span>
                      </a>
                    </li>
                    <li class="suggestions-count">There are <span v-text="totalSuggestions"></span> results</li>
                  </ul>
                </div>
              </div>
              <div class="form-item form-item-required" v-if="!isSeries(item)">
                <label>Year</label>
                <input type="number" required="true" placeholder="2017" class="year" v-model.number="item.year" @input="update"/>
              </div>
              <div class="form-item" v-if="isMovie(item) || isSeries(item) || isGame(item)">
                <label>Plot</label>
                <textarea placeholder="Plot" v-model="item.plot" @input="update"></textarea>
              </div>
              <div class="form-item" v-if="isMovie(item) || isDocumentary(item)">
                <label>Director</label>
                <input type="text" placeholder="Name" v-model="item.director" @input="update"/>
              </div>
              <div class="form-item" v-if="isMovie(item)">
                <label>Runtime</label>
                <input type="text" placeholder="100 min" class="length" v-model="item.length" @input="update"/>
              </div>
              <div class="form-item" v-if="isGame(item)">
                <label>Genre</label>
                <input type="text" placeholder="FPS" v-model="item.genre" @input="update"/>
              </div>
              <div class="form-item" v-if="isGame(item)">
                <label>Publisher</label>
                <input type="text" placeholder="..." v-model="item.publisher" @input="update"/>
              </div>
              <ul class="series-list" v-if="isSeries(item)">
                <li v-for="(season, index) in item.seasons">
                  <div class="form-item form-item-required">
                    <label>Season <span v-text="index + 1"></span> year</label>
                    <div class="form-input-group">
                      <input type="number" required="true" :placeholder="2017 + index" class="year" v-model.number="season.year" />
                      <button class="update-button option" type="button" tooltip="'Update season episodes'|top"  @click="updateSeason(item, season.nr)">
                        <i class="icon icon-series" v-show="!updating"></i>
                        <i class="icon icon-spinner" v-show="updating"></i>
                      </button>
                      <button class="add-button option" type="button"  tooltip="'Add a season'|top" @click="addSeason(season.year)" v-if="!item.finished">
                        <i class="icon icon-plus"></i>
                      </button>
                      <span class="bracketed season-episode-count" v-show="season.episodes.length"><span v-text="season.episodes.length"></span> episodes</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="form-item form-item-checkbox"  v-if="isSeries(item)">
                <input type="checkbox" id="item.finished" v-model="item.finished" @input="update"/><label for="item.finished">Finished</label>
              </div>
              <div class="form-item" v-if="!isDocumentary(item)">
                <label>Actors</label>
                <input type="text" placeholder="Actor, actor" v-model="item.actors" @input="update"/>
              </div>
            </section>`,
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      item: WatchItemFactory.create(this.value),
      searching: false,
      updating: false,
      suggestions: [],
      totalSuggestions: 0
    }
  },
  computed: {
    types() {
      return WatchItemFactory.getTypeList();
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
    'item.type': function(type) {
      WatchItemFactory.change(this.item, type).then(item => {
        this.item = item;
        this.update();
      });
    }
  },
  methods: {
    // update parent component item
    update() {
      this.$emit('input', this.item);
    },
    search() {
      this.searching = true;
      // don't find without a name
      if (this.item.name) {
        this.searching = true;
        omdbApiService.search(this.item.name, this.item.year).then(data => {
          this.searching = false;
          this.suggestions = data.results;
          this.totalSuggestions = data.count;
        }, response => {
          this.searching = false;
        });
      }
    },
    choose(suggestion) {
      let imdbId = suggestion.imdbID,
          date_added = this.item.date_added;
      this.searching = true;
      this.suggestions = [];

      // first use the omdb api to get the full data for the movie, series or game
      omdbApiService.get(imdbId).then(data => {
        this.searching = false;
        WatchItemFactory.change(null, data.getInternalType()).then(item => {
          let year = parseInt(data.year);

          this.itemType = item.type;
          item.imdbId = data.imdbId;
          item.name = data.title;
          item.date_added = date_added;
          item.actors = data.actors.split(',').map(actor => {
            return actor.trim();
          });
          if (this.isMovie(item)) {
            item.plot = data.plot;
            item.director = data.director;
            item.length = data.runtime;
            item.watched = !!data.watched;
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

      }, function() {
        this.searching = false;
      });
    },
    isDocumentary(item) {
      return item.type === WatchItemFactory.DOCUMENTARY;
    },
    isGame(item) {
      return item.type === WatchItemFactory.GAME;
    },
    isMovie(item) {
      return item.type === WatchItemFactory.MOVIE;
    },
    isSeries(item) {
      return item.type === WatchItemFactory.SERIES;
    },
    updateSeason(season, nr) {
      this.updating = true;
      omdbApiService.updateSeason(this.item, nr).then(response => {
        this.updating = false;
        this.update();
      });
    },
    addSeason(year) {
      this.item.addSeason(year ? parseInt(year) + 1 : null);
      this.update();
    },
    getTypeName(item) {
      return WatchItemFactory.getTypeName(item);
    }    
  }
});