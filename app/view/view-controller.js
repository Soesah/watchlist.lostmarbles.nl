angular.module('watchlistApp').controller('ViewController', ['$scope', 'ListDataFactory', '$routeParams', '$location',
  function($scope, ListDataFactory, $routeParams, $location) {

    ListDataFactory.load().then(function() {
      $scope.item = ListDataFactory.getByPath($routeParams.path);
    });

    $scope.getItemViewTemplate = function() {
      if ($scope.item) {
        switch($scope.item.type) {
          case ListDataFactory.MOVIE:
          case ListDataFactory.SEQUEL:
          case ListDataFactory.PREQUEL:
            return 'app/view/directives/movie-view.html';
          case ListDataFactory.SERIES:
            return 'app/view/directives/series-view.html';
          case ListDataFactory.DOCUMENTARY:
            return 'app/view/directives/documentary-view.html';
          case ListDataFactory.GAME:
            return 'app/view/directives/game-view.html';
        }
      }
    };

    $scope.edit = function() {
      $location.path('/edit/' + $scope.item.path);
    };

    $scope.editSeason = function(season) {
      $location.path('/edit/' + $scope.item.path + '/season/' + season.nr);
    };

    $scope.back = function() {
      $location.path('/');
    };

    $scope.toggleWatched = function(evt, item) {
      evt.stopPropagation();
      evt.preventDefault();

      item.toggleWatched();
      $scope.save();
    };

  }
]);
