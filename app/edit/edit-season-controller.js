angular.module('watchlistApp').controller('EditSeasonController', ['$scope', '_', 'ListDataFactory', 'OMDbApi', '$location', '$routeParams',
  function($scope, _, ListDataFactory, OMDbApi, $location, $routeParams) {


    $scope.item = ListDataFactory.getByPath($routeParams.path);
    let nr = parseInt($routeParams.nr);
    $scope.originalSeason = $scope.item.getSeason(nr);
    $scope.season = $scope.originalSeason.clone();
    $scope.editing = true;

    // edit the item to the list
    $scope.editItem = function() {

      _.merge($scope.originalSeason, $scope.season);

      let item = _.find($scope.list, {path: $scope.item.path});

      if (!item) {
        throw new Error('Cannot find item to update');
      } else {
        _.merge(item, $scope.item);
      }

      $scope.save().then(function() {
        $location.path('/view/' + item.path);
      });
    };

    $scope.back = function() {
      $location.path('/view/' + $routeParams.path);
    };

    $scope.addEpisode = function(episode) {
      let nr = episode ? episode.nr + 1 : 1,
          newEpisode = $scope.season.createEpisode('NON-IMDB-ID-' + $scope.season.year + '-' + $scope.season.nr + '-' + nr , nr, '');

      $scope.season.insertEpisode(nr - 1, newEpisode);
    };

    $scope.isInSequence = function(episode) {
      let nr = episode.nr,
          next = $scope.season.getEpisodeByNr(nr + 1);

      return !next;
    };

    $scope.updating = false;
    $scope.updateSeason = function(series, nr) {
      $scope.updating = true;
      OMDbApi.updateSeason(series, nr).then(function() {
        $scope.updating = false;
        $scope.item = ListDataFactory.getByPath($routeParams.path);
        let nr = parseInt($routeParams.nr);
        $scope.originalSeason = $scope.item.getSeason(nr);
        $scope.season = $scope.originalSeason.clone();
        $scope.editing = true;
      });
    };

  }
]);
