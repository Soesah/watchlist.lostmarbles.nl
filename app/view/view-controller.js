angular.module('watchlistApp').controller('ViewController', ['$scope', 'ListDataFactory', '$routeParams', '$location',
  function($scope, ListDataFactory, $routeParams, $location) {

    $scope.item = ListDataFactory.getByPath($routeParams.path);

    $scope.getItemViewTemplate = function() {
      if ($scope.item.type === ListDataFactory.MOVIE) {
        return 'app/view/directives/movie-view.html';
      }
      if ($scope.item.type === ListDataFactory.SERIES) {
        return 'app/view/directives/series-view.html';
      }
      if ($scope.item.type === ListDataFactory.DOCUMENTARY) {
        return 'app/view/directives/documentary-view.html';
      }
      if ($scope.item.type === ListDataFactory.GAME) {
        return 'app/view/directives/game-view.html';
      }
    };

    $scope.edit = function() {
      $location.path('/edit/' + $scope.item.path);
    };

    $scope.back = function() {
      $location.path('/');
    };

  }
]);
