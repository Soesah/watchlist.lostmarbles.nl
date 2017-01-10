angular.module('watchlistApp').controller('ItemController', ['$scope', 'ListDataFactory',
  function($scope, ListDataFactory) {

    $scope.getItemTemplate = function() {
      if ($scope.item.type === ListDataFactory.MOVIE) {
        return 'app/list/directives/movie.html';
      }
      if ($scope.item.type === ListDataFactory.SERIES) {
        return 'app/list/directives/series.html';
      }
      if ($scope.item.type === ListDataFactory.DOCUMENTARY) {
        return 'app/list/directives/documentary.html';
      }
      if ($scope.item.type === ListDataFactory.GAME) {
        return 'app/list/directives/game.html';
      }
    };

  }
]);
