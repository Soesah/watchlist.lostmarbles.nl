import Movie from 'models/MovieModel';
import Sequel from 'models/SequelModel';
import Prequel from 'models/PrequelModel';
import Series from 'models/SeriesModel';
import Game from 'models/GameModel';
import Documentary from 'models/DocumentaryModel';

class WatchItemFactory {

  create (item) {
    switch (item.type) {
      case this.MOVIE:
        return new Movie(item);
      case this.SEQUEL:
        return new Sequel(item);
      case this.PREQUEL:
        return new Prequel(item);
      case this.SERIES:
        return new Series(item);
      case this.DOCUMENTARY:
        return new Documentary(item);
      case this.GAME:
        return new Game(item);
    }
  }

  new (type) {
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

  get ALL () {
    return true;
  }

  get MOVIE () {
    return 0;
  }

  get SEQUEL () {
    return 4;
  }

  get PREQUEL () {
    return 5;
  }

  get SERIES () {
    return 1;
  }

  get DOCUMENTARY () {
    return 2;
  }

  get GAME () {
    return 3;
  }

  static getFilterStates() {
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

  static getFilterTypes() {
    let types = this.getTypeList().map(item => {
          if (item.type === this.MOVIE) {
            item.type = [item.type, this.SEQUEL, this.PREQUEL];
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

  static getTypeList() {
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

  static getFullTypeList() {
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

  static getTypeName(item) {
    return item && item.type ? _.find(WatchItemFactory.getFullTypeList(), {type: item.type}).name : 'Unknown';
  }

}
