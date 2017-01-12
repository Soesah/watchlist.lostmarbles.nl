angular.module('watchlistApp').factory('Sequel', ['Movie',
  function(Movie) {

  class Sequel extends Movie {
    constructor({parent}) {
      super(arguments[0]);
      this.type = 4;
      this.parent = parent;
    }
  }

  return Sequel;
}]);
