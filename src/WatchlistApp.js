import Vue from 'Vue';
import router from 'Router';
import store from 'Store';
import MessageLog from 'components/common/message-log/MessageLog';
import Toolbar from 'components/common/toolbar/Toolbar';
import Modal from 'components/common/modal/Modal';

new Vue ({
  el: '#watchlist-app',
  router,
  store,
  components: {
    MessageLog,
    Toolbar,
    Modal
  }
});