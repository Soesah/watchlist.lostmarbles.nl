angular.module('watchlistApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/list/directives/list.html',
      controllerAs: 'ctrl',
      controller: 'ListController'
    }).when('/add', {
      templateUrl: 'app/list/directives/add.html',
      controller: 'AddController'
    }).otherwise('/'); // always go back to the list
  }
]);
