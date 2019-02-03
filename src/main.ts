import Vue from 'vue';
import WatchlistApp from './WatchlistApp.vue';
import ConfirmDeleteModal from '@/components/edit/ConfirmDeleteModal.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.directive('focus', {
  inserted: function(el: any) {
    el.select();
  }
});

// global components
Vue.component('confirm-delete-modal', ConfirmDeleteModal);

new Vue({
  router,
  store,
  render: h => h(WatchlistApp)
}).$mount('#app');
