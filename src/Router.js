import VueRouter from 'VueRouter';
import WatchList from 'components/list/WatchList';
import WatchItemView from 'components/view/WatchItemView';
import WatchAddView from 'components/add/WatchAddView';

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
    // },{
    //   path: '/edit/:path',
    //   component: ItemEdit
    }
  ]
});

