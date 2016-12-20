angular.module('watchlistApp').directive('list', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/list/directives/list.html'
  };
});