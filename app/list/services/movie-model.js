angular.module('watchlistApp').factory('Movie', ['BaseModel',
  function(BaseModel) {

  class Movie extends BaseModel {
    constructor({imdbId = null, name = null, year = null, score = null, actors = [], watched = false}) {
      super();
      this.type = 0;
      this.imdbId = imdbId;
      this.name = name;
      this.year = year;
      this.score = score;
      this.actors = actors;
      this.watched = watched;
    }
  }

  return Movie;
}]);
