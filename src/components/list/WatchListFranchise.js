import WatchItemFactory from 'services/WatchItemFactory';

let WatchListFranchise = Vue.component('watch-list-franchise', {
  template:`<li class="item">
              <router-link :to="'/view/franchise/' + this.item.path">
                <h6 v-text="item.name"></h6>
                <span class="bracketed" v-text="item.items.length"></span>
              </router-link>
            </li>`,
  props: {
    item: {
      type: Object
    }
  }
});