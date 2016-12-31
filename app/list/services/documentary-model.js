angular.module('watchlistApp').factory('Documentary', [
  function() {

  class Documentary {
    constructor({name = null, year = null, score = null, watched = false}) {
      this.type = 2;
      this.name = name;
      this.year = year;
      this.score = score;
      this.watched = watched;
    }

    isComplete() {
      return this.name && this.year;
    }
  }

  return Documentary;
}]);
