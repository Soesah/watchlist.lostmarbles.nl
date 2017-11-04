import _ from 'Lodash';
import WatchItemFactory from 'services/WatchItemFactory';

let ListFilter = Vue.component('list-filter', {
  template:`<div class="filters">
              <div class="filter">
                <label>Filter by name</label>
                <div class="filter-row">
                  <input type="text" placeholder="Filter" v-model="filter.search" @input="updateSearch($event)" />
                  <button class="clear" @click="clear" v-show="filter.search != ''">
                    <i class="icon icon-delete"></i>
                  </button>
                  <button type="button" :class="['advanced option icon-only ', {active: showMore}]" @click="showMore = !showMore;"><i class="icon icon-cogs"></i></button>
                </div>
              </div>
              <div class="filter" v-if="showMore">
                <label>Filter by type</label>
                <ul class="unselectable">
                  <li v-for="type in types">
                    <a href="javascript:void(0)"
                      v-text="type.name"
                      :class="{active: isActive(type)}"
                      @click="setItemType(type.type);"></a>
                  </a></li>
                </ul>
              </div>
              <div class="filter" v-if="showMore">
                <label>Watched</label>
                <ul class="unselectable">
                  <li v-for="state in states">
                    <a href="javascript:void(0)"
                      v-text="state.name"
                      :class="{active: filter.itemState === state.state}"
                      @click="setItemState(state.state);"></a>
                  </a></li>
                </ul>
              </div>
            </div>`,
  data() {
    return {
      filter: this.$store.state.filter,
      showMore: false,
      type: '',

    }
  },
  computed: {
    types() {
      return WatchItemFactory.getFilterTypes();
    },
    states() {
      return WatchItemFactory.getFilterStates();
    }
  },
  methods: {
    updateSearch (evt) {
      this.$emit('input', evt.target.value);
    },
    clear() {
      this.filter.search = '';
    },
    isActive(type) {
      return _.isEqual(this.filter.itemType, type.type);
    },
    setItemType(type) {
      this.filter.itemType = type;
    },
    setItemState(state) {
      this.filter.itemState = state;
    }
  }
});