import WatchItemFactory from 'services/WatchItemFactory';

let AddFranchiseView = Vue.component('add-franchise-view', {
  template:`<form class="form add-franchise" @submit="add">
              <h2>Add Franchise</h2>
              <p>Add a franchise to group movies, series and other.</p>

              <div class="form-item form-item-required">
                <label>Name</label>
                <input type="text" required="true" placeholder="Name" v-model="franchise.name"/>
              </div>
              <div class="form-item form-item-name">
                <label>Search</label>
                <div class="form-input-group">
                  <input type="text" v-if="choice" name="name" readonly v-model="choice.name"/>
                  <input type="text" v-if="!choice" name="name" required autocomplete="off" v-focus placeholder="Search" v-model="search" @input="searchItem"/>
                  <button class="search-button action" type="button" @click="addItem($event)" :disabled="!choice">
                    <i class="icon icon-plus"></i>
                  </button>
                  <ul class="suggestions" v-show="suggestions.length && !choice">
                    <li v-for="suggestion in suggestions">
                      <a href="javascript:void(0)" @click="chooseItem(suggestion)">
                        <i :class="'icon icon-' + getTypeName(suggestion)"></i>
                        <span v-text="suggestion.name + '(' + suggestion.year + ')'"></span>
                      </a>
                    </li>
                    <li class="suggestions-button">
                      <button type="button" class="action" @click="chooseAll">
                        Add all
                      </button>
                    </li>
                  </ul>
                </div> 
              </div>
              <div class="form-item">
                <label>Items</label>
                <ul class="franchise-items list">
                  <li v-for="item in items">
                    <p>
                      <i :class="'icon icon-' + getTypeName(item)"></i> <span v-text="item.name"></span>
                    </p>
                  </li>
                </ul>
              </div>

              <div class="buttons">
                <button type="submit">Add</button>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </form>`,
  data() {
    return {
      search: '',
      franchise: WatchItemFactory.new(WatchItemFactory.FRANCHISE),
      suggestions: [],
      choice: null
    }
  },
  computed: {
    items: function() {
      return this.$store.getters.franchiseItems(this.franchise.items);
    }
  },
  created () {
    this.$store.commit('addNav', {
      name: 'Add a franchise',
      to: '/franchises/add/'
    });
    this.$store.dispatch('getWatchList');
  },
  destroyed () {
    this.$store.commit('removeNav', '/franchises/add');
  },
  methods: {
    searchItem () {
      // don't find without a name
      if (this.search) {
        this.suggestions = this.$store.getters.searchItems(this.search, this.franchise.items);
      } else {
        this.suggestions = [];
      }
    },
    chooseItem (item) {
      this.choice = item;
    },
    chooseAll (evt) {
      this.suggestions.forEach(suggestion => {
        this.franchise.items.push(suggestion.imdbId);
      });
      this.search = '';
      this.searchItem();
      evt.preventDefault();
    },
    addItem () {
      this.franchise.items.push(this.choice.imdbId);
      this.searchItem();
      this.choice = null;
    },
    add (evt) {
      evt.preventDefault();
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
