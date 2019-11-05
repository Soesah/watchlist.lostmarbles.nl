import { WatchlistType } from '@/core/models/BaseModel';

export interface FranchiseType {
  type: number;
  imdbID: string;
  name: string;
  items: string[];
  date_added: string;
}

export class Franchise {
  public type: number;
  public imdbID: string;
  public name: string;
  public items: string[];
  public date_added: string;

  constructor({ imdbID, name, items = [], date_added }: FranchiseType) {
    this.type = WatchlistType.Franchise;
    this.imdbID = imdbID;
    this.name = name;
    this.items = items;
    this.date_added = date_added;
  }

  addItem(item: { imdbID: string }) {
    this.items.push(item.imdbID);
  }

  removeItem(item: { imdbID: string }) {
    let index = this.items.indexOf(item.imdbID);
    this.items.splice(index, 1);
  }

  get title(): string {
    return this.name;
  }

  set title(title) {
    this.name = title;
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

  get watched(): boolean {
    return false;
  }

  public clone() {
    return new Franchise(this);
  }
}
