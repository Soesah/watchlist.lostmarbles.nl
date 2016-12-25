angular.module('watchlistApp').factory('Series', ['_', 'Season',
  function(_, Season) {

  class Series {
    constructor({imdbId = null, name = null, seasons = [], actors = []}) {
      this.type = 1;
      this.imdbId = imdbId;
      this.name = name;
      this.seasons = seasons.map(function(data) {
        return new Season(data);
      });
      this.actors = actors;
    }

    isComplete() {
      return this.imdbId && this.name && this.seasons.length && this.actors.length;
    }

    addSeason(year = null) {
      this.seasons.push(new Season({year: year}));
    }

    get watched() {
      return _.filter(this.seasons, {watched: false}).length === 0;
    }

    get year() {
      return this.seasons.length ? this.seasons[0].year : null;
    }

    get lastYear() {
      return this.seasons.length ? this.seasons[this.seasons.length -1].year : null;
    }
  }

  return Series;
}]);
