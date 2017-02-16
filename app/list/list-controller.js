angular.module('watchlistApp').controller('ListController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.filter = '';
    $scope.types = ListDataFactory.getFilterList();
    $scope.itemType = ListDataFactory.ALL;
    $scope.states = ListDataFactory.getFilterStates();
    $scope.itemState = null;
    $scope.itemVerified = null;

    $scope.setItemType = function(type) {
      $scope.itemType = type;
    };

    $scope.setItemState = function(state) {
      $scope.itemState = state;
    };

    $scope.setItemIMDBVerified = function(verified) {
      $scope.itemVerified = verified;
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
