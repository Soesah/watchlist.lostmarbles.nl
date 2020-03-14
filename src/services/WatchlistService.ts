import { BaseService } from '@/core/services/BaseService';
import { Season } from '@/models/SeasonModel';
import { Episode } from '../models/EpisodeModel';
import { WatchlistType } from '@/core/models/BaseModel';
import {
  WatchItemFactory,
  WatchlistItem,
  WatchlistItems,
} from '@/services/WatchItemFactory';

const STATUS_OK = 200;

export interface WatchlistResponse {
  status: boolean;
  message: string;
  data: WatchlistItems;
}

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
          .then((response) => {
            this.items = response.data.map((item: WatchlistItem) =>
              WatchItemFactory.create(item),
            );
            resolve(this.items);
          })
          .catch((error) => reject(error));
      }
    });
  }

  async create(item: WatchlistItems): Promise<WatchlistResponse> {
    const type = WatchItemFactory.getTypeName(item).toLowerCase();
    const response = await this.$http.post(`${this.path}/${type}`, item);
    const status = response.status === STATUS_OK;
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: status ? WatchItemFactory.create(response.data.data) : item,
    };
  }

  async store(item: WatchlistItems): Promise<WatchlistResponse> {
    const type = WatchItemFactory.getTypeName(item).toLowerCase();
    const response = await this.$http.put(
      `${this.path}/${type}/${item.imdbID}`,
      item,
    );
    const status = response.status === STATUS_OK;
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: status ? WatchItemFactory.create(response.data.data) : item,
    };
  }

  async remove(item: WatchlistItems): Promise<WatchlistResponse> {
    const type = WatchItemFactory.getTypeName(item).toLowerCase();
    const response = await this.$http.delete(
      `${this.path}/${type}/${item.imdbID}`,
    );
    const status = response.status === STATUS_OK;
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: item,
    };
  }

  async toggle(item: WatchlistItems): Promise<WatchlistResponse> {
    const watched =
      item.type === WatchlistType.Series
        ? item.watched
          ? 'not-watched'
          : 'watched'
        : 'watched';
    const type = WatchItemFactory.getTypeName(item).toLowerCase();
    const response = await this.$http.put(
      `${this.path}/${type}/${watched}/${item.imdbID}`,
      item,
    );
    const status = response.status === STATUS_OK;
    item.toggleWatched();
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: item,
    };
  }

  async toggleSeason(
    item: WatchlistItems,
    season: Season,
  ): Promise<WatchlistResponse> {
    const watched = season.watched ? 'not-watched' : 'watched';
    const response = await this.$http.put(
      `${this.path}/series/${watched}/${item.imdbID}/season/${season.nr}`,
      null,
    );
    const status = response.status === STATUS_OK;
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: status ? WatchItemFactory.create(response.data.data) : item,
    };
  }

  async toggleEpisode(
    item: WatchlistItems,
    season: Season,
    episode: Episode,
  ): Promise<WatchlistResponse> {
    const watched = episode.watched ? 'not-watched' : 'watched';
    const response = await this.$http.put(
      `${this.path}/series/${watched}/${item.imdbID}/season/${season.nr}/episode/${episode.nr}`,
      null,
    );
    const status = response.status === STATUS_OK;
    return {
      status,
      message: status ? response.data.message : response.statusText,
      data: status ? WatchItemFactory.create(response.data.data) : item,
    };
  }
}

export default new WatchlistService();
