angular.module('watchlistApp').controller('EditController', ['$scope', '_', 'ListDataFactory', 'OMDbApi', '$location', '$routeParams',
  function($scope, _, ListDataFactory, OMDbApi, $location, $routeParams) {

    $scope.item = ListDataFactory.getByPath($routeParams.path).clone();
    $scope.editing = true;

    // edit the item to the list
    $scope.editItem = function() {

      if (!$scope.item.isComplete()) {
        return;
      }

      // update actors if necessary
      if ($scope.item.actors && typeof $scope.item.actors === 'string') {
        $scope.item.actors = $scope.item.actors.split(',').map(function(item) {
          return item.trim();
        });
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

    $scope.delete = function() {
      let item = _.find($scope.list, {path: $routeParams.path}),
          index = $scope.list.indexOf(item);

      $scope.list.splice(index, 1);

      $scope.save().then(function() {
        $location.path('/');
      }, function() {
        // re-add item?
        $scope.list.push(item);
      });
    };

    $scope.updating = false;
    $scope.updateSeason = function(series, nr) {
      $scope.updating = true;
      OMDbApi.updateSeason(series, nr).then(function() {
        $scope.updating = false;
      });
    };

    $scope.back = function() {
      $location.path('/');
    };

  }
]);
