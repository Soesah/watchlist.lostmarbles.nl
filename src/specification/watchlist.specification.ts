import { Specification, some, all, not } from './specification';
import {
  WatchlistItems,
  WatchlistItemsPure,
  WatchlistItem
} from '@/services/WatchItemFactory';
import { WatchlistType } from '@/core/models/BaseModel';
import { Franchise } from '@/models/FranchiseModel';
import { Movie } from '@/models/MovieModel';
import { Game } from '@/models/GameModel';
import { Documentary } from '@/models/DocumentaryModel';

const matchName = (searchValue: string): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    searchValue
      ? input.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      : true;
};

const matchDirector = (searchValue: string): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    input.type !== WatchlistType.Franchise &&
    input.type !== WatchlistType.Game &&
    input.type !== WatchlistType.Series
      ? (input as Movie | Documentary).director
          .toLowerCase()
          .indexOf(searchValue.toLowerCase()) !== -1
      : false;
};

const matchActors = (searchValue: string): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    input.type !== WatchlistType.Franchise
      ? (input as WatchlistItemsPure).actors.some(
          (actor: string) =>
            actor.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        )
      : false;
};

const matchItemType = (
  itemTypes: WatchlistType[]
): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    itemTypes.length ? itemTypes.includes(input.type) : true;
};

const matchItemState = (
  itemStates: boolean[]
): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    itemStates.length ? itemStates.includes(input.watched) : true;
};

const isFranchiseItem = (
  franchises: Franchise[],
  searchValue: string
): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    searchValue
      ? false // all franchise items when searching
      : franchises.find((franchise: Franchise) =>
          franchise.items.includes(input.imdbID)
        ) !== undefined;
};

const isFranchiseWhileSearching = (
  searchValue: string
): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    searchValue ? input.type === WatchlistType.Franchise : false;
};

export const createWatchlistSpecification = (
  searchValue: string,
  itemTypes: WatchlistType[],
  itemStates: boolean[],
  franchises: Franchise[]
): Specification<WatchlistItems> => {
  return all<WatchlistItems>(
    not(isFranchiseItem(franchises, searchValue)),
    not(isFranchiseWhileSearching(searchValue)),
    matchItemType(itemTypes),
    matchItemState(itemStates),
    some<WatchlistItems>(
      matchName(searchValue),
      matchActors(searchValue),
      matchDirector(searchValue)
    )
  );
};
