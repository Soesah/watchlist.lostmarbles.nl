import Movie from 'models/MovieModel';
import Series from 'models/SeriesModel';
import Game from 'models/GameModel';
import Documentary from 'models/DocumentaryModel';
import moment from 'Moment';

const ALL = true;
const MOVIE = 0;
const SERIES = 1;
const DOCUMENTARY = 2;
const GAME = 3;
const Franchise = 4

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
    }
  }

  static new (type, add_date = true) {
    let date = new moment().format('YYYY-MM-DD'),
        data = add_date ? { date_added: date } : {};

    switch(type) {
      case MOVIE:
        return new Movie(data);
      case SERIES:
        return new Series(data);
      case DOCUMENTARY:
        return new Documentary(data);
      case GAME:
        return new Game(data);
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
      }
    ]
  }

  static getTypeName (item) {
    return (item && item.type !== undefined) ? _.find(WatchItemFactory.getTypeList(), type => type.type === item.type).name : 'Unknown';
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

}
