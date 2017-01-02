angular.module('watchlistApp').factory('Game', ['BaseModel',
  function(BaseModel) {

  class Game extends BaseModel{
    constructor({imdbId = null, name = null, year = null, score = null, played = false}) {
      super();
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
  }

  return Game;
}]);
