angular.module('watchlistApp').controller('ItemController', ['$scope', 'ListDataFactory',
  function($scope, ListDataFactory) {

    $scope.getItemTemplate = function() {
      switch($scope.item.type) {
        case ListDataFactory.MOVIE:
        case ListDataFactory.SEQUEL:
        case ListDataFactory.PREQUEL:
          return 'app/list/directives/movie.html';
        case ListDataFactory.SERIES:
          return 'app/list/directives/series.html';
        case ListDataFactory.DOCUMENTARY:
          return 'app/list/directives/documentary.html';
        case ListDataFactory.GAME:
          return 'app/list/directives/game.html';
      }
    };

  }
]);
