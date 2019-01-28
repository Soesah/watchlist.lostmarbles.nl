import { BaseService } from '@/core/services/BaseService';
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

  async toggle(type: string, item: WatchlistItems): Promise<boolean> {
    const response = await this.$http.put(
      `${this.path}/${type}/watched/${item.imdbID}`,
      item
    );
    return response.status === STATUS_OK;
  }
}

export default new WatchlistService();
