import BaseService from 'core/services/BaseService';
import WatchItemFactory from 'services/WatchItemFactory';

class WatchlistService extends BaseService {

  constructor () {
    super();
    this.items = [];
    this.file = 'list.json';

    this.factory = new WatchItemFactory();
  }

  load () {
    return new Promise((resolve, reject) => {
      if (this.items.length) {
          resolve(this.items);
        } else {      
          this.$http.get('data/' + this.file)
            .then(response => {
              this.items = response.data.map(item => this.factory.create(item));
              resolve(this.items);
            })
            .catch(error => reject(error));
        }
    });
  }

  save (items) {
    return new Promise((resolve, reject) => {
      this.$http.post('data/save.php?f=' + this.file, items.map(item => item.data()))
        .then(response => resolve(items))
        .catch(error => reject(error));
    });
  }

}

const watchlistService = new WatchlistService();