angular.module('watchlistApp').directive('filters', ['_', function(_) {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/list/directives/filters.html',
    link: function(scope) {
      scope.showMore = false;

      scope.isActive = function(type) {
        return _.isEqual(scope.filter.itemType, type.type);
      }
    }
  };
}]);