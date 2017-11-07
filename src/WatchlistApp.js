import Vue from 'Vue';
import Vuex from 'Vuex';
import router from 'Router';
import store from 'Store';
import MessageLog from 'components/common/message-log/MessageLog';
import Toolbar from 'components/common/toolbar/Toolbar';

new Vue ({
  el: '#watchlist-app',
  router,
  store,
  components: {
    MessageLog,
    Toolbar
  }
});