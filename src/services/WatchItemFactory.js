import Movie from 'models/MovieModel';
import Series from 'models/SeriesModel';
import Game from 'models/GameModel';
import Documentary from 'models/DocumentaryModel';
import Franchise from 'models/FranchiseModel';
import moment from 'Moment';
import UUIDUtil from 'core/services/UUIDUtil';

const ALL = true;
const MOVIE = 0;
const SERIES = 1;
const DOCUMENTARY = 2;
const GAME = 3;
const FRANCHISE = 4

class WatchItemFactory {

  static create (item) {
    switch (item.type) {
      case MOVIE:
        return new Movie(item);
      case SERIES:
        return new Series(item);
      case DOCUMENTARY:
        return new Documentary(item);
      case GAME:
        return new Game(item);
      case FRANCHISE:
        return new Franchise(item);
    }
  }

  static new (type = MOVIE, add_date = true) {
    let date = new moment().format('YYYY-MM-DD'),
        data = add_date ? { date_added: date } : {};

    // ensure an imbdId
    data.imdbId = 'NON-IMDB-ID-'
      + WatchItemFactory.getTypeNameByType(type).toUpperCase()
      + '-' + UUIDUtil.uuid4();

    switch(type) {
      case MOVIE:
        return new Movie(data);
      case SERIES:
        return new Series(data);
      case DOCUMENTARY:
        return new Documentary(data);
      case GAME:
        return new Game(data);
      case FRANCHISE:
        return new Franchise(data);
      default:
        return new Movie(data);
    }
  }

  static change (item, type) {
    let newItem = WatchItemFactory.new(type, false),
        promise = new Promise(resolve => {

          if (item) {
            let imdbId = item.imdbId,
                name = item.name,
                year = item.year,
                actors = item.actors,
                plot = item.plot,
                director = item.director,
                length = item.length,
                watched = item.watched,
                date_added = item.date_added;


            if (newItem.hasOwnProperty('imdbId')) {
              newItem.imdbId = imdbId;
            }

            newItem.name = name;
            newItem.date_added = date_added;

            if (type !== DOCUMENTARY && plot) {
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

            if (type === SERIES) {
              newItem.addSeason(year ? year : item.year ? item.year + 1 : null);
            } else {
              newItem.year = year;
            }
          }

          resolve(newItem);
        });

    return promise;
  }

  static getFilterStates () {
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

  static getFilterTypes () {
    let types = this.getTypeList().map(item => {
          item.type = [item.type];
          return item;
        });
    return [
      {
        type: ALL,
        name: 'All'
      }
    ].concat(types);
  }

  static getTypeList () {
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
      }, {
        type: FRANCHISE,
        name: 'Franchise'
      }
    ]
  }

  static getTypeNameByType (type) {
    return _.find(WatchItemFactory.getTypeList(), item => item.type === type).name;
  }

  static getTypeName (item) {
    return (item && item.type !== undefined) ? WatchItemFactory.getTypeNameByType(item.type) : 'Unknown'
  }

  static get ALL () {
    return ALL;
  }
  static get MOVIE () {
    return MOVIE;
  }
  static get SERIES () {
    return SERIES;
  }
  static get DOCUMENTARY () {
    return DOCUMENTARY;
  }
  static get GAME () {
    return GAME;
  }
  static get FRANCHISE () {
    return FRANCHISE;
  }

}
