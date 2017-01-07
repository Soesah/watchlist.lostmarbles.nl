angular.module('watchlistApp').directive('item', [
  function() {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      template: '<ng-include src="getItemTemplate()"/>',
      controller: 'ItemController'
    };
  }
]);
