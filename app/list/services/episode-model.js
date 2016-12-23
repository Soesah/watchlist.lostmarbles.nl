angular.module('watchlistApp').factory('Episode', [
  function() {

  class Episode {
    constructor({imdbId = null, nr = null, title = null, watched = false}) {
      this.imdbId = imdbId;
      this.nr = nr;
      this.title = title;
      this.watched = watched;
    }
  }

  return Episode;
}]);
