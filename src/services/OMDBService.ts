import { BaseService } from '@/core/services/BaseService';
import { Results } from '@/models/ResultsModel';
import { ResultItem } from '@/models/ResultItemModel';
import { WatchlistType } from '@/core/models/BaseModel';
import { Series } from '@/models/SeriesModel';

enum OMDbType {
  Movie = 'movie',
  Series = 'series',
  Game = 'game'
}

interface Prop {
  to: string;
  from: string;
}

class OMDbApiService extends BaseService {
  private url: string;

  constructor() {
    super();
    this.url = '/api/omdb';
  }

  request(url: string, Model: any): any {
    return new Promise((resolve, reject) => {
      this.$http.get(url).then(
        response => {
          let data = response.data;
          resolve(new Model(data));
        },
        response => {
          reject(response);
        }
      );
    });
  }

  search(name: string, year: number | null) {
    return this.request(
      this.url + '/search/' + name + (year ? '/' + year : ''),
      Results
    );
  }

  lucky(name: string) {
    return this.request(
      this.url + '?t=' + name + '&y=&plot=short&r=json',
      ResultItem
    );
  }

  get(imdbID: string) {
    return this.request(this.url + '/get/' + imdbID, ResultItem);
  }

  getSeason(imdbID: string, nr: number) {
    return this.request(
      this.url + '?i=' + imdbID + '&Season=' + nr + '&r=json',
      ResultItem
    );
  }

  updateMovie(item: any, props: Prop[]) {
    return this.get(item.imdbID).then((obj: any) => {
      props.forEach(function(prop) {
        item[prop.to] = obj[prop.from];
      });
    });
  }

  isUpdatedMovie(item: any, props: Prop[]) {
    let updated = true;
    props.forEach(function(prop) {
      updated = item[prop.to] !== null && updated;
    });
    return updated;
  }

  updateSeries(item: Series) {
    return new Promise((resolve, reject) => {
      this.get(item.imdbID).then((obj: any) => {
        if (obj.imdbID) {
          item.imdbID = obj.imdbID;
          item.name = obj.title;
          item.plot = obj.plot;
          item.actors = obj.actors.split(', ');
          resolve({
            series: item,
            seasons: obj.seasons
          });
        } else {
          reject();
        }
      });
    });
  }

  updateSeason(series: Series, nr: number) {
    let season = series.getSeason(nr);

    if (!season) {
      season = series.addSeason(null);
    }

    season.nr = nr;

    return new Promise((resolve, reject) => {
      this.getSeason(series.imdbID, nr).then((obj: any) => {
        if (obj.title) {
          // update existing episodes, or create new ones

          season.episodes = obj.episodes.map((ep: any, index: number) => {
            let episode = season.getEpisode(ep.imdbID);

            // update season year
            if (index === 0) {
              season.year = parseInt(ep.Released);
            }

            // update the episode
            if (episode) {
              episode.imdbID = ep.imdbID;
              episode.nr = parseInt(ep.Episode);
              episode.title = ep.Title;
            } else {
              // or create a new one
              episode = season.createEpisode(
                ep.imdbID,
                parseInt(ep.Episode),
                ep.Title
              );
            }
            return episode;
          });

          resolve(season);
        } else {
          reject();
        }
      });
    });
  }

  getInternalType(type: string) {
    switch (type) {
      case OMDbType.Movie:
        return WatchlistType.Movie;
      case OMDbType.Series:
        return WatchlistType.Series;
      case OMDbType.Game:
        return WatchlistType.Game;
    }
  }
}

export default new OMDbApiService();