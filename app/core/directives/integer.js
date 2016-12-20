angular.module('watchlistApp').directive('integer', ['_', 'KeyUtil',
  function(_, KeyUtil) {
    'use strict';
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, $el, attr, ctrl) {

        // add a parser
        ctrl.$parsers.unshift(function(value) {
          return parseInt(value, 10);
        });

        $el.bind('keydown', function(evt) {
          var value;
          if (evt.which === KeyUtil.UpKey) {
            value = parseInt(ctrl.$viewValue, 10);
            if (!_.isNaN(value)) {
              value++;
              ctrl.$setViewValue(value);
              ctrl.$render();
            }
          }
          if (evt.which === KeyUtil.DownKey) {
            value = parseInt(ctrl.$viewValue, 10);
            if (!_.isNaN(value)) {
              value--;

              if (attr.min && value < attr.min) {
                value = attr.min;
              }

              ctrl.$setViewValue(value);
              ctrl.$render();
            }
          }
        });
      }
    };
  }
]);
