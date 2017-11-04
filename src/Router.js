import VueRouter from 'VueRouter';
import WatchList from 'components/list/WatchList';
import WatchItemView from 'components/view/WatchItemView';

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: WatchList
    },{
      path: '/view/:path',
      component: WatchItemView
    // },{
    //   path: '/edit/:path',
    //   component: ItemEdit
    }
  ]
});

