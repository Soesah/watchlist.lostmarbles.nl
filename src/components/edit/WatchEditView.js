import WatchItemFactory from 'services/WatchItemFactory';
import ItemFields from 'components/common/item-fields/ItemFields';

let WatchEditView = Vue.component('watch-edit-view', {
  template:`<form class="form" @submit="edit">
              <h2>Edit</h2>
              <p>Update and complete the information for this <span v-text="getTypeName(item)"></span></p>

              <item-fields :item="item" v-if="item.name"></item-fields>

              <div class="buttons">
                <div class="button-container">
                  <button type="submit">Edit</button>
                </div>
                <button type="button" class="danger" @click="remove">Delete</button>
                <button type="cancel" @click="back">Cancel</button>
              </div>
            </form>`,
  computed: {
    item() {
      return this.$store.state.item.name ? this.$store.state.item.clone() : {};
    }
  },
  created () {
    this.$store.dispatch('getItemByName', this.$route.params.path).then(item => {
      this.$store.commit('addNav', {
        name: 'Edit ' + item.name,
        to: '/edit/' + item.path
      });
    });
  },
  destroyed () {
    this.$store.commit('removeNav', '/edit/' + this.item.path);
  },
  methods: {
    edit (evt) {
      this.$store.dispatch('editItem', this.item)
        .then(items => this.$router.go(-1));
      evt.preventDefault();
    },
    remove (evt) {
      this.$store.dispatch('removeItem', this.item)
        .then(items => {
          this.$destroy();
          this.$router.push('/');
        });
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