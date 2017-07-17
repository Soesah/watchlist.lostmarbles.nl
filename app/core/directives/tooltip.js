angular.module('watchlistApp').directive('tooltip', ['$compile', function($compile) {
  'use strict';
  return {
    link: function(scope, $el, attrs) {
      scope.tooltip = false;

      var data = attrs.tooltip.split('|'),
          tooltip = $compile('<div class="tooltip tooltip-'
            + data[1]
            + '" ng-if="tooltip"><div class="tooltip-text" ng-bind="'
            + data[0]
            + '"></div></div>')(scope);

      $el.append(tooltip);

      $el.on('mouseenter', function() {
        scope.$apply(function() {
          scope.tooltip = true;
        });
      });
      $el.on('mouseleave', function() {
        scope.$apply(function() {
          scope.tooltip = false;
        });
      });
    }
  };
}]);
