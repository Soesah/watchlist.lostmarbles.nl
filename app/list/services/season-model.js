angular.module('watchlistApp').factory('Season', [
  function() {

  class Season {
    constructor({year = null, score = null, watched = false}) {
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Season;
}]);
