import Vue from 'vue';
import Vuex from 'vuex';
import watchlistService from '@/services/WatchlistService';
import messageService, {
  MessageType,
  Message
} from '@/services/MessageService';
import { WatchlistType } from '@/core/models/BaseModel';
import { Franchise } from '@/models/FranchiseModel';
import { WatchlistItems, FranchiseItems } from './services/WatchItemFactory';

Vue.use(Vuex);

interface Filter {
  search: string;
  itemState: string | null;
  itemType: string | boolean;
}

interface WatchlistState {
  item: any;
  items: WatchlistItems[];
  messages: Message[];
  filter: Filter;
  navigation: any[];
  event: Vue;
}

export default new Vuex.Store<WatchlistState>({
  state: {
    item: {},
    items: [],
    messages: [],
    filter: {
      search: '',
      itemState: null,
      itemType: true
    },
    navigation: [],
    // set up a Vue instance as an eventing proxy
    event: new Vue()
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setItem(state, item) {
      state.item = item;
    },
    addItem(state, item: any) {
      state.items = [...state.items, item];
    },
    editItem(state, item) {
      // assume imdbID doesn't change
      let index = state.items.findIndex((it: any) => it.imdbID === item.imdbID);
      state.items.splice(index, 1, item);
    },
    removeItem(state, item) {
      // assume imdbID doesn't change
      let index = state.items.findIndex((it: any) => it.imdbID === item.imdbID);
      state.items.splice(index, 1);
    },
    removeSeason(_, { item, season }) {
      item.removeSeason(season);
    },
    toggleWatched(state, item) {
      let index = state.items.findIndex((it: any) => it.imdbID === item.imdbID);
      state.items.splice(index, 1, item);
    },
    updateMessages(state, messages: Message[]) {
      state.messages = messages;
    },
    addNav(state, nav) {
      state.navigation.push(nav);
    },
    removeNav(state, to) {
      let index = state.navigation.findIndex((nav: any) => nav.to === to);
      state.navigation.splice(index, 1);
    }
  },
  actions: {
    async addItem({ commit, dispatch }, item: WatchlistItems) {
      dispatch('info', `Adding "${item.title}"`);
      const response = await watchlistService.create(item);
      if (response.status) {
        commit('addItem', response.data);
        dispatch('success', response.message);
      } else {
        dispatch('error', response.message);
      }
      return response.status;
    },
    async editItem({ commit, dispatch }, item) {
      dispatch('info', `Updating "${item.title}"`);
      const response = await watchlistService.store(item);
      if (response.status) {
        commit('editItem', response.data);
        dispatch('success', response.message);
      } else {
        dispatch('error', response.message);
      }
      return response.status;
    },
    async removeItem({ commit, dispatch }, item) {
      dispatch('info', `Removing "${item.title}"`);
      const response = await watchlistService.remove(item);
      if (response.status) {
        commit('removeItem', item);
        dispatch('success', response.message);
      } else {
        dispatch('error', response.message);
      }
      return response.status;
    },
    removeSeason({ commit, dispatch }, { item, season }) {
      commit('removeSeason', { item, season });
      return dispatch('info', `Removing ${item.title} Season ${season.nr}`);
    },
    async toggleWatched({ commit, dispatch }, item) {
      const watched = item.type === WatchlistType.Game ? 'played' : 'watched';
      dispatch(
        'info',
        `Toggling ${item.title} to ${item.watched ? 'not ' + watched : watched}`
      );
      const response = await watchlistService.toggle(item);
      if (response.status) {
        commit('toggleWatched', response.data);
        dispatch('success', response.message);
      } else {
        dispatch('error', response.message);
      }
      return response.status;
    },
    async toggleSeasonWatched({ commit, dispatch }, { item, season }) {
      dispatch(
        'info',
        `Toggling ${item.title} Season ${season.nr} to ${
          season.watched ? 'not watched' : 'watched'
        }`
      );
      const response = await watchlistService.toggleSeason(item, season);
      if (response.status) {
        commit('toggleWatched', response.data);
        commit('setItem', response.data);
        dispatch('success', response.message);
      } else {
        dispatch('error', 'Failed to change item watched status');
      }
      return response.status;
    },
    async toggleEpisodeWatched(
      { commit, dispatch },
      { item, season, episode }
    ) {
      dispatch(
        'info',
        `Toggling ${item.title} Season ${season.nr} Episode ${episode.nr} to ${
          episode.watched ? 'not watched' : 'watched'
        }`
      );
      const response = await watchlistService.toggleEpisode(
        item,
        season,
        episode
      );
      if (response.status) {
        commit('toggleWatched', response.data);
        commit('setItem', response.data);
        dispatch('success', response.message);
      } else {
        dispatch('error', 'Failed to change item watched status');
      }
      return response.status;
    },
    async getWatchList({ state, commit }) {
      let items;
      if (!state.items.length) {
        items = await watchlistService.load();
        commit('setItems', items);
      } else {
        items = state.items;
      }
      return items;
    },
    async getItemByPath({ dispatch, commit }, path) {
      const items = await dispatch('getWatchList');
      let item = items.find((item: any) => item.path === path);
      commit('setItem', item);
      return item;
    },
    info({ dispatch }, text: string) {
      return dispatch('message', {
        type: MessageType.Info,
        text
      });
    },
    success({ dispatch }, text: string) {
      return dispatch('message', {
        type: MessageType.Success,
        text
      });
    },
    warning({ dispatch }, text: string) {
      return dispatch('message', {
        type: MessageType.Warning,
        text
      });
    },
    error({ dispatch }, text: string) {
      return dispatch('message', {
        type: MessageType.Error,
        text
      });
    },
    message({ commit }, message: Message) {
      const messages = messageService.addMessage(message);
      const last = messageService.getLastMessage();
      commit('updateMessages', messages);
      return last.id;
    },
    dismiss({ commit }, id) {
      const messages = messageService.removeMessage(id);
      commit('updateMessages', messages);
      return messages;
    }
  },
  getters: {
    searchItems: state => (search: string, items: any) => {
      return state.items.filter((item: any) => {
        return (
          item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 &&
          item.type !== WatchlistType.Franchise &&
          !~items.indexOf(item.imdbID)
        );
      });
    },
    franchises: state => (): Franchise[] => {
      return state.items.filter(
        (item: WatchlistItems): item is Franchise =>
          item.type === WatchlistType.Franchise
      );
    },
    getItemFranchise: (_, getters) => (item: any): boolean => {
      return getters
        .franchises()
        .find((franchise: Franchise) => franchise.items.includes(item.imdbID));
    },
    franchiseItems: state => (items: string[]): FranchiseItems[] => {
      return items.map((imdbID: string) =>
        state.items.find(item => item.imdbID === imdbID)
      );
    },
    filteredItems: (state, getters) => () => {
      let filtered = state.items.filter((item: any) => {
        let show = true;

        // filter out franchised items by default
        show = !getters.getItemFranchise(item);

        // filter out franchises when searching;
        // this prevents heaps of complexity if you were to extend the filter and search to franchiseItems above
        if (state.filter.search) {
          show =
            item.title
              .toLowerCase()
              .indexOf(state.filter.search.toLowerCase()) !== -1 &&
            item.type !== WatchlistType.Franchise;
        }

        if (show && state.filter.itemType !== true) {
          show = (state.filter.itemType as string).indexOf(item.type) !== -1;
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
