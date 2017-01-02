angular.module('watchlistApp').controller('ListController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.filter = '';
    $scope.types = ListDataFactory.getFilterList();
    $scope.itemType = ListDataFactory.ALL;
    $scope.states = ListDataFactory.getFilterStates();
    $scope.itemState = null;

    $scope.setItemType = function(type) {
      $scope.itemType = type;
    };

    $scope.setItemState = function(state) {
      $scope.itemState = state;
    };

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

    $scope.toggleWatched = function(evt, item) {
      evt.stopPropagation();
      evt.preventDefault();

      item.toggleWatched();
      $scope.save().then(function() {}, function() {
        item.toggleWatched();
      });
    };

    $scope.add = function() {
      $location.path('/add');
    };

  }
]);
