import Vue from 'Vue';
import Vuex from 'Vuex';
import router from 'Router';
import store from 'core/Store';
import MessageLog from 'components/common/message-log/MessageLog';

new Vue ({
  el: '#watchlist-app',
  router,
  store,
  components: {
    MessageLog
  }
});