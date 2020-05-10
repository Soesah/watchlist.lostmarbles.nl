import { Season } from './SeasonModel';
import { Episode } from './EpisodeModel';
import { DateTimeUtil } from '@/core/util/DateTimeUtil';
import { WatchlistType } from '@/core/models/BaseModel';

export interface SeriesType {
  type: number;
  imdbID: string;
  previousImdbID?: string;
  title: string;
  plot: string;
  finished: boolean;
  seasons: Season[];
  actors: string[];
  date_added: string | null;
}

export class Series {
  public type: number;
  public imdbID: string;
  public previousImdbID?: string;
  public title: string;
  public plot: string;
  public finished: boolean;
  public seasons: Season[];
  public actors: string[];
  public date_added: string | null;

  constructor({
    imdbID,
    title,
    seasons = [],
    plot,
    actors = [],
    finished = false,
    date_added = null,
  }: SeriesType) {
    this.type = WatchlistType.Series;
    this.imdbID = imdbID;
    this.title = title;
    this.plot = plot;
    this.finished = finished;
    this.seasons = seasons.map(function(data) {
      return new Season(data);
    });
    this.actors = actors;
    this.date_added = date_added;
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
    return !!(this.title && this.seasons.length);
  }

  isFinished(): boolean {
    return this.finished;
  }

  toggleWatched() {
    this.seasons.forEach((season) => this.toggleSeasonWatched(season));
  }

  toggleSeasonWatched(season: Season) {
    season.toggleWatched();
  }

  toggleEpisodeWatched(season: Season, episode: Episode) {
    season.toggleEpisodeWatched(episode);
  }

  addSeason(year: number | null): Season {
    const season = new Season({
      year: year ? year : DateTimeUtil.year(),
      nr: this.seasons.length + 1,
      episodes: [],
    });
    this.seasons.push(season);
    return season;
  }

  updateSeason(season: Season) {
    let index = this.seasons.findIndex((s: Season) => s.nr === season.nr);
    this.seasons.splice(index, 1, season);
  }

  removeSeason(season: Season) {
    let index = this.seasons.indexOf(season);
    this.seasons.splice(index, 1);
  }

  // this is a little inaccurate
  // need to update to _.find when seasons have nrs
  getSeason(nr: number): Season | undefined {
    return this.seasons.find((season: Season) => season.nr === nr);
  }

  get watched(): boolean {
    return this.seasons.length > 0
      ? this.seasons.filter((season: Season) => !season.watched).length === 0
      : true;
  }

  get year(): number {
    return this.seasons.length ? this.seasons[0].year : -1;
  }

  get lastYear(): number {
    return this.seasons.length
      ? this.seasons[this.seasons.length - 1].year
      : -1;
  }

  public clone() {
    return new Series(this);
  }
}
