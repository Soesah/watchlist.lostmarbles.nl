import { DateTimeUtil } from '@/core/util/DateTimeUtil';

export enum WatchlistType {
  Movie,
  Series,
  Documentary,
  Game,
  Franchise
}

interface BaseType {
  name: string;
  year: number;
  watched: boolean;
  date_watched: string | null;
}

export class BaseModel {
  public name: string;
  public year: number;
  public watched: boolean;
  public date_watched: string | null;

  constructor({ name, year, watched, date_watched }: BaseType) {
    this.name = name;
    this.year = year;
    this.watched = watched;
    this.date_watched = date_watched;
  }

  get path(): string {
    return (
      this.name
        .replace(/\W+/g, '-')
        .replace('--', '')
        .toLowerCase() +
      '-' +
      this.year
    );
  }

  get count(): number {
    return 1;
  }

  isComplete(): boolean {
    return !!(this.name && this.year);
  }

  toggleWatched() {
    this.watched = !this.watched;
    this.date_watched = this.watched ? DateTimeUtil.now() : null;
  }
}
