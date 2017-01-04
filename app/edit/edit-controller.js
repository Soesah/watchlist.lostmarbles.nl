angular.module('watchlistApp').controller('EditController', ['$scope', '_', 'ListDataFactory', '$location', '$routeParams',
  function($scope, _, ListDataFactory, $location, $routeParams) {

    $scope.item = ListDataFactory.getByPath($routeParams.path).clone();
    $scope.editing = true;

    // edit the item to the list
    $scope.editItem = function() {

      if (!$scope.item.isComplete()) {
        return;
      }

      let item = _.find($scope.list, {path: $routeParams.path});

      if (!item) {
        throw new Error('Cannot find item to update');
      } else {
        _.merge(item, $scope.item);
      }

      $scope.save().then(function() {
        $location.path('/');
      });
    };

    $scope.back = function() {
      $location.path('/');
    };

  }
]);
