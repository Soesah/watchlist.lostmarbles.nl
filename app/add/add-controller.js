angular.module('watchlistApp').controller('AddController', ['$scope', 'ListDataFactory', 'OMDbApi', '$location',
  function($scope, ListDataFactory, OMDbApi, $location) {

    $scope.item = ListDataFactory.new(ListDataFactory.MOVIE);

    // proxy the type, so that we can safely switch between models
    $scope.itemType = $scope.item.type;
    $scope.types = ListDataFactory.getTypeList();

    // change the item when type changes
    let itemTypeChangeHandler = function(newValue, oldValue) {
          if (newValue !== oldValue) {
            ListDataFactory.change($scope.item, newValue).then(function(item) {
              $scope.item = item;
            });
          }
        },
        itemTypeWatcher = $scope.$watch('itemType', itemTypeChangeHandler);

    $scope.isSeries = function() {
      return $scope.item.type === ListDataFactory.SERIES;
    };
    $scope.addSeason = function() {
      $scope.item.addSeason($scope.item.lastYear ? $scope.item.lastYear + 1 : null);
    };
    $scope.isDocumentary = function() {
      return $scope.item.type === ListDataFactory.DOCUMENTARY;
    };
    $scope.isGame = function() {
      return $scope.item.type === ListDataFactory.GAME;
    };

    // add the item to the list
    $scope.addItem = function() {

      if (!$scope.item.isComplete()) {
        return;
      }

      $scope.list.push($scope.item);

      $scope.save().then(function() {
        $location.path('/');
      }, function() {
        // remove the item from the list, since we stay on the add page
        $scope.list.splice($scope.list.indexOf($scope.item, 1))
      });
    };
    $scope.searching = false;
    $scope.suggestions = [];
    $scope.totalSuggestions = 0;

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
    $scope.$watch('item.name', function() {
      $scope.suggestions = [];
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
          $scope.itemType = item.type;
          item.imdbId = data.imdbId;
          item.name = data.title;
          item.actors = data.actors;
          if (item.type === ListDataFactory.SERIES) {
            // add a season for the first year
            // parse year, since values can be '2016-'
            let year = parseInt(data.year);
            item.addSeason(year);
            // try adding seasons for subsequent years
            // while (item.seasons.length < data.seasons) {
            //   item.addSeason(year + item.seasons.length);
            // }
          } else {
            item.year = data.year;
          }
          $scope.item = item;
        }).then(function() {
          // re-initialize the itemType watcher
          itemTypeWatcher = $scope.$watch('itemType', itemTypeChangeHandler);
        }) ;

      });
    };

    $scope.back = function() {
      $location.path('/');
    };

    $scope.$on('content:click', function() {
      $scope.$apply(function() {
        $scope.suggestions = [];
      });
    });
  }
]);
