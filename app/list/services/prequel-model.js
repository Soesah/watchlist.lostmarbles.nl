angular.module('watchlistApp').factory('Prequel', ['Movie',
  function(Movie) {

  class Prequel extends Movie {
    constructor({parent}) {
      super(arguments[0]);
      this.type = 5;
      this.parent = parent;
    }
  }

  return Prequel;
}]);
