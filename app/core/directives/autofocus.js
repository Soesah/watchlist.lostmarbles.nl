angular.module('watchlistApp').directive('autoFocus', ['$timeout',
  function($timeout) {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, $el) {

        function focus() {
          $timeout(function() {
            scope.focussing = false;
            $el.find('input')[0].focus();
          });
        }

        if (!scope.focussing) {
          focus();
          // remember this scope to take the first element rather than the last
          // when there are more than one element asking for autofocus.
          scope.focussing = true;
        }

        scope.$on('autofocus:reset', function() {
          focus();
        });
      }
    };
  }
]);
