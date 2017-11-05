import Movie from 'models/MovieModel';
import Sequel from 'models/SequelModel';
import Prequel from 'models/PrequelModel';
import Series from 'models/SeriesModel';
import Game from 'models/GameModel';
import Documentary from 'models/DocumentaryModel';

const ALL = true;
const MOVIE = 0;
const SEQUEL = 4;
const PREQUEL = 5;
const SERIES = 1;
const DOCUMENTARY = 2;
const GAME = 3;

class WatchItemFactory {

  create (item) {
    switch (item.type) {
      case MOVIE:
        return new Movie(item);
      case SEQUEL:
        return new Sequel(item);
      case PREQUEL:
        return new Prequel(item);
      case SERIES:
        return new Series(item);
      case DOCUMENTARY:
        return new Documentary(item);
      case GAME:
        return new Game(item);
    }
  }

  static new (type) {
    switch(type) {
      case MOVIE:
        return new Movie({});
      case SEQUEL:
        return new Sequel({});
      case PREQUEL:
        return new Prequel({});
      case SERIES:
        return new Series({});
      case DOCUMENTARY:
        return new Documentary({});
      case GAME:
        return new Game({});
      default:
        return new Movie({});
    }
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
          if (item.type === MOVIE) {
            item.type = [item.type, SEQUEL, PREQUEL];
          } else {
            item.type = [item.type];
          }
          return item;
        });
    return [
      {
        type: ALL,
        name: 'All'
      }
    ].concat(types);
  }

  static getTypeList() {
    return [
      {
        type: DOCUMENTARY,
        name: 'Documentary'
      }, {
        type: GAME,
        name: 'Game'
      }, {
        type: MOVIE,
        name: 'Movie'
      }, {
        type: SERIES,
        name: 'Series'
      }
    ]
  }

  static getFullTypeList() {
    return [
      {
        type: SEQUEL,
        name: 'Sequel',
        disabled: true
      }, {
        type: PREQUEL,
        name: 'Prequel',
        disabled: true
      }
    ].concat(this.getTypeList());
  }

  static getTypeName(item) {
    return (item && item.type !== undefined) ? _.find(WatchItemFactory.getFullTypeList(), type => type.type === item.type).name : 'Unknown';
  }

}
