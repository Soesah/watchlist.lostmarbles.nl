angular.module('watchlistApp').controller('AddController', ['$scope', 'ListDataFactory', '$location',
  function($scope, ListDataFactory, $location) {

    $scope.item = ListDataFactory.new(ListDataFactory.MOVIE);

    // add the item to the list
    $scope.addItem = function() {

      if (!$scope.item.isComplete()) {
        return;
      }

      $scope.list.push($scope.item);

      $scope.save().then(function() {
        $location.path('/');
      }, function() {
        // remove the item from the list, since we stay on the add page
        $scope.list.splice($scope.list.indexOf($scope.item, 1))
      });
    };

    $scope.back = function() {
      $location.path('/');
    };

  }
]);
