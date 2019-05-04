import { WatchlistItems } from '@/services/WatchItemFactory';

export const sortByTitle = (a: WatchlistItems, b: WatchlistItems): number =>
  a.title === b.title ? 0 : a.title > b.title ? 1 : -1;

export const sortByYear = (a: WatchlistItems, b: WatchlistItems): number =>
  a.year === b.year ? 0 : a.year > b.year ? 1 : -1;

export const sortByDateAdded = (a: WatchlistItems, b: WatchlistItems): number =>
  a.date_added === b.date_added
    ? 0
    : (a.date_added ? a.date_added : '') > (b.date_added ? b.date_added : '')
    ? 1
    : -1;
