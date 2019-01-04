import { WatchlistType } from '@/core/models/BaseModel';

export interface FranchiseType {
  type: number;
  imdbId: string;
  name: string;
  items: string[];
  date_added: string;
}

export class Franchise {
  public type: number;
  public imdbId: string;
  public name: string;
  public items: string[];
  public date_added: string;

  constructor({ imdbId, name, items = [], date_added }: FranchiseType) {
    this.type = WatchlistType.Franchise;
    this.imdbId = imdbId;
    this.name = name;
    this.items = items;
    this.date_added = date_added;
  }

  addItem(item: { imdbId: string }) {
    this.items.push(item.imdbId);
  }

  removeItem(item: { imdbId: string }) {
    let index = this.items.indexOf(item.imdbId);
    this.items.splice(index, 1);
  }

  get path(): string {
    return this.name
      .replace(/\W+/g, '-')
      .replace('--', '')
      .toLowerCase();
  }

  get count(): number {
    return this.items.length;
  }

  get year() {
    return -1;
  }

  // todo.... provide all items so that the true items can be walked.
  get watched(): boolean {
    return false;
  }
}
