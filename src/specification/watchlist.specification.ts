import { Specification, some, all, not } from './specification';
import {
  WatchlistItems,
  WatchlistItemsPure
} from '@/services/WatchItemFactory';
import { WatchlistType } from '@/core/models/BaseModel';
import { Franchise } from '@/models/FranchiseModel';

const matchName = (searchValue: string): Specification<WatchlistItems> => {
  return (input: WatchlistItems): boolean =>
    searchValue
      ? input.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      : true;
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

export const createWatchlistSpecification = (
  searchValue: string,
  itemTypes: WatchlistType[],
  itemStates: boolean[],
  franchises: Franchise[]
): Specification<WatchlistItems> => {
  return all<WatchlistItems>(
    not(isFranchiseItem(franchises, searchValue)),
    matchItemType(itemTypes),
    matchItemState(itemStates),
    some<WatchlistItems>(matchName(searchValue), matchActors(searchValue))
  );
};
