angular.module('watchlistApp').factory('ListDataFactory', ['BaseFactory', 'Movie', 'Series', 'Documentary',
  function(BaseFactory, Movie, Series, Documentary) {

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
      return data.map(function(data) {
        if (data.type === _this.MOVIE) {
          return new Movie(data);
        }
        if (data.type === _this.SERIES) {
          return new Series(data);
        }
        if (data.type === _this.DOCUMENTARY) {
          return new Documentary(data);
        }
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

    get TYPES() {
      return [this.SERIES, this.MOVIE, this.DOCUMENTARY];
    }

    new(type) {
      switch(type) {
        case this.MOVIE:
          return new Movie({});
        case this.SERIES:
          return new Series({});
        case this.DOCUMENTARY:
          return new Documentary({});
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
        }
      ]
    }
  }

  return new ListDataFactory();
}]);
