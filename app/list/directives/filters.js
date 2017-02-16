angular.module('watchlistApp').directive('filters', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/list/directives/filters.html',
    link: function(scope) {
      scope.showMore = false;
    }
  };
});