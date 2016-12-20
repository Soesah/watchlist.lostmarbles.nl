angular.module('watchlistApp', ['ngRoute', 'templates']);

// set up lodash
angular.module('watchlistApp').factory('_', ['$window',
  function($window) {
    'use strict';
    return $window._;
  }
]);
