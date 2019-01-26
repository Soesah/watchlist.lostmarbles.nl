import { Movie, MovieType } from '@/models/MovieModel';
import { Game, GameType } from '@/models/GameModel';
import { Series, SeriesType } from '@/models/SeriesModel';
import { Documentary, DocumentaryType } from '@/models/DocumentaryModel';
import { Franchise, FranchiseType } from '@/models/FranchiseModel';

import { UUIDUtil } from '@/core/util/UUIDUtil';
import { WatchlistType } from '@/core/models/BaseModel';
import { DateTimeUtil } from '@/core/util/DateTimeUtil';

const ALL = true;

export type WatchlistItem =
  | MovieType
  | GameType
  | SeriesType
  | DocumentaryType
  | FranchiseType;
export type WatchlistItemsPure = Movie | Series | Documentary | Game;
export type WatchlistItems = WatchlistItemsPure | Franchise;

interface BaseType {
  imdbID?: string;
  date_added?: string;
}

export interface State {
  state: boolean | null;
  name: string;
}

export interface Type {
  type: number;
  name: string;
}

export interface FilterType {
  type: number[] | boolean;
  name: string;
}

export class WatchItemFactory {
  static create(item: WatchlistItem): WatchlistItems {
    let created: any;

    switch (item.type) {
      case WatchlistType.Movie:
        created = new Movie(<MovieType>item);
        break;
      case WatchlistType.Series:
        created = new Series(<SeriesType>item);
        break;
      case WatchlistType.Documentary:
        created = new Documentary(<DocumentaryType>item);
        break;
      case WatchlistType.Game:
        created = new Game(<GameType>item);
        break;
      case WatchlistType.Franchise:
        created = new Franchise(<FranchiseType>item);
        break;
    }

    return created;
  }

  static new(type = WatchlistType.Movie, add_date = true): WatchlistItems {
    const date = DateTimeUtil.now();
    const data: BaseType = add_date ? { date_added: date } : {};

    // ensure an imbdId
    data.imdbID =
      'NON-IMDB-ID-' +
      WatchItemFactory.getTypeNameByType(type).toUpperCase() +
      '-' +
      UUIDUtil.uuid4();

    switch (type) {
      case WatchlistType.Movie:
        return new Movie(<MovieType>data);
      case WatchlistType.Series:
        return new Series(<SeriesType>data);
      case WatchlistType.Documentary:
        return new Documentary(<DocumentaryType>data);
      case WatchlistType.Game:
        return new Game(<GameType>data);
      case WatchlistType.Franchise:
        return new Franchise(<FranchiseType>data);
      default:
        return new Movie(<MovieType>data);
    }
  }

  static change(item: any, type: number): Promise<{}> {
    let newItem = <any>WatchItemFactory.new(type, false),
      promise = new Promise(resolve => {
        if (item) {
          let imdbID = item.imdbID,
            title = item.title,
            year = item.year,
            actors = item.actors,
            plot = item.plot,
            director = item.director,
            length = item.length,
            watched = item.watched,
            date_added = item.date_added;

          if (newItem.hasOwnProperty('imdbID')) {
            newItem.imdbID = imdbID;
          }

          newItem.title = title;
          newItem.date_added = date_added;

          if (type !== WatchlistType.Documentary && plot) {
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

          if (type === WatchlistType.Series) {
            newItem.addSeason(year ? year : item.year ? item.year + 1 : null);
          } else {
            newItem.year = year;
          }
        }

        resolve(newItem);
      });

    return promise;
  }

  static getFilterStates(): State[] {
    return [
      { state: null, name: 'All' },
      { state: true, name: 'Yes' },
      { state: false, name: 'No' }
    ];
  }

  static getFilterTypes(): FilterType[] {
    const types = this.getTypeList().map(
      (item: Type): FilterType => ({ ...item, type: [item.type] })
    );
    return [<FilterType>{ type: ALL, name: 'All' }].concat(types);
  }

  static getTypeList(): Type[] {
    return [
      { type: WatchlistType.Documentary, name: 'Documentary' },
      { type: WatchlistType.Game, name: 'Game' },
      { type: WatchlistType.Movie, name: 'Movie' },
      { type: WatchlistType.Series, name: 'Series' },
      { type: WatchlistType.Franchise, name: 'Franchise' }
    ];
  }

  static getTypeNameByType(type: number): string {
    const item = WatchItemFactory.getTypeList().find(
      (item: Type) => item.type === type
    );
    return item ? item.name : 'Unknown';
  }

  static getTypeName(item: WatchlistItems): string {
    return item && item.type !== undefined
      ? WatchItemFactory.getTypeNameByType(item.type)
      : 'Unknown';
  }
}
