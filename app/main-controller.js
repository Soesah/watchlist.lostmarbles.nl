angular.module('watchlistApp').controller('MainController', ['$scope', 'ListDataFactory',
  function($scope, ListDataFactory) {

    $scope.list = [];

    ListDataFactory.load().then(function(data) {
      $scope.list = data;
    });
  }
]);
