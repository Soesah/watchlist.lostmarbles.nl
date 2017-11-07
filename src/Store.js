import _ from 'Lodash';
import watchlistService from 'services/WatchlistService';

const store = new Vuex.Store({
  state: {
    item: {},
    items: [],
    messages: [],
    filter: {
      search: '',
      itemState: null,
      itemType: true
    },
    navigation: []
  },
  mutations: {
    setItems (state, items) {
      state.items = items;
    },
    setItem (state, item) {
      state.item = item;
    },
    addItem (state, item) {
      state.items.push(item);
    },
    editItem (state, item) {
      // assume imdbId doesn't change
      let index = _.findIndex(state.items, {imdbId: item.imdbId});
      state.items.splice(index, 1, item);
    },
    removeItem (state, item) {
      // assume imdbId doesn't change
      let index = _.findIndex(state.items, {imdbId: item.imdbId});
      state.items.splice(index, 1);
    },
    toggleWatched (state, item) {
      item.toggleWatched();
    },
    message (state, message) {
      let index = state.messages.length
      message.id = message.type + '_' + message.text;
      state.messages.push(message);
      switch(message.type) {
        case 'info':
          this.dispatch('dismiss', {delay: 1700, id: message.id});
          break;
        case 'success':
          this.dispatch('dismiss', {delay: 2000, id: message.id});
          break;
        case 'warning':
          this.dispatch('dismiss', {delay: 2500, id: message.id});
          break;
        case 'error':
          // make the user dismiss the error
          break;
      }
    },
    dismiss (state, id) {
      let index = _.findIndex(state.messages, {id, id});
      state.messages.splice(index, 1);
    },
    addNav (state, nav) {
      state.navigation.push(nav);
    },
    removeNav (state, to) {
      let index = _.findIndex(state.navs, {to, to});
      state.navigation.splice(index, 1);
    }
  },
  actions: {
    addItem({commit, state}, item) {
      commit('addItem', item);
      return this.dispatch('save');
    },
    editItem({commit, state}, item) {
      commit('editItem', item);
      return this.dispatch('save');
    },
    removeItem({commit, state}, item) {
      commit('removeItem', item);
      return this.dispatch('save');
    },
    toggleWatched({commit, state}, item) {
      commit('toggleWatched', item);
      return this.dispatch('save');
    },
    save ({commit, state}) {
      commit('message', {
        type: 'info',
        text: 'Saving...'
      });
      return watchlistService.save(state.items).then(items => {
        commit('setItems', items);
        commit('message', {
          type: 'success',
          text: 'Watchlist saved succesfully.'
        });
        return items;
      });
    },
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
        commit('dismiss', data.id);
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