import Vue from 'vue';
import Router from 'vue-router';
import WatchList from '@/components/list/WatchList.vue';
import WatchItemView from '@/components/view/WatchItemView.vue';
import WatchFranchiseView from '@/components/view/WatchFranchiseView.vue';
import WatchAddView from '@/components/add/WatchAddView.vue';
import WatchEditView from '@/components/edit/WatchEditView.vue';
import WatchFranchiseEditView from '@/components/edit/WatchFranchiseEditView.vue';
import WatchEditSeasonView from '@/components/edit/WatchEditSeasonView.vue';
import FranchisesView from '@/components/franchises/FranchisesView.vue';
import FranchiseAddView from '@/components/franchises/FranchiseAddView.vue';
import SettingsView from '@/components/settings/SettingsView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: WatchList
    },
    {
      path: '/add/',
      component: WatchAddView
    },
    {
      path: '/view/franchise/:path',
      component: WatchFranchiseView
    },
    {
      path: '/view/:path',
      component: WatchItemView
    },
    {
      path: '/edit/franchise/:path',
      component: WatchFranchiseEditView
    },
    {
      path: '/edit/:path',
      component: WatchEditView
    },
    {
      path: '/edit/:path/season/:nr',
      component: WatchEditSeasonView
    },
    {
      path: '/franchises',
      component: FranchisesView
    },
    {
      path: '/franchises/add',
      component: FranchiseAddView
    },
    {
      path: '/settings',
      component: SettingsView
    }
  ]
});
