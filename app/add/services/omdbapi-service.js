angular.module('watchlistApp').factory('OMDbApi', ['$q', '$http', 'OMDbResults', 'OMDbObject',
  function($q, $http, OMDbResults, OMDbObject) {

    class OMDbApi {
      constructor() {
        this.url = 'http://www.omdbapi.com/';
      }

      request(url, Model) {
        return $q(function(resolve, reject) {
          $http.get(url).then(function(response) {
            let data = response.data;
            if (data.Response === 'True') {
              resolve(new Model(data));
            } else {
              reject(data);
            }
          }, function(response) {
             reject(response);
          });
        });
      }

      search(name, year) {
        return this.request(this.url + '?s=' + name + (year ? '&y=' + year : ''), OMDbResults);
      }

      lucky(name) {
        return this.request(this.url + '?t=' + name + '&y=&plot=short&r=json', OMDbObject);
      }

      get(id) {
        return this.request(this.url + '?i=' + id + '&r=json', OMDbObject);
      }

      getInternalType(type) {
        switch(type) {
          case 'movie':
            return 0;
          case 'series':
            return 1;
          case 'game':
            return 3;
        }
      }
    }

    return new OMDbApi();
}]);