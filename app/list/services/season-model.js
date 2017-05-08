angular.module('watchlistApp').factory('Season', ['Episode', '_',
  function(Episode, _) {

  class Season {
    constructor({year = null, episodes = []}) {
      this.year = year;
      this.episodes = episodes.map(function(data) {
        return new Episode(data);
      });
    }

    get watched() {
      return this.episodes.length > 0 && _.filter(this.episodes, {watched: false}).length === 0;
    }
  }

  return Season;
}]);
