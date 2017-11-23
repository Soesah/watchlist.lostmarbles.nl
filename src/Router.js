import VueRouter from 'VueRouter';
import WatchList from 'components/list/WatchList';
import WatchItemView from 'components/view/WatchItemView';
import WatchFranchiseView from 'components/view/WatchFranchiseView';
import WatchAddView from 'components/add/WatchAddView';
import WatchEditView from 'components/edit/WatchEditView';
import WatchFranchiseEditView from 'components/edit/WatchFranchiseEditView';
import WatchEditSeasonView from 'components/edit/WatchEditSeasonView';
import FranchisesView from 'components/franchises/FranchisesView';
import AddFranchiseView from 'components/franchises/AddFranchiseView';

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: WatchList
    },{
      path: '/add/',
      component: WatchAddView
    },{
      path: '/view/franchise/:path',
      component: WatchFranchiseView
    },{
      path: '/view/:path',
      component: WatchItemView
    },{
      path: '/edit/franchise/:path',
      component: WatchFranchiseEditView
    },{
      path: '/edit/:path',
      component: WatchEditView
    },{
      path: '/edit/:path/season/:nr',
      component: WatchEditSeasonView
    },{
      path: '/franchises',
      component: FranchisesView
    },{
      path: '/franchises/add',
      component: AddFranchiseView
    }
  ]
});

