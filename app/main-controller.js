angular.module('watchlistApp').controller('MainController', ['$scope', '$q', 'ListDataFactory',
  function($scope, $q, ListDataFactory) {

    $scope.list = [];
    $scope.loading = true;

    ListDataFactory.load().then(function(data) {
      $scope.list = data;
      $scope.loading = false;
    });

    $scope.save = function() {
      // clear messages
      $scope.$root.$emit('messages:clear', 'general');
      $scope.$root.$emit('message', {
        name: 'general',
        type: 'warning',
        message: 'Saving...',
        time: 1000
      });

      let promise = $q(function(resolve, reject) {
        ListDataFactory.save($scope.list).then(function() {
          $scope.$root.$emit('message', {
            name: 'general',
            type: 'info',
            message: 'Saving was successful'
          });
          // clear messages
          $scope.$root.$emit('messages:clear', 'general');
          resolve();
        }, function() {
          $scope.$root.$emit('message', {
            name: 'general',
            type: 'error',
            message: 'Saving failed'
          });
          reject();
        });
      });

      return promise;
    }
  }
]);
