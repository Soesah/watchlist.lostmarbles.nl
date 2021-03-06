import { BaseModel, WatchlistType } from '@/core/models/BaseModel';

export interface DocumentaryType {
  type: number;
  imdbID: string;
  previousImdbID?: string;
  title: string;
  year: number;
  score: number;
  director: string;
  watched: boolean;
  actors: string[];
  date_watched: string | null;
  date_added: string | null;
}

export class Documentary extends BaseModel {
  public type: number;
  public imdbID: string;
  public previousImdbID?: string;
  public title: string;
  public year: number;
  public score: number;
  public director: string;
  public actors: string[];
  public watched: boolean;
  public date_watched: string | null;
  public date_added: string | null;

  constructor({
    imdbID,
    title,
    year,
    score,
    director,
    actors = [],
    watched = false,
    date_watched = null,
    date_added = null,
  }: DocumentaryType) {
    super({ title, year, watched, date_watched });
    this.type = WatchlistType.Documentary;
    this.imdbID = imdbID;
    this.title = title;
    this.year = year;
    this.director = director;
    this.score = score;
    this.actors = actors;
    this.watched = watched;
    this.date_watched = date_watched;
    this.date_added = date_added;
  }

  public clone() {
    return new Documentary(this);
  }
}
