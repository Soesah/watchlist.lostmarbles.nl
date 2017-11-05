import WatchItemFactory from 'services/WatchItemFactory';

let WatchAddView = Vue.component('watch-add-view', {
  template:`<div>
              <h2>Add</h2>
              <p>Add a movie, documentary or series to the watchlist</p>

              <div ng-controller="FormFieldsController">
              <div class="form-item form-item-required">
                <label>Type</label><select ng-model="itemType" ng-options="type.type as type.name disable when type.disabled for type in types"></select>
                <svg class="select-arrow" width="100px" height="63px" viewBox="0 0 100 63" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="25.2873563 0 0 0 50 0 74.7126437 0 50 31.8333333"></polygon>
                </svg>
              </div>
                <div class="form-item form-item-required form-item-name" auto-focus>
                  <label>Name</label><div class="form-input-group"><input type="text" name="name" ng-required="true" placeholder="Name" ng-model="item.name"/><button class="search-button action" type="button" tooltip="'Search'|top" ng-click="search($event)" ng-disabled="searching || !item.name">
                      <i class="icon icon-search" ng-hide="searching"></i>
                    </button>
                    <i class="icon icon-spinner" ng-show="searching"></i>
                    <ul class="suggestions" ng-show="suggestions.length">
                      <li v-for="suggestion in suggestions">
                        <a href="javascript:void(0)" ng-click="choose(suggestion)">
                          <i class="icon icon-{{suggestion.Type}}"></i>
                          <span v-text="suggestion.Title + '(' + suggestion.Year + ')'"></span>
                        </a>
                      </li>
                      <li class="suggestions-count">There are <span v-text="totalSuggestions"></span> results</li>
                    </ul>
                  </div>
                </div>
                <div class="form-item form-item-required" v-if="!item.isSeries()">
                  <label>Year</label><input type="text" integer ng-required="true" placeholder="2016" class="year" ng-model="item.year" />
                </div>
                <div class="form-item" v-if="item.isMovie() || item.isSeries() || item.isGame()">
                  <label>Plot</label><textarea placeholder="Plot" ng-model="item.plot"></textarea>
                </div>
                <div class="form-item" v-if="item.isMovie()">
                  <label>Director</label><input type="text" placeholder="Name" ng-model="item.director" />
                </div>
                <div class="form-item" v-if="item.isMovie()">
                  <label>Runtime</label><input type="text" placeholder="100 min" class="length" ng-model="item.length" />
                </div>
                <ul class="series-list" v-if="item.isSeries()">
                  <li v-for="season in item.seasons">
                    <div class="form-item form-item-required">
                      <label>Season <span v-text="$index + 1"></span> year</label><div class="form-input-group">
                        <input type="text" integer ng-required="true" placeholder="{{2017 + $index}}" class="year" ng-model="season.year" />
                        <button class="update-button option" type="button" tooltip="'Update season episodes'|top"  ng-click="updateSeason(item, season.nr)">
                          <i class="icon icon-series" ng-hide="updating"></i>
                          <i class="icon icon-spinner" ng-show="updating"></i>
                        </button>
                        <button class="add-button option" type="button"  tooltip="'Add a season'|top"ng-click="addSeason()" v-if="!item.finished">
                          <i class="icon icon-plus"></i>
                        </button>
                        <span class="bracketed season-episode-count" ng-show="season.episodes.length"><span v-text="season.episodes.length"></span> episodes</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="form-item form-item-checkbox"  v-if="item.isSeries()">
                  <input type="checkbox" id="item.finished" ng-model="item.finished" /><label for="item.finished">Finished</label>
                </div>
                <div class="form-item" v-if="!item.isDocumentary()">
                  <label>Actors</label><input type="text" placeholder="Actor, actor" ng-model="item.actors" />
                </div>
                <div class="message form-message warning" ng-show="doubles.length">
                  <i class="icon icon-warning"></i>
                  <div class="message-content">
                    <p>Did you mean the following?</p>
                    <ul>
                      <li v-for="double in doubles">
                        <span v-text="double.name"></span>
                        <span class="bracketed" v-text="double.year"></span>,
                        <span v-text="getTypeName(double)"></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="buttons">
                <div class="button-container">
                  <button type="submit">Add</button>
                </div>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </div>`,
  data() {
    return {    
      item: WatchItemFactory.new()
    }
  },
  computed: {
    suggestions() {
      return [];
    }
  },
  methods: {
    back(evt) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  }
});