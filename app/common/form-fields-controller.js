angular.module('watchlistApp').controller('FormFieldsController', ['$scope', '_', 'ListDataFactory', 'OMDbApi',
  function($scope, _, ListDataFactory,  OMDbApi) {

    // proxy the type, so that we can safely switch between models
    $scope.itemType = $scope.item.type;
    $scope.types = ListDataFactory.getTypeList();
    $scope.searching = false;
    $scope.suggestions = [];
    $scope.totalSuggestions = 0;
    $scope.doubles = [];

    if (!_.find($scope.types, {type: $scope.itemType})) {
      $scope.types = ListDataFactory.getFullTypeList();
    }

    // change the item when type changes
    let itemTypeChangeHandler = function(newValue, oldValue) {
          if (newValue !== oldValue) {
            ListDataFactory.change($scope.item, newValue).then(function(item) {
              $scope.item = item;
            });
          }
        },
        itemTypeWatcher = $scope.$watch('itemType', itemTypeChangeHandler);

    // show a warning if you can find items in the list with similar names
    $scope.$watch('item.name', function(value) {
      let doubles = [];
      if (value && value.length > 2) {
        doubles = ListDataFactory.find(value).splice(0,3);

        if ($scope.editing && doubles&& $scope.item.path) {
          let item = _.find(doubles, {path: $scope.item.path }),
              index = doubles.indexOf(item);

          doubles.splice(index, 1);
        }
      }
      $scope.doubles = doubles;
    });

    function isMovie(item) {
      return item.type === ListDataFactory.MOVIE ||
             item.type === ListDataFactory.SEQUEL ||
             item.type === ListDataFactory.PREQUEL;
    }
    function isSeries(item) {
      return item.type === ListDataFactory.SERIES;
    }
    function isGame(item) {
      return item.type === ListDataFactory.GAME;
    }
    function isDocumentary(item) {
      return item.type === ListDataFactory.DOCUMENTARY;
    }

    $scope.isMovie = function() {
      return isMovie($scope.item);
    };
    $scope.isSeries = function() {
      return isSeries($scope.item);
    };
    $scope.isGame = function() {
      return isGame($scope.item);
    };
    $scope.addSeason = function() {
      $scope.item.addSeason($scope.item.lastYear ? $scope.item.lastYear + 1 : null);
    };
    $scope.isDocumentary = function() {
      return isDocumentary($scope.item);
    };

    // search the omdb api using the name
    $scope.search = function() {
      // don't find without a name
      if ($scope.item.name) {
        $scope.searching = true;
        OMDbApi.search($scope.item.name, $scope.item.year).then(function(data) {
          $scope.searching = false;
          $scope.suggestions = data.results;
          $scope.totalSuggestions = data.count;
        }, function() {
          $scope.searching = false;
        });
      }
    };

    // reset suggestions when clicking elsewhere or changing name
    $scope.$watch('item.name', function() {
      $scope.suggestions = [];
    });

    $scope.$on('content:click', function() {
      $scope.$apply(function() {
        $scope.suggestions = [];
      });
    });

    // choose a suggestions
    $scope.choose = function(suggestion) {
      let imdbId = suggestion.imdbID;
      $scope.searching = true;
      $scope.suggestions = [];

      itemTypeWatcher(); // disable the watcher

      // first use the omdb api to get the full data for the movie, series or game
      OMDbApi.get(imdbId).then(function(data) {
        $scope.searching = false;
        ListDataFactory.change(null, data.getInternalType()).then(function(item) {
          let year = parseInt(data.year);

          $scope.itemType = item.type;
          item.imdbId = data.imdbId;
          item.name = data.title;
          item.actors = data.actors.split(',').map(function(item) {
            return item.trim();
          });
          item.watched = data.watched;
          if (isMovie(item)) {
            item.plot = data.plot;
            item.director = data.director;
            item.length = data.runtime;
          } else if (isGame(item)) {
            item.plot = data.plot;
          }
          if (isSeries(item)) {
            item.plot = data.plot;
            // add a season for the first year
            // parse year, since values can be '2016-'
            item.addSeason(year);
            // try adding seasons for subsequent years
            // while (item.seasons.length < data.seasons) {
            //   item.addSeason(year + item.seasons.length);
            // }
          } else {
            item.year = year;
          }
          $scope.item = item;
        }).then(function() {
          // re-initialize the itemType watcher
          itemTypeWatcher = $scope.$watch('itemType', itemTypeChangeHandler);
        });

      }, function() {
        $scope.searching = false;
        itemTypeWatcher = $scope.$watch('itemType', itemTypeChangeHandler);
      });
    };
  }
]);
