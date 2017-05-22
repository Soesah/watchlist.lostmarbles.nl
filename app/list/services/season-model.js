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

    getEpisodeByNr(nr) {
      return _.find(this.episodes, function(item) {
        return item.nr === nr;
      });
    }

    createEpisode(imdbId, nr, title) {
      return new Episode({
        imdbId: imdbId,
        nr: nr,
        title: title
      });
    }

    insertEpisode(nr, episode) {
      let index = _.findIndex(this.episodes, {nr: nr});
      this.episodes.splice(index + 1, 0, episode);
    }

    toggleWatched() {
      _.each(this.episodes, function(episode) {
        episode.toggleWatched();
      });
    }

    get watched() {
      return this.episodes.length > 0 && _.filter(this.episodes, {watched: false}).length === 0;
    }

    clone() {
      return Object.assign(Object.create(this), JSON.parse(JSON.stringify(this)));
    }
  }

  return Season;
}]);
