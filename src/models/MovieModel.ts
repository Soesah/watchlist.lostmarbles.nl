import { BaseModel, WatchlistType } from '@/core/models/BaseModel';

export interface MovieType {
  type: number;
  imdbID: string;
  previousImdbID?: string;
  title: string;
  year: number;
  score: number;
  actors: string[];
  length: string;
  plot: string;
  director: string;
  watched: boolean;
  date_watched: string | null;
  date_added: string | null;
}

export class Movie extends BaseModel {
  public type: number;
  public imdbID: string;
  public previousImdbID?: string;
  public title: string;
  public year: number;
  public score: number;
  public actors: string[];
  public length: string;
  public plot: string;
  public director: string;
  public watched: boolean;
  public date_watched: string | null;
  public date_added: string | null;

  constructor({
    imdbID,
    title,
    year,
    score,
    actors = [],
    length,
    plot,
    director,
    watched = false,
    date_watched,
    date_added,
  }: MovieType) {
    super({ title, year, watched, date_watched });

    this.type = WatchlistType.Movie;
    this.imdbID = imdbID;
    this.title = title;
    this.year = year;
    this.score = score;
    this.actors = actors;
    this.length = length;
    this.plot = plot;
    this.director = director;
    this.watched = watched;
    this.date_watched = date_watched;
    this.date_added = date_added;
  }

  public isComplete(): boolean {
    return !!(this.title && this.year && this.length !== 'N/A');
  }

  public clone() {
    return new Movie(this);
  }
}
