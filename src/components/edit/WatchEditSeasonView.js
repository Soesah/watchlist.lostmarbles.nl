import WatchItemFactory from 'services/WatchItemFactory';

let WatchEditSeasonView = Vue.component('watch-edit-season-view', {
  template:`<form name="itemForm" class="form" ng-submit="editItem()">
              <h2>Edit <i class="spaced" v-text="item.name"></i><span class="dashed">season<span class="spaced" v-text="season.nr"></span></span></h2>
              <p>Update and complete the information for this season</p>

              <button class="update-season-button option" type="button" tooltip="'Update season episodes'|top"  ng-click="updateSeason(item, season.nr)">
                <i class="icon icon-series" v-show="!updating"></i>
                <i class="icon icon-spinner" v-show="updating"></i>
                Update season
              </button>  

              <div class="form-item form-item-required">
                <label>Number</label><input type="text" integer disabled required placeholder="1" class="year" v-model="season.nr" />
              </div>

              <div class="form-item form-item-required">
                <label>Year</label><input type="text" integer required placeholder="2017" class="year" v-model="season.year" />
              </div>

              <h3>Episodes</h3>
              <ul class="episode-list">
                <li v-if="season.episodes && season.episodes[0].nr !== 1">
                  <div class="form-item">
                    <label></label>
                    <div class="form-input-group form-input-group-right">
                      <button class="add-button option" type="button" ng-click="addEpisode(null)">
                        <i class="icon icon-plus"></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li v-if="season.episodes" v-for="episode in season.episodes">
                  <div class="form-item">
                    <label>Episode <span v-text="episode.nr"></span></label><div class="form-input-group">
                      <input type="text" integer required class="year" v-model="episode.nr" />
                      <input type="text" required v-model="episode.title" />
                      <button class="add-button option" type="button" @click="addEpisode(episode)" v-show="isInSequence(episode)">
                        <i class="icon icon-plus"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="buttons">
                <div class="button-container">
                  <button type="submit">Edit</button>
                </div>
                <button type="cancel" ng-click="back()">Cancel</button>
              </div>
            </form>`,
  data() {
    return {
      updating: false
    }
  },
  computed: {
    item() {
      return this.$store.state.item.name ? this.$store.state.item.clone() : {};
    },
    season() {
      return this.item.name ? this.item.getSeason(this.$route.params.nr) : {};
    }
  },
  created () {
    this.$store.dispatch('getItemByName', this.$route.params.path).then(item => {
      this.$store.commit('addNav', {
        name: item.name,
        to: '/view/' + item.path
      });
      this.$store.commit('addNav', {
        name: 'Edit ' + item.name + ' Season ' + this.$route.params.nr,
        to: '/edit/' + item.path + '/season/' + this.$route.params.nr
      });
    });
  },
  destroyed () {
    this.$store.commit('removeNav', '/view/' + this.item.path);
    this.$store.commit('removeNav', '/edit/' + this.item.path + '/season/' + this.$route.params.nr);
  },
  methods: {
    edit (evt) {
      this.$store.dispatch('editItem', this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
    },
    isInSequence (episode) {
      let nr = episode.nr,
          next = this.season.getEpisodeByNr(nr + 1);

      return !next;
    },
    addEpisode (episode) {
      let nr = episode ? episode.nr + 1 : 1,
          newEpisode = this.season.createEpisode('NON-IMDB-ID-' + this.season.year + '-' + this.season.nr + '-' + nr , nr, '');

      this.season.insertEpisode(nr - 1, newEpisode);
    },
    updateSeason (series, nr) {
      this.updating = true;
      OMDbApi.updateSeason(series, nr).then(response => {
        this.updating = false;
        let nr = parseInt($routeParams.nr);
        this.originalSeason = this.item.getSeason(nr);
        this.season = this.originalSeason.clone();
      });
    },
    back (evt) {
      this.$router.go(-1);
      evt.preventDefault();
    },
    getTypeName(item) {
      return WatchItemFactory.getTypeName(item).toLowerCase();
    } 
  }
});