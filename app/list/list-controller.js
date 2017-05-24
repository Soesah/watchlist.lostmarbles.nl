angular.module('watchlistApp').controller('ListController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.types = ListDataFactory.getFilterList();
    $scope.states = ListDataFactory.getFilterStates();

    $scope.setItemType = function(type) {
      $scope.filter.itemType = type;
    };

    $scope.setItemState = function(state) {
      $scope.filter.itemState = state;
    };

    $scope.setItemIMDBVerified = function(verified) {
      $scope.filter.itemVerified = verified;
    };

    $scope.toggleWatched = function(evt, item) {
      evt.stopPropagation();
      evt.preventDefault();

      item.toggleWatched();
      $scope.save();
    };

    $scope.add = function() {
      $location.path('/add');
    };

  }
]);
