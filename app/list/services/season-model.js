angular.module('watchlistApp').factory('Season', ['Episode',
  function(Episode) {

  class Season {
    constructor({year = null, watched = false, episodes = []}) {
      this.year = year;
      this.episodes = episodes.map(function(data) {
        return new Episode(data);
      });
      this.watched = watched;
    }
  }

  return Season;
}]);
