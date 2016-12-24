angular.module('watchlistApp').factory('ListDataFactory', ['BaseFactory', 'Movie', 'Series', 'Documentary', 'Game', '_',
  function(BaseFactory, Movie, Series, Documentary, Game, _) {

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
      return [this.SERIES, this.MOVIE, this.DOCUMENTARY, this.GAME];
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
          type: this.MOVIE,
          name: 'Movie'
        }, {
          type: this.SERIES,
          name: 'Series'
        }, {
          type: this.GAME,
          name: 'Game'
        }
      ]
    }
  }

  return new ListDataFactory();
}]);
