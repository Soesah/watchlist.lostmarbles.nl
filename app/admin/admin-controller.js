angular.module('watchlistApp').controller('AdminController', ['$scope', '$q', '$location', 'ListDataFactory', 'OMDbApi', '$timeout', '_',
  function($scope, $q, $location, ListDataFactory, OMDbApi, $timeout, _) {

/*
  Available and used from omdb: 
  ✓ Title
  ✓ Year
    Rated
    Released
    Runtime
    Genre
    Director
    Writer
  ✓ Actors
    Plot
    Language
    Country
    Awards
    Poster
    Metascore
    imdbRating
    imdbVotes
*/
    let movie_additions = [];

    $scope.movie_actions = movie_additions;
    $scope.movie_progress = {min: 0, max: 0, progress: 0};

    $scope.updateMovies = function() {
      // get a list of items with imdbId
      let items = ListDataFactory.getMovies();

      $scope.movie_progress.max = items.length;

      function *updater(items) {
        let index = 0;

        while(items[index]) {
          let item = items[index];

          if (!OMDbApi.isUpdatedMovie(item, movie_additions)) {
            // you want to do one request to update the item with the properties
            yield OMDbApi.updateMovie(item, movie_additions).then(function() {
              // and then it finishes, do the next
              if (u.next().done) {
                $scope.save();
              }
            }, function() {
              if (u.next().done) {
                $scope.save();
              }              
            });
          } else {
            yield $timeout(function() {            
              if (u.next().done) {
                $scope.save();
              }
            });
            
          }

          index++;
          // update the progress bar
          $scope.movie_progress.progress = index;
        }
      }

      let u = updater(items);

      u.next();

    }

    let series_additions = ["Update seasons and episodes"];

    $scope.series_actions = series_additions;
    $scope.series_progress = {min: 0, max: 0, progress: 0};

    $scope.updateSeries = function() {
      // get a list of items with imdbId
      let items = ListDataFactory.getSeries();

      $scope.series_progress.max = items.length;

      // fetch the season and add the episodes
      function *updater(items) {
        let index = 0;

        while(items[index]) {
          let item = items[index];

          // a series is updated if all seasons have episodes, and the season list is complete
          // perhaps there is no such thing and you just have to update them all.
          // or you could add a prop to say a series is finished.
          if (!item.isFinished()) {
            // you want to do one request to update the item with the properties
            yield OMDbApi.updateSeries(item).then(function(result) {

              $scope.series_progress_max += result.seasons;

              $scope.updateSeasons(item, result.seasons).then(function() {
                // and then it finishes, do the next
                if (u.next().done) {
                  $scope.save();
                }
              });

            }, function() { // continue on failure
              if (u.next().done) {
                $scope.save();
              }
            });
          } else {
            // continue with next
            yield $timeout(function() {
              if (u.next().done) {
                $scope.save();
              }
            });
          }

          index++;
          // update the progress bar
          $scope.series_progress.progress = index;
        }
      }

      let u = updater(items);

      u.next();
    }

    $scope.updateSeasons = function(series, seasons) {
      let items = _.times(seasons, nr => ({
            nr: nr + 1
          }));

      return $q(function(resolve) {

        function *updater(items) {
          let index = 0;

          while(items[index]) {
            let item = items[index];

            yield OMDbApi.updateSeason(series, item.nr).then(function() {

              // and then it finishes, do the next
              if (u.next().done) {
               resolve();
              }

            }, function() { // continue on failure
              if (u.next().done) {
               resolve();
              }
            });

            index++;
            // update the progress bar
            $scope.series_progress.progress += 1;
          }
        }

        let u = updater(items);

        u.next();
      });
    }

    $scope.back = function() {
      $location.path('/');
    };

  }
]);
