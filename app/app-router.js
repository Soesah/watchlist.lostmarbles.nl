angular.module('watchlistApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/list/directives/list.html',
      controllerAs: 'ctrl',
      controller: 'ListController'
    }).when('/add', {
      templateUrl: 'app/add/directives/add.html',
      controllerAs: 'ctrl',
      controller: 'AddController'
    }).when('/edit/:path/season/:nr', {
      templateUrl: 'app/edit/directives/edit-season.html',
      controllerAs: 'ctrl',
      controller: 'EditSeasonController'
    }).when('/edit/:path', {
      templateUrl: 'app/edit/directives/edit.html',
      controllerAs: 'ctrl',
      controller: 'EditController'
    }).when('/view/:path', {
      templateUrl: 'app/view/directives/view.html',
      controllerAs: 'ctrl',
      controller: 'ViewController'
    }).when('/admin', {
      templateUrl: 'app/admin/directives/admin.html',
      controllerAs: 'ctrl',
      controller: 'AdminController'
    }).otherwise('/'); // always go back to the list
  }
]);
