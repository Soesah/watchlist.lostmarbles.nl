import WatchItemFactory from 'services/WatchItemFactory';
import ItemFields from 'components/common/item-fields/ItemFields';

let WatchFranchiseEditView = Vue.component('watch-franchise-edit-view', {
  template:`<form class="form add-franchise" @submit="edit">
              <h2>Edit a franchise</h2>
              <p>Update and complete the information for this <span v-text="getTypeName(item)"></span></p>

              <franchise-item-fields :state-item="stateItem" v-model="item"></franchise-item-fields>

              <div class="buttons">
                <button type="submit">Edit</button>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </form>`,
  data() {
    return {
      item: WatchItemFactory.new()
    }
  },
  computed: {
    // needed to listen to state's item
    stateItem() {
      let item = WatchItemFactory.new();
      if (this.$store.state.item.name) {
        item = this.$store.state.item.clone();
        // set this item as the data item, to allow mutation
        this.item = item;
      }
      return item;
    }
  },
  created () {
    this.$store.dispatch('getItemByName', this.$route.params.path).then(item => {
      this.$store.commit('addNav', {
        name: 'Edit ' + item.name,
        to: '/edit/franchise/' + item.path
      });
    });
  },
  destroyed () {
    this.$store.commit('removeNav', '/edit/franchise/' + this.item.path);
  },
  methods: {
    edit (evt) {
      this.$store.dispatch('editItem', this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
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
    ItemFields
  }
});