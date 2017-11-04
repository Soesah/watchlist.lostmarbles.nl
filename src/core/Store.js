import _ from 'Lodash';
import watchlistService from 'services/WatchlistService';

const store = new Vuex.Store({
  state: {
    item: {},
    items: [],
    notifications: [],
    filter: {
      search: '',
      itemState: null,
      itemType: true
    }
  },
  mutations: {
    setItems (state, items) {
      state.items = items;
    },
    setItem (state, item) {
      state.item = item;
    },
    notify (state, notification) {
      let index = state.notifications.length
      state.notifications.push(notification);
      switch(notification.type) {
        case 'info':
          this.dispatch('dismiss', {delay: 1000, index: index});
          break;
        case 'success':
          this.dispatch('dismiss', {delay: 1500, index: index});
          break;
        case 'warning':
          this.dispatch('dismiss', {delay: 2500, index: index});
          break;
        case 'error':
          this.dispatch('dismiss', {delay: 5500, index: index});
          break;
      }
    },
    dismiss (state, index = 0) {
      state.notifications.splice(index, 1);
    }
  },
  actions: {
    getWatchList ({commit, state}) {
      return watchlistService.load().then(items => commit('setItems', items));
    },
    getItemByName({commit, state}, name) {
      return watchlistService.load().then(items => {
        commit('setItems', items);
        let item = items.find(item => item.path === name);
        commit('setItem', item);
        return item;
      });
    },
    dismiss ({commit, state}, data) {
      window.setTimeout(() => {
        commit('dismiss', state.notifications.length <= data.index ? data.index - 1 : data.index);
      }, data.delay)
    }
  },
  getters: {
    filteredItems: (state, getters) => () => {
      let filtered = _.filter(state.items, item => {
        let show = true;

        if (state.filter.search) {
          show = item.name.toLowerCase().indexOf(state.filter.search.toLowerCase()) !== -1;
        }

        if (show && state.filter.itemType !== true) {
          show = state.filter.itemType.indexOf(item.type) !== -1;
        }

        if (show && state.filter.itemState !== null) {
          show = item.watched === state.filter.itemState;
        }

        return show;
      });
      return filtered;
    }
  }
});