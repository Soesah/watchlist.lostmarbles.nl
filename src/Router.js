import VueRouter from 'VueRouter';
import WatchList from 'components/list/WatchList';
import WatchItemView from 'components/view/WatchItemView';
import WatchAddView from 'components/add/WatchAddView';
import WatchEditView from 'components/edit/WatchEditView';
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
      path: '/view/:path',
      component: WatchItemView
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

