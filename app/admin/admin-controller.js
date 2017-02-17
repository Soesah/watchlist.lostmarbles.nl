angular.module('watchlistApp').controller('AdminController', ['$scope', '$location', 'ListDataFactory', 'OMDbApi', '$timeout',
  function($scope, $location, ListDataFactory, OMDbApi, $timeout) {

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
    let movie_additions = [{
      from: 'runtime',
      to: 'length'
    },{
      from: 'plot',
      to: 'plot'
    },{
      from: 'director',
      to: 'director'
    }];

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

          if (!OMDbApi.isUpdated(item, movie_additions)) {
            // you want to do one request to update the item with the properties
            yield OMDbApi.update(item, movie_additions).then(function() {
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


    $scope.back = function() {
      $location.path('/');
    };
  }
]);
