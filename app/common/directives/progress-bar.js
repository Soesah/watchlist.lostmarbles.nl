angular.module('watchlistApp').directive('progressBar', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/directives/progress-bar.html',
    scope: {
      data: '=ngModel'
    },
    link: function(scope, $el) {
      scope.$watch('data.progress', function() {
        let percentage = Math.ceil((scope.data.progress / scope.data.max) * 10000) / 100;
        $el.children().css('width', percentage + '%');
      });
    }
  };
});