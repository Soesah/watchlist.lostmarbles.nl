import { DateTimeUtil } from '@/core/util/DateTimeUtil';

export enum WatchlistType {
  Movie,
  Series,
  Documentary,
  Game,
  Franchise
}

interface BaseType {
  title: string;
  year: number;
  watched: boolean;
  date_watched: string | null;
}

export class BaseModel {
  public title: string;
  public year: number;
  public watched: boolean;
  public date_watched: string | null;

  constructor({ title, year, watched, date_watched }: BaseType) {
    this.title = title;
    this.year = year;
    this.watched = watched;
    this.date_watched = date_watched;
  }

  get path(): string {
    return (
      this.title
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
    return !!(this.title && this.year);
  }

  toggleWatched() {
    this.watched = !this.watched;
    this.date_watched = this.watched ? DateTimeUtil.now() : null;
  }
}
