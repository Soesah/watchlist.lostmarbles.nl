angular.module('watchlistApp').controller('AdminController', ['$scope', '$sce', '$location',
  function($scope, $sce, $location) {

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
    let text = 'Press the button to update items with an <code>imbdId</code> with <ul class="list additions">',
        movie_additions = [{
            from: 'Runtime',
            to: 'length'
          },{
            from: 'plot',
            to: 'plot'
          },{
            from: 'Director',
            to: 'director'
          }];

    $scope.movie_action = movie_additions.length
      ? $sce.trustAsHtml(text + movie_additions.map(function(item) {
        return '<li><code class="from">' 
          + item.from 
          + '</code> as <code class="to">' 
          + item.to 
          + '</code></li>';
        }).join('') + '</ul>')
      : false;

    $scope.series_action = $sce.trustAsHtml("Update series with episode data for all seasons.");

    $scope.update = function() {
      // get a list of items with imdbId
      // keep count
      // build promises
      // start making requests, but space them out with time?
      // update the item
      // update a loading bar
    }


    $scope.back = function() {
      $location.path('/');
    };
  }
]);
