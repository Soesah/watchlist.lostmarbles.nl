angular.module('watchlistApp').controller('AddController', ['$scope', 'ListDataFactory', 'OMDbApi', '$location',
  function($scope, ListDataFactory, OMDbApi, $location) {

    $scope.item = ListDataFactory.new(ListDataFactory.MOVIE);

    $scope.types = ListDataFactory.getTypeList();

    $scope.$watch('item.type', function(value) {
      let name = $scope.item.name,
          year = $scope.item.year;

      $scope.item = ListDataFactory.new(value);

      $scope.item.name = name;

      if ($scope.isSeries()) {
        $scope.item.addSeason(year ? year : $scope.item.year ? $scope.item.year + 1 : null);
      } else {
        $scope.item.year = year;
      }
    });

    $scope.addSeason = function() {
      $scope.item.addSeason($scope.item.lastYear ? $scope.item.lastYear + 1 : null);
    };

    $scope.isSeries = function() {
      return $scope.item.type === ListDataFactory.SERIES;
    };

    $scope.addItem = function() {
      $scope.list.push($scope.item);
      // clear messages
      $scope.$root.$emit('messages:clear', 'general');
      $scope.$root.$emit('message', {
        name: 'general',
        type: 'warning',
        message: 'Saving...',
        time: 2000
      });

      ListDataFactory.save($scope.list).then(function() {
        $scope.$root.$emit('message', {
          name: 'general',
          type: 'info',
          message: 'Saving was successful'
        });
        // clear messages
        $scope.$root.$emit('messages:clear', 'general');
        $location.path('/');
      }, function() {
        $scope.$root.$emit('message', {
          name: 'general',
          type: 'error',
          message: 'Saving failed'
        });
        // remove the item from the list, since we stay on the add page
        $scope.list.splice($scope.list.indexOf($scope.item, 1))
      });
    };


    $scope.back = function() {
      $location.path('/');
    };    
  }
]);
