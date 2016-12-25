angular.module('watchlistApp').factory('Game', [
  function() {

  class Game {
    constructor({imdbId = null, name = null, year = null, score = null, played = false}) {
      this.type = 3;
      this.imdbId = imdbId;
      this.name = name;
      this.year = year;
      this.score = score;
      this.played = played;
    }

    get watched() {
      return this.played;
    }

    set watched(watched) {
      this.played = watched;
    }

    isComplete() {
      return this.imdbId && this.name && this.year;
    }
  }

  return Game;
}]);
