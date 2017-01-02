angular.module('watchlistApp').factory('Documentary', ['BaseModel',
  function(BaseModel) {

  class Documentary extends BaseModel{
    constructor({name = null, year = null, score = null, watched = false}) {
      super();
      this.type = 2;
      this.name = name;
      this.year = year;
      this.score = score;
      this.watched = watched;
    }
  }

  return Documentary;
}]);
