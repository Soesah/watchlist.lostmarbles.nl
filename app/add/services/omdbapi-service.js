angular.module('watchlistApp').factory('OMDbApi', ['$q', '$http', 'OMDbResults', 'OMDbObject',
  function($q, $http, OMDbResults, OMDbObject) {

    class OMDbApi {
      constructor() {
        this.url = 'http://www.omdbapi.com/';
      }

      request(url, Model) {
        return $q(function(resolve, reject) {
          $http.get(url).success(function(data) {
            if (data.Response === "True") {
              resolve(new Model(data));
            } else {
              reject(data);
            }
          });
        });
      }

      search(name) {
        return this.request(this.url + '?s=' + name, OMDbResults);
      }

      find(name) {
        return this.request(this.url + '?t=' + name + '&y=&plot=short&r=json', OMDbObject);
      }
    }

    return new OMDbApi();
}]);