angular.module('watchlistApp').directive('body', ['KeyUtil', function(KeyUtil) {
  'use strict';
  return {
    restrict: 'E',
    link: function(scope, $el) {
      $el.on('click', function() {
        scope.$broadcast('content:click', 'body');
      });
      $el.on('keyup', function(evt) {
        if (evt.keyCode === KeyUtil.EscapeKey) {
          scope.$broadcast('content:click', 'body');
        }
      });
    }
  };
}]);