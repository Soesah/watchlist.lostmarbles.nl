angular.module('watchlistApp').factory('Season', ['Episode', '_',
  function(Episode, _) {

  class Season {
    constructor({year = null, nr = 1, episodes = []}) {
      this.year = year;
      this.nr = nr;
      this.episodes = episodes.map(function(data) {
        return new Episode(data);
      });
    }

    getEpisode(imdbId) {
      return _.find(this.episodes, function(item) {
        return item.imdbId === imdbId;
      });
    }

    createEpisode(imdbId, nr, title) {
      return new Episode({
        imdbId: imdbId,
        nr: nr,
        title: title
      });
    }

    get watched() {
      return this.episodes.length > 0 && _.filter(this.episodes, {watched: false}).length === 0;
    }
  }

  return Season;
}]);
