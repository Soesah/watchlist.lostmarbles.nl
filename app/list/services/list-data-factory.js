angular.module('watchlistApp').factory('ListDataFactory', ['$q', 'BaseFactory', 'Movie', 'Series', 'Documentary', 'Game', '_',
  function($q, BaseFactory, Movie, Series, Documentary, Game, _) {

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
        if (data.type === _this.MOVIE) {
          return new Movie(data);
        }
        if (data.type === _this.SERIES) {
          return new Series(data);
        }
        if (data.type === _this.DOCUMENTARY) {
          return new Documentary(data);
        }
        if (data.type === _this.GAME) {
          return new Game(data);
        }
      });
    }

    find(name) {
      return _.filter(this.data, function(item) {
        return item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
      });
    }

    get ALL() {
      return true;
    }

    get MOVIE() {
      return 0;
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

    get TYPES() {
      return [this.DOCUMENTARY, this.GAME, this.SERIES, this.MOVIE];
    }

    new(type) {
      switch(type) {
        case this.MOVIE:
          return new Movie({});
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
              let name = item.name,
                  year = item.year,
                  actors = item.actors;

              newItem.name = name;
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
      return [
        {
          type: this.ALL,
          name: 'All'
        }
      ].concat(this.getTypeList());
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

    getTypeName(item) {
      return _.find(this.getTypeList(), {type: item.type}).name;
    }
  }

  return new ListDataFactory();
}]);
