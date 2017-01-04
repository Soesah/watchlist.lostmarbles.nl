angular.module('watchlistApp').directive('formFields', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/directives/form-fields.html'
  };
});