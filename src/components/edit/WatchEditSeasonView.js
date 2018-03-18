import omdbApiService from 'services/OMDbApiService';
import WatchItemFactory from 'services/WatchItemFactory';
import ConfirmDeleteModal from 'components/edit/ConfirmDeleteModal';

let WatchEditSeasonView = Vue.component('watch-edit-season-view', {
  template:`<form name="itemForm" class="form" @submit="edit" :state-item="stateItem">
              <h2>Edit <i class="spaced" v-text="item.name"></i><span class="dashed">season<span class="spaced" v-text="season.nr"></span></span></h2>
              <p>Update and complete the information for this season</p>

              <button class="update-season-button option" type="button" tooltip="'Update season episodes'|top"  @click="updateSeason(item, season.nr)">
                <i class="icon icon-series" v-show="!updating"></i>
                <i class="icon icon-spinner" v-show="updating"></i>
                Update season
              </button>  

              <div class="form-item form-item-required">
                <label>Number</label><input type="number" disabled required placeholder="1" class="year" v-model.number="season.nr" />
              </div>

              <div class="form-item form-item-required">
                <label>Year</label><input type="number" required placeholder="2017" class="year" v-model.number="season.year" />
              </div>

              <h3>Episodes</h3>
              <ul class="episode-list" v-if="season.episodes && season.episodes.length">
                <li v-if="season.episodes.length && season.episodes[0].nr !== 1">
                  <div class="form-item">
                    <label></label>
                    <div class="form-input-group form-input-group-right">
                      <button class="add-button option" type="button" @click="addEpisode(null)">
                        <i class="icon icon-plus"></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li v-if="season.episodes" v-for="episode in season.episodes">
                  <div class="form-item">
                    <label>Episode <span v-text="episode.nr"></span></label><div class="form-input-group">
                      <input type="number" required class="year" v-model.number="episode.nr" />
                      <input type="text" required v-model="episode.title" />
                      <button class="add-button option" type="button" @click="addEpisode(episode)" v-show="isInSequence(episode)">
                        <i class="icon icon-plus"></i>
                      </button>
                      <button class="add-button danger" type="button" @click="removeEpisode(episode)">
                        <i class="icon icon-delete"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="buttons">
                <button type="submit">Edit</button>
                <button type="button" class="danger" @click="remove">Delete</button>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </form>`,
  data() {
    return {
      item: {},
      season: {},
      updating: false
    }
  },
  computed: {
    // needed to listen to state's item
    stateItem() {
      let item = WatchItemFactory.new();
      if (this.$store.state.item.name) {
        item = this.$store.state.item.clone();
        let season = item.getSeason(this.$route.params.nr);
        // set this item as the data item, to allow mutation
        this.item = item;
        this.season = season ? season : {};
      }
      return item;
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
    remove (evt) {
      this.$store.state.event.$emit('openModal', {
        modal: 'confirm-delete-modal',
        name: this.item.name + ' Season ' + this.$route.params.nr,
        confirm: this.onConfirmDelete
      });

      evt.preventDefault();
    },
    onConfirmDelete () {
      this.$store.dispatch('removeSeason', {
        item: this.$store.state.item,
        season: this.$store.state.item.getSeason(this.$route.params.nr)
      }).then(items => {
          this.$destroy();
          this.$router.go(-1);
        });
      evt.preventDefault();
    },
    isInSequence (episode) {
      let nr = episode.nr,
          next = this.season.getEpisodeByNr(nr + 1);

      return !next;
    },
    addEpisode (episode) {
      let nr = episode ? episode.nr + 1 : 1,
          newEpisode = this.season.createEpisode('NON-IMDB-EPISODE-ID-' + this.item.imdbId + '-' + this.season.nr + '-' + nr , nr, '');

      this.season.insertEpisode(nr - 1, newEpisode);
    },
    removeEpisode (episode) {
      this.season.removeEpisode(episode);
    },
    updateSeason (series, nr) {
      this.updating = true;
      omdbApiService.updateSeason(series, nr).then(response => {
        this.updating = false;
        let nr = parseInt(this.$route.params.nr);
        this.season = this.item.getSeason(nr);
      });
    },
    back (evt) {
      this.$router.go(-1);
      evt.preventDefault();
    },
    getTypeName(item) {
      return WatchItemFactory.getTypeName(item).toLowerCase();
    } 
  },
  components: {
    ConfirmDeleteModal
  }
});