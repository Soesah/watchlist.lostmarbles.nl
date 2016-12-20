angular.module('watchlistApp', ['ngRoute', 'templates-main']);

// set up lodash
angular.module('watchlistApp').factory('_', ['$window',
  function($window) {
    'use strict';
    return $window._;
  }
]);
