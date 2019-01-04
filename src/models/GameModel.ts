import { DateTimeUtil } from '@/core/util/DateTimeUtil';
import { WatchlistType } from '@/core/models/BaseModel';

export interface GameType {
  type: number;
  imdbId: string;
  name: string;
  year: number;
  score: number;
  plot: string;
  actors: string[];
  publisher: string;
  genre: string;
  played: boolean;
  date_played: string | null;
  date_added: string | null;
}

export class Game {
  public type: number;
  public imdbId: string;
  public name: string;
  public year: number;
  public score: number;
  public plot: string;
  public actors: string[];
  public publisher: string;
  public genre: string;
  public played: boolean;
  public date_played: string | null;
  public date_added: string | null;

  constructor({
    imdbId,
    name,
    year,
    score,
    plot,
    actors = [],
    publisher,
    genre,
    played = false,
    date_played,
    date_added
  }: GameType) {
    this.type = WatchlistType.Game;
    this.imdbId = imdbId;
    this.name = name;
    this.year = year;
    this.score = score;
    this.plot = plot;
    this.actors = actors;
    this.publisher = publisher;
    this.genre = genre;
    this.played = played;
    this.date_played = date_played;
    this.date_added = date_added;
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

  get count() {
    return 1;
  }

  isComplete(): boolean {
    return !!(this.name && this.year);
  }

  togglePlayed() {
    this.played = !this.played;
    this.date_played = this.played ? DateTimeUtil.now() : null;
  }

  toggleWatched() {
    this.togglePlayed();
  }

  get watched() {
    return this.played;
  }

  get date_watched() {
    return this.date_played;
  }
}
