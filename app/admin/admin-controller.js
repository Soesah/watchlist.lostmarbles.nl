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
    let text = 'Press the button to update items with an <code>imbdId</code> with <ul class="additions">',
        additions = [{
            from: 'Runtime',
            to: 'length'
          },{
            from: 'plot',
            to: 'plot'
          },{
            from: 'Director',
            to: 'director'
          }];

    $scope.action = $sce.trustAsHtml(text + additions.map(function(item, index) {
      return '<li><code class="from">' 
        + item.from 
        + '</code> as <code class="to">' 
        + item.to 
        + '</code></li>';
    }).join('') + '</ul>');

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
