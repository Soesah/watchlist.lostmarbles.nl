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

    togglePlayed() {
      this.played = !this.played;
    }

    toggleWatched() {
      this.togglePlayed();
    }

    isComplete() {
      return this.name && this.year;
    }
  }

  return Game;
}]);
