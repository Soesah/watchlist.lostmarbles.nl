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

  getEpisode(imdbID: string): Episode | undefined {
    return this.episodes.find((item: Episode) => item.imdbID === imdbID);
  }

  getEpisodeByNr(nr: number): Episode | undefined {
    return this.episodes.find((episode: Episode) => episode.nr === nr);
  }

  createEpisode(imdbID: string, nr: number, title: string): Episode {
    return new Episode({
      imdbID: imdbID,
      nr: nr,
      title: title,
      watched: false,
      date_watched: null,
    });
  }

  insertEpisode(nr: number, episode: Episode) {
    const index = this.episodes.findIndex(
      (episode: Episode) => episode.nr === nr,
    );
    if (episode.nr === 1) {
      this.episodes = [episode, ...this.episodes];
    } else if (index === -1) {
      this.episodes = [...this.episodes, episode];
    } else {
      this.episodes.splice(index + 1, 0, episode);
    }
  }

  removeEpisode(episode: Episode) {
    const index = this.episodes.indexOf(episode);
    this.episodes.splice(index, 1);
  }

  updateEpisodes(episodes: Episode[]) {
    for (let i = 0; i < episodes.length; i++) {
      const ep = episodes[i];
      const episode = this.getEpisode(ep.imdbID);
      if (episode) {
        episode.title = ep.title;
      } else {
        this.insertEpisode(ep.nr, ep);
      }
    }
  }

  toggleWatched() {
    this.episodes.forEach((episode) => this.toggleEpisodeWatched(episode));
  }

  toggleEpisodeWatched(episode: Episode) {
    episode.toggleWatched();
  }

  get watched() {
    return this.episodes.length > 0
      ? this.episodes.filter((item: Episode) => !item.watched).length === 0
      : true;
  }
}
