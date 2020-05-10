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
export type FranchiseItems = WatchlistItems | undefined;

interface BaseType {
  imdbID?: string;
  date_added?: string;
}

export interface State {
  name: string;
  value: boolean;
}

export interface Type {
  name: string;
  value: number;
}

export interface Sort {
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

  static change(item: any, type: number): Promise<any> {
    // do not change if no need to change
    if (item && item.type === type) {
      return new Promise((resolve) => {
        resolve(item);
      });
    }

    let newItem = <any>WatchItemFactory.new(type, false),
      promise = new Promise((resolve) => {
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

          if (newItem.hasOwnProperty('imdbID') && !item.imdbID) {
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
    return [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
  }

  static getTypeList(): Type[] {
    return [
      { value: WatchlistType.Documentary, name: 'Documentary' },
      { value: WatchlistType.Game, name: 'Game' },
      { value: WatchlistType.Movie, name: 'Movie' },
      { value: WatchlistType.Series, name: 'Series' },
      { value: WatchlistType.Franchise, name: 'Franchise' },
    ];
  }

  static getSortOptions(): Sort[] {
    return [{ name: 'Name' }, { name: 'Year' }, { name: 'Date Added' }];
  }

  static getTypeNameByType(type: number): string {
    const item = WatchItemFactory.getTypeList().find(
      (item: Type) => item.value === type,
    );
    return item ? item.name : 'Unknown';
  }

  static getTypeName(item: WatchlistItems): string {
    return item && item.type !== undefined
      ? WatchItemFactory.getTypeNameByType(item.type)
      : 'Unknown';
  }
}
