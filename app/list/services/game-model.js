angular.module('watchlistApp').factory('Game', ['BaseModel',
  function(BaseModel) {

  class Game extends BaseModel{
    constructor({imdbId = null, name = null, year = null, score = null, plot = null, actors = [], played = false}) {
      super();
      this.type = 3;
      this.imdbId = imdbId;
      this.name = name;
      this.year = year;
      this.score = score;
      this.plot = plot;
      this.actors = actors;
      this.played = played;
    }

    togglePlayed() {
      this.played = !this.played;
    }

    toggleWatched() {
      this.togglePlayed();
    }

    get watched() {
      return this.played;
    }
  }

  return Game;
}]);
