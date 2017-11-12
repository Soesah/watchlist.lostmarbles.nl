import WatchItemFactory from 'services/WatchItemFactory';

let WatchListItem = Vue.component('watch-list-item', {
  template:`<li :class="['item movie', {'movie-watched': item.watched}]">
              <router-link :to="'/view/' + item.path">
                <h6 v-text="item.name"></h6>
                <span class="bracketed" v-text="item.year"></span>
                <i :class="'icon icon-' + icon" @click="toggleWatched"></i>
              </router-link>
            </li>`,
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    icon() {
      return WatchItemFactory.getTypeName(this.item).toLowerCase();
    }
  },
  methods: {
    toggleWatched (evt) {
      this.$store.dispatch('toggleWatched', this.item);
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
});