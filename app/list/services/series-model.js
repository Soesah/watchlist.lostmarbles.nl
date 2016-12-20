angular.module('watchlistApp').factory('Series', ['_', 'Season',
  function(_, Season) {

  class Series {
    constructor({name = null, seasons = []}) {
      this.type = 1;
      this.name = name;
      this.seasons = seasons.map(function(data) {
        return new Season(data);
      });
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
