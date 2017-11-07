import WatchItemFactory from 'services/WatchItemFactory';
import ItemFields from 'components/common/item-fields/ItemFields';

let WatchAddView = Vue.component('watch-add-view', {
  template:`<form class="form" @submit="add">
              <h2>Add</h2>
              <p>Add a movie, documentary or series to the watchlist</p>

              <item-fields :item="item"></item-fields>

              <div class="buttons">
                <div class="button-container">
                  <button type="submit">Add</button>
                </div>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </form>`,
  data() {
    return {
      item: WatchItemFactory.new()
    }
  },
  created () {
    this.$store.dispatch('getWatchList');
  },
  methods: {
    add(evt) {
      this.$store.dispatch('addItem', this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
    },
    back(evt) {
      this.$router.go(-1);
      evt.preventDefault();
    }
  },
  components: {
    ItemFields
  }
});