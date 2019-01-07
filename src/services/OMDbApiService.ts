import { BaseService } from '@/core/services/BaseService';
import { OMDbObject } from '@/models/OMDbObjectModel';
import { OMDbSearchResults } from '@/models/OMDbResultsModel';
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
    this.url = 'omdb.php';
  }

  request(url: string, Model: any): any {
    return new Promise((resolve, reject) => {
      this.$http.get(url).then(
        response => {
          let data = response.data;
          if (data.Response === 'True') {
            resolve(new Model(data));
          } else {
            reject(data);
          }
        },
        response => {
          reject(response);
        }
      );
    });
  }

  search(name: string, year: string) {
    return this.request(
      this.url + '?s=' + name + (year ? '&y=' + year : ''),
      OMDbSearchResults
    );
  }

  lucky(name: string) {
    return this.request(
      this.url + '?t=' + name + '&y=&plot=short&r=json',
      OMDbObject
    );
  }

  get(imdbId: string) {
    return this.request(this.url + '?i=' + imdbId + '&r=json', OMDbObject);
  }

  getSeason(imdbId: string, nr: number) {
    return this.request(
      this.url + '?i=' + imdbId + '&Season=' + nr + '&r=json',
      OMDbObject
    );
  }

  updateMovie(item: any, props: Prop[]) {
    return this.get(item.imdbId).then((obj: any) => {
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
      this.get(item.imdbId).then((obj: any) => {
        if (obj.imdbId) {
          item.imdbId = obj.imdbId;
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
      this.getSeason(series.imdbId, nr).then((obj: any) => {
        if (obj.title) {
          // update existing episodes, or create new ones

          season.episodes = obj.episodes.map((ep: any, index: number) => {
            let episode = season.getEpisode(ep.imdbId);

            // update season year
            if (index === 0) {
              season.year = parseInt(ep.Released);
            }

            // update the episode
            if (episode) {
              episode.imdbId = ep.imdbID;
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
