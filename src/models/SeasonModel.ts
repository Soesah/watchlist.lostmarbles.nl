import { Episode } from './EpisodeModel';

export interface SeasonType {
  year: number;
  nr: number;
  episodes: Episode[];
}
export class Season {
  public year: number;
  public nr: number;
  public episodes: Episode[];

  constructor({ year, nr, episodes = [] }: SeasonType) {
    this.year = year;
    this.nr = nr;
    this.episodes = episodes
      ? episodes.map(function(data) {
          return new Episode(data);
        })
      : [];
  }

  getEpisode(imdbId: string): Episode | undefined {
    return this.episodes.find((item: Episode) => item.imdbId === imdbId);
  }

  getEpisodeByNr(nr: number): Episode | undefined {
    return this.episodes.find((item: Episode) => item.nr === nr);
  }

  createEpisode(imdbId: string, nr: number, title: string): Episode {
    return new Episode({
      imdbId: imdbId,
      nr: nr,
      title: title,
      watched: false,
      date_watched: null
    });
  }

  insertEpisode(nr: number, episode: Episode) {
    const index = this.episodes.findIndex((item: Episode) => item.nr === nr);
    this.episodes.splice(index + 1, 0, episode);
  }

  removeEpisode(episode: Episode) {
    const index = this.episodes.indexOf(episode);
    this.episodes.splice(index, 1);
  }

  toggleWatched() {
    this.episodes.forEach(episode => this.toggleEpisodeWatched(episode));
  }

  toggleEpisodeWatched(episode: Episode) {
    episode.toggleWatched();
  }

  get watched() {
    return (
      this.episodes.length > 0 &&
      this.episodes.filter((item: Episode) => !item.watched).length === 0
    );
  }
}
