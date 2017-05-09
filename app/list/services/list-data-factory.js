angular.module('watchlistApp').factory('ListDataFactory', ['$q', 'BaseFactory', 'Movie', 'Sequel', 'Prequel', 'Series', 'Documentary', 'Game', '_',
  function($q, BaseFactory, Movie, Sequel, Prequel, Series, Documentary, Game, _) {

  class ListDataFactory extends BaseFactory{
    constructor() {
      super();
      this.url = 'data/list.json';
    }

    save(data) {
      this.url = 'backend.php';
      let promise = super.save(data);
      this.url = 'data/list.json';
      return promise;
    }

    parseData(data) {
      let _this = this;
      return data.data.map(function(data) {

        switch (data.type) {
          case _this.MOVIE:
            return new Movie(data);
          case _this.SEQUEL:
            return new Sequel(data);
          case _this.PREQUEL:
            return new Prequel(data);
          case _this.SERIES:
            return new Series(data);
          case _this.DOCUMENTARY:
            return new Documentary(data);
          case _this.GAME:
            return new Game(data);
        }
      });
    }

    find(name) {
      let suggestions = _.filter(this.data, function(item) {
        return item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
      });

      suggestions.sort(function(a, b) {
        if (a.name.toLowerCase().indexOf(name) === b.name.toLowerCase().indexOf(name)) {
          return a.name.length < b.name.length ? -1 : 1;
        } else if (a.name.toLowerCase().indexOf(name) === 0) {
          return -1;
        } else if (b.name.toLowerCase().indexOf(name) === 0) {
          return 1;
        } else {
          return a.year < b.year ? -1 : 1;
        }
      });

      return suggestions;
    }

    getRelated(item) {
      return _.filter(this.data, {parent: item.imdbId});
    }

    getByPath(path) {
      return _.find(this.data, function(item) {
        return item.path === path;
      });
    }

    getMovies() { // with an imdbId
      let _this = this;
      return _.filter(this.data, function(item) {
        return item.imdbId &&
          (item.type === _this.MOVIE ||
           item.type === _this.SEQUEL ||
           item.type === _this.PREQUEL);
      });
    }

    getSeries() { // with an imdbId
      let _this = this;
      return _.filter(this.data, function(item) {
        return item.imdbId &&
          (item.type === _this.SERIES);
      });
    }

    get ALL() {
      return true;
    }

    get MOVIE() {
      return 0;
    }

    get SEQUEL() {
      return 4;
    }

    get PREQUEL() {
      return 5;
    }

    get SERIES() {
      return 1;
    }

    get DOCUMENTARY() {
      return 2;
    }

    get GAME() {
      return 3;
    }

    new(type) {
      switch(type) {
        case this.MOVIE:
          return new Movie({});
        case this.SEQUEL:
          return new Sequel({});
        case this.PREQUEL:
          return new Prequel({});
        case this.SERIES:
          return new Series({});
        case this.DOCUMENTARY:
          return new Documentary({});
        case this.GAME:
          return new Game({});
      }
    }

    change(item, type) {
      let _this = this,
          newItem = this.new(type),
          promise = $q(function(resolve) {

            if (item) {
              let imdbId = item.imdbId,
                  name = item.name,
                  year = item.year,
                  actors = item.actors,
                  plot = item.plot,
                  director = item.director,
                  length = item.length,
                  watched = item.watched;


              if (newItem.hasOwnProperty('imdbId')) {
                newItem.imdbId = imdbId;
              }

              newItem.name = name;

              if (type !== _this.DOCUMENTARY && plot) {
                newItem.plot = plot;
              }

              if (newItem.hasOwnProperty('director') && director) {
                newItem.director = director;
              }

              if (newItem.hasOwnProperty('length') && length) {
                newItem.length = length;
              }

              if (newItem.hasOwnProperty('watched')) {
                newItem.watched = watched;
              }

              if (newItem.hasOwnProperty('actors')) {
                newItem.actors = actors ? actors : [];
              }

              if (type === _this.SERIES) {
                newItem.addSeason(year ? year : item.year ? item.year + 1 : null);
              } else {
                newItem.year = year;
              }
            }

            resolve(newItem);
          });

      return promise;
    }

    getFilterStates() {
      return [
        {
          state: null,
          name: 'All'
        },{
          state: true,
          name: 'Yes'
        },{
          state: false,
          name: 'No'
        }
      ];
    }

    getFilterList() {
      let _this = this,
          types = this.getTypeList().map(function(item) {
            if (item.type === _this.MOVIE) {
              item.type = [item.type, _this.SEQUEL, _this.PREQUEL];
            } else {
              item.type = [item.type];
            }
            return item;
          });
      return [
        {
          type: this.ALL,
          name: 'All'
        }
      ].concat(types);
    }

    getTypeList() {
      return [
        {
          type: this.DOCUMENTARY,
          name: 'Documentary'
        }, {
          type: this.GAME,
          name: 'Game'
        }, {
          type: this.MOVIE,
          name: 'Movie'
        }, {
          type: this.SERIES,
          name: 'Series'
        }
      ]
    }

    getFullTypeList() {
      return [
        {
          type: this.SEQUEL,
          name: 'Sequel',
          disabled: true
        }, {
          type: this.PREQUEL,
          name: 'Prequel',
          disabled: true
        }
      ].concat(this.getTypeList());
    }

    getTypeName(item) {
      return item ? _.find(this.getFullTypeList(), {type: item.type}).name : 'Unknown';
    }
  }

  return new ListDataFactory();
}]);
