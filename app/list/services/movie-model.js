angular.module('watchlistApp').factory('Movie', [
  function() {

  class Movie {
    constructor({name = null, year = null, score = null, watched = false}) {
      this.type = 0;
      this.name = name;
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Movie;
}]);
