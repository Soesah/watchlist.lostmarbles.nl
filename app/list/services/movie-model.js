angular.module('watchlistApp').factory('Movie', [
  function() {

  class Movie {
    constructor({imdbId = null, name = null, year = null, score = null, actors = [], watched = false}) {
      this.type = 0;
      this.imdbId = imdbId;
      this.name = name;
      this.year = year;
      this.score = score;
      this.actors = actors;
      this.watched = watched;
    }

    isComplete() {
      return this.name && this.year;
    }

    toggleWatched() {
      this.watched = !this.watched;
    }
  }

  return Movie;
}]);
