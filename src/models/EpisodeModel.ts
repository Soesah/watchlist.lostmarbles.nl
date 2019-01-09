import { DateTimeUtil } from '@/core/util/DateTimeUtil';

interface EpisodeType {
  imdbID: string;
  nr: number;
  title: string;
  watched: boolean;
  date_watched: string | null;
}

export class Episode {
  public imdbID: string;
  public nr: number;
  public title: string;
  public watched: boolean;
  public date_watched: string | null;

  constructor({
    imdbID,
    nr,
    title,
    watched = false,
    date_watched = null
  }: EpisodeType) {
    this.imdbID = imdbID;
    this.nr = nr;
    this.title = title;
    this.watched = watched;
    this.date_watched = date_watched;
  }

  public toggleWatched() {
    this.watched = !this.watched;
    this.date_watched = this.watched ? DateTimeUtil.now() : null;
  }
}
