angular.module('watchlistApp').controller('EditSeasonController', ['$scope', '_', 'ListDataFactory', '$location', '$routeParams',
  function($scope, _, ListDataFactory, $location, $routeParams) {


    $scope.item = ListDataFactory.getByPath($routeParams.path);
    let nr = parseInt($routeParams.nr);
    $scope.originalSeason = $scope.item.getSeason(nr);
    $scope.season = $scope.originalSeason.clone();
    $scope.editing = true;

    // edit the item to the list
    $scope.editItem = function() {

      _.merge($scope.originalSeason, $scope.season);

      $scope.save().then(function() {
        $location.path('/view/' + $routeParams.path);
      });
    };

    $scope.back = function() {
      $location.path('/view/' + $routeParams.path);
    };

    $scope.addEpisode = function(episode) {
      let nr = episode.nr + 1,
          newEpisode = $scope.season.createEpisode('NON-IMDB-ID-' + $scope.season.year + '-' + $scope.season.nr + '-' + nr , nr, '');

      $scope.season.insertEpisode(episode.nr, newEpisode);
    };

    $scope.isInSequence = function(episode) {
      let nr = episode.nr,
          next = $scope.season.getEpisodeByNr(nr + 1);

      return !next;
    };

  }
]);
