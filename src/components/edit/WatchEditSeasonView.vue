<template>
  <form name="itemForm" class="form" @submit="edit" :state-item="stateItem">
    <h2>
      Edit
      <i class="spaced" v-text="item.title"></i>
      <span class="dashed">
        season
        <span class="spaced" v-text="season.nr"></span>
      </span>
    </h2>
    <p>Update and complete the information for this season</p>

    <button
      class="update-season-button option"
      type="button"
      tooltip="'Update season episodes'|top"
      @click="updateSeasons(item, season.nr)"
    >
      <i class="icon icon-series" v-show="!updating"></i>
      <i class="icon icon-spinner" v-show="updating"></i>
      Update season
    </button>

    <div class="form-item form-item-required">
      <label>Number</label>
      <input
        type="number"
        disabled
        required
        placeholder="1"
        class="year"
        v-model.number="season.nr"
      >
    </div>

    <div class="form-item form-item-required">
      <label>Year</label>
      <input type="number" required placeholder="2017" class="year" v-model.number="season.year">
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
      <template v-if="season.episodes">
        <li v-for="episode in season.episodes" :key="episode.nr">
          <div class="form-item">
            <label>
              Episode
              <span v-text="episode.nr"></span>
            </label>
            <div class="form-input-group">
              <input type="number" required class="year" v-model.number="episode.nr">
              <input type="text" required v-model="episode.title">
              <button
                class="add-button option"
                type="button"
                @click="addEpisode(episode)"
                v-show="isInSequence(episode)"
              >
                <i class="icon icon-plus"></i>
              </button>
              <button class="add-button danger" type="button" @click="removeEpisode(episode)">
                <i class="icon icon-delete"></i>
              </button>
            </div>
          </div>
        </li>
      </template>
    </ul>

    <div class="buttons">
      <button type="submit">Edit</button>
      <button type="button" class="danger" @click="remove">Delete</button>
      <button type="cancel" @click="back">Cancel</button>
    </div>
  </form>
</template>
<script lang="ts">
import Vue from "vue";
import omdbService from "@/services/OMDBService";
import { WatchItemFactory, WatchlistItems } from "@/services/WatchItemFactory";
import ConfirmDeleteModal from "@/components/edit/ConfirmDeleteModal.vue";
import { Season, SeasonType } from "@/models/SeasonModel";
import { Episode } from "@/models/EpisodeModel";
import { Series, SeriesType } from "@/models/SeriesModel";

interface WatchEditSeasonViewData {
  item: Series;
  season: Season;
  updating: boolean;
}

export default Vue.extend({
  name: "WatchEditSeasonView",
  data(): WatchEditSeasonViewData {
    return {
      item: new Series(<SeriesType>{}),
      season: new Season(<SeasonType>{}),
      updating: false
    };
  },
  computed: {
    // needed to listen to state's item
    stateItem(): any {
      let item = <any>WatchItemFactory.new();
      if (this.$store.state.item.title) {
        item = this.$store.state.item.clone();
        let season = item.getSeason(this.$route.params.nr);
        // set this item as the data item, to allow mutation
        // todo causes compile issues "side-effects"
        // this.item = item;
        // this.season = season ? season : {};
      }
      return item;
    }
  },
  created() {
    this.$store
      .dispatch("getItemByName", this.$route.params.path)
      .then(item => {
        this.$store.commit("addNav", {
          name: item.title,
          to: "/view/" + item.path
        });
        this.$store.commit("addNav", {
          name: "Edit " + item.title + " Season " + this.$route.params.nr,
          to: "/edit/" + item.path + "/season/" + this.$route.params.nr
        });
      });
  },
  destroyed() {
    this.$store.commit("removeNav", "/view/" + this.item.path);
    this.$store.commit(
      "removeNav",
      "/edit/" + this.item.path + "/season/" + this.$route.params.nr
    );
  },
  methods: {
    edit(evt: Event) {
      this.$store
        .dispatch("editItem", this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
    },
    remove(evt: Event) {
      this.$store.state.event.$emit("openModal", {
        modal: "confirm-delete-modal",
        name: this.item.title + " Season " + this.$route.params.nr,
        confirm: this.onConfirmDelete
      });

      evt.preventDefault();
    },
    onConfirmDelete(evt: Event) {
      this.$store
        .dispatch("removeSeason", {
          item: this.$store.state.item,
          season: this.$store.state.item.getSeason(this.$route.params.nr)
        })
        .then(items => {
          this.$destroy();
          this.$router.go(-1);
        });
      evt.preventDefault();
    },
    isInSequence(episode: Episode) {
      let nr = episode.nr,
        next = this.season.getEpisodeByNr(nr + 1);

      return !next;
    },
    addEpisode(episode: Episode) {
      let nr = episode ? episode.nr + 1 : 1,
        newEpisode = this.season.createEpisode(
          "NON-IMDB-EPISODE-ID-" +
            this.item.imdbID +
            "-" +
            this.season.nr +
            "-" +
            nr,
          nr,
          ""
        );

      this.season.insertEpisode(nr - 1, newEpisode);
    },
    removeEpisode(episode: Episode) {
      this.season.removeEpisode(episode);
    },
    updateSeasons(series: Series) {
      this.updating = true;
      omdbService.updateSeasons(series).then(response => {
        this.updating = false;
        let nr = parseInt(this.$route.params.nr);
        this.season = <Season>this.item.getSeason(nr);
      });
    },
    back(evt: Event) {
      this.$router.go(-1);
      evt.preventDefault();
    },
    getTypeName(item: WatchlistItems): string {
      return WatchItemFactory.getTypeName(item).toLowerCase();
    }
  },
  components: {
    /* eslint-disable vue/no-unused-components */
    ConfirmDeleteModal
  }
});
</script>
