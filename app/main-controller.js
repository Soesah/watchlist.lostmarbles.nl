angular.module('watchlistApp').controller('MainController', ['$scope', '$rootScope', '$document', '$location', '$timeout', '$q', 'ListDataFactory',
  function($scope, $rootScope, $document, $location, $timeout, $q, ListDataFactory) {

    $scope.list = [];
    $scope.loading = true;

    ListDataFactory.load().then(function(data) {
      $scope.list = data;
      $scope.loading = false;
    });

    $scope.save = function() {
      // clear messages
      // $scope.$root.$emit('messages:clear', 'general');
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
    };

    $scope.getTypeName = function(item) {
      return ListDataFactory.getTypeName(item);
    };

    let listLocation = 0;

    $rootScope.$on('$routeChangeStart', function () {
      if ($location.$$path !== '/') {
        listLocation = $document[0].body.scrollTop
      } else {
        $timeout(function() {
          $document[0].body.scrollTop = listLocation;
        }, 100);
      }
    });
  }
]);
