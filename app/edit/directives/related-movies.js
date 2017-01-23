angular.module('watchlistApp').directive('relatedMovies', ['ListDataFactory', 'KeyUtil', '_',
  function(ListDataFactory, KeyUtil, _) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/edit/directives/related-movies.html',
      link: function(scope, $el) {
        scope.search = '';
        scope.related = ListDataFactory.getRelated(scope.item);
        scope.suggestions = [];
        scope.index = 0;

        $el = $el.find('input');

        scope.select = function(item) {
          let parent = scope.item.imdbId,
              index = scope.list.indexOf(item);

          ListDataFactory.change(item, ListDataFactory.SEQUEL).then(function(newItem) {
            
            // provide a parent for the newItem, linking the current movie to the sequel  
            newItem.parent = parent;
            // replace the original item in the list
            scope.list.splice(index, 1, newItem);

            // reset
            scope.index = 0;
            scope.search = '';
            scope.suggestions = [];
            // re-check for related movies
            scope.related = ListDataFactory.getRelated(scope.item);
          });
        };

        $el.on('keyup', function(evt) {
          let value = $el.val();

          if (evt.keyCode === KeyUtil.EnterKey) {
            scope.select(scope.suggestions[scope.index]);
          // } else if (evt.keyCode === KeyUtil.RightKey) {

          } else if (evt.keyCode === KeyUtil.DownKey) {
            scope.$apply(function() {
              scope.index++; //works better visually
            });
          } else if (evt.keyCode === KeyUtil.UpKey) {
            scope.$apply(function() {
              scope.index--;
            });
          } else {
            scope.$apply(function() {
              if (!value) {
                scope.suggestions = [];
              } else {
                let alreadyListed = scope.related.concat(scope.item);
                // limit suggestion to 10 and don't list already listed items
                scope.suggestions = _.filter(ListDataFactory.find(value), function(item) {
                  return _.filter(alreadyListed, {imdbId: item.imdbId}).length === 0;
                }).slice(0, 10);
              }
            });
          }

          if (!KeyUtil.isAlphaNumericKey(evt.keyCode)) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
          }
        });
      }
    };
  }
]);