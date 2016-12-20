angular.module('watchlistApp').directive('message', ['$timeout',
  function($timeout) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: 'app/core/directives/message.html',
      link: function(scope, $el) {
        var time;
        switch (scope.message.type) {
          case 'error':
            break;
          case 'warning':
          case 'info':
            time = scope.message.type === 'info' ? 2000 : 5000;
            if (scope.message.time) {
              time = scope.message.time;
            }
            $timeout(function() {
              scope.closeMessage(null, $el, scope.message);
            }, time);
            break;
        }

        scope.$on('message:clear', function(evt, key) {
          if (key === scope.message.key) {
            scope.closeMessage(null, $el, scope.message);
          }
        });

        $timeout(function() {
          $el.removeClass('done');
        }, 0);
        $el.addClass(scope.message.type);
        $el.children()[0].className += ' icon-' + scope.message.type;
      }
    };
  }
]);
