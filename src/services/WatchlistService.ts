import { BaseService } from '@/core/services/BaseService';
import { Season } from '@/models/SeasonModel';
import { Episode } from '../models/EpisodeModel';
import { WatchlistType } from '@/core/models/BaseModel';
import {
  WatchItemFactory,
  WatchlistItem,
  WatchlistItems
} from '@/services/WatchItemFactory';

const STATUS_OK = 200;

export class WatchlistService extends BaseService {
  private items: WatchlistItems[];
  private path: string;

  constructor() {
    super();
    this.items = [];
    this.path = '/api';
  }

  load(): Promise<WatchlistItems[]> {
    return new Promise((resolve, reject) => {
      if (this.items.length) {
        resolve(this.items);
      } else {
        this.$http
          .get(`${this.path}/list`)
          .then(response => {
            this.items = response.data.map((item: WatchlistItem) =>
              WatchItemFactory.create(item)
            );
            resolve(this.items);
          })
          .catch(error => reject(error));
      }
    });
  }

  async create(
    type: string,
    item: WatchlistItems
  ): Promise<WatchlistItems | string> {
    const response = await this.$http.post(`${this.path}/${type}`, item);
    return response.status === STATUS_OK
      ? WatchItemFactory.create(response.data.data)
      : response.statusText;
  }

  async store(
    type: string,
    item: WatchlistItems
  ): Promise<WatchlistItems | string> {
    const response = await this.$http.put(
      `${this.path}/${type}/${item.imdbID}`,
      item
    );
    return response.status === STATUS_OK
      ? WatchItemFactory.create(response.data.data)
      : response.statusText;
  }

  async remove(type: string, item: WatchlistItems): Promise<string> {
    const response = await this.$http.delete(
      `${this.path}/${type}/${item.imdbID}`
    );
    return response.status === STATUS_OK
      ? response.data.message
      : response.statusText;
  }

  async toggle(
    type: string,
    item: WatchlistItems
  ): Promise<WatchlistItems | false> {
    const watched =
      item.type === WatchlistType.Series
        ? item.watched
          ? 'not-watched'
          : 'watched'
        : 'watched';
    const response = await this.$http.put(
      `${this.path}/${type}/${watched}/${item.imdbID}`,
      item
    );
    return response.status === STATUS_OK
      ? WatchItemFactory.create(response.data.data)
      : false;
  }

  async toggleSeason(
    item: WatchlistItems,
    season: Season
  ): Promise<WatchlistItems | false> {
    const watched = season.watched ? 'not-watched' : 'watched';
    const response = await this.$http.put(
      `${this.path}/series/${watched}/${item.imdbID}/season/${season.nr}`,
      null
    );
    return response.status === STATUS_OK
      ? WatchItemFactory.create(response.data.data)
      : false;
  }

  async toggleEpisode(
    item: WatchlistItems,
    season: Season,
    episode: Episode
  ): Promise<WatchlistItems | false> {
    const watched = episode.watched ? 'not-watched' : 'watched';
    const response = await this.$http.put(
      `${this.path}/series/${watched}/${item.imdbID}/season/${
        season.nr
      }/episode/${episode.nr}`,
      null
    );
    return response.status === STATUS_OK
      ? WatchItemFactory.create(response.data.data)
      : false;
  }
}

export default new WatchlistService();
