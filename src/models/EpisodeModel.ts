import { DateTimeUtil } from '@/core/util/DateTimeUtil';

interface EpisodeType {
  imdbId: string;
  nr: number;
  title: string;
  watched: boolean;
  date_watched: string | null;
}

export class Episode {
  public imdbId: string;
  public nr: number;
  public title: string;
  public watched: boolean;
  public date_watched: string | null;

  constructor({
    imdbId,
    nr,
    title,
    watched = false,
    date_watched = null
  }: EpisodeType) {
    this.imdbId = imdbId;
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
