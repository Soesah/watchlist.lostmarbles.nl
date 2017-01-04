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
    }).when('/edit/:path', {
      templateUrl: 'app/edit/directives/edit.html',
      controllerAs: 'ctrl',
      controller: 'EditController'
    }).otherwise('/'); // always go back to the list
  }
]);
