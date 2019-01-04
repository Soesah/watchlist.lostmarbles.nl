import { BaseService } from '@/core/services/BaseService';
import {
  WatchItemFactory,
  WatchlistItem,
  WatchlistItems
} from '@/services/WatchItemFactory';

export class WatchlistService extends BaseService {
  private items: WatchlistItems[];
  private file: string;

  constructor() {
    super();
    this.items = [];
    this.file = 'list.json';
  }

  load(): Promise<WatchlistItems[]> {
    return new Promise((resolve, reject) => {
      if (this.items.length) {
        resolve(this.items);
      } else {
        this.$http
          .get('data/' + this.file)
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

  save(items: WatchlistItems[]) {
    return new Promise((resolve, reject) => {
      this.$http
        .post('backend.php?f=' + this.file, items)
        .then(_ => {
          this.items = items;
          resolve(items);
        })
        .catch(error => reject(error));
    });
  }
}

export default new WatchlistService();
