import WatchItemFactory from 'services/WatchItemFactory';

let WatchItemView = Vue.component('watch-item-view', {
  template:`<div class="view">
              <h2 v-text="item.name"></h2>

              <h3>
                <span v-text="item.year"></span><span v-show="item.lastYear"> – <span v-text="item.lastYear"></span></span><span v-show="item.finished" class="bracketed">Finished</span>
                <span v-text="typeName"></span>
                <span v-show="item.imdbId" class="dashed"><a :href="'http://www.imdb.com/title/' + item.imdbId" target="_new">IMDB</a></span>
              </h3>

              <div class="actors" v-show="item.actors && item.actors.length">
                <h4>Actors</h4>
                <ul>
                  <li v-for="actor in item.actors" v-text="actor"></li>
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


              <div v-if="item.seasons && item.seasons.length">
                <h4>Seasons</h4>
                <ul class="seasons">
                  <li v-for="season in item.seasons">
                    <h5 class="season-title">
                      Season <span v-text="season.nr"></span>
                      <span class="season-year bracketed" v-text="season.year"></span>
                      <i class="icon icon-series" Xclick="toggleWatched($event, season)"></i>
                      <a href="javascript:void(0)" Xclick="editSeason(season)">Edit</a>
                    </h5>
                    <ul class="episodes">
                      <li v-for="episode in season.episodes">
                        <p class="episode-title" :class="{'episode-watched': episode.watched}">
                          <span v-text="episode.nr" class="episode-nr"></span>
                          <span class="episode-name"v-text="episode.title"></span>
                          <i class="icon icon-series" Xclick="toggleWatched($event, episode)"></i>
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div class="links">
                <router-link :to="'/edit/' + item.path">Edit</router-link> / 
                <a href="#" @click="back">Back</a>
              </div>
            </div>`,
  computed: {
    item() {
      return this.$store.state.item
    },
    typeName() {
      return WatchItemFactory.getTypeName(this.item);
    }
  },
  created () {
    this.$store.dispatch('getItemByName', this.$route.params.path);
  },
  methods: {
    back(evt) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  }
});