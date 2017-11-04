import WatchItemFactory from 'services/WatchItemFactory';

let WatchListItem = Vue.component('watch-list-item', {
  template:`<li :class="'item movie'  + ({'star÷movie-watched': item.watched})">
              <router-link :to="'/view/' + item.path">
                <h4 v-text="item.name"></h4>
                <span class="bracketed" v-text="item.year"></span>
                <i :class="'icon icon-' + icon" ng-click="toggleWatched($event, item)"></i>
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
  }
});