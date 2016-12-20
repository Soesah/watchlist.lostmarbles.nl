angular.module('watchlistApp').factory('BaseFactory', ['$q', '$http',
  function($q, $http) {
    'use strict';

    class BaseFactory {
      constructor() {
        this.promise = null;
      }

      load() {
        let _this = this;

        if (this.promise) {
          return this.promise;
        }

        this.promise = $q(function(resolve) {
          $http.get(_this.url).success(function(data) {
            _this.data = _this.parseData(data);
            _this.storeState();
            resolve(_this.data);
          });
        });

        return this.promise;
      }

      save(data) {
        let _this = this,
            promise = $q(function(resolve) {
              $http.post(_this.url, data).success(function(data) {
                _this.data = _this.parseData(data);
                _this.storeState();
                resolve(_this.data);
              });
            });

        return promise;
      }

      parseData(data) {
        return data;
      }

      storeState() {} // abstract
    }

    return BaseFactory;
  }
]);
