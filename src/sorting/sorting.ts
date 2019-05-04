export type Sorter<T> = (a: T, b: T) => number;

export const createSorter = <T>(...sorters: Sorter<T>[]) => (a: T, b: T) =>
  sorters.reduce(
    (d: number, fn: Sorter<T>, index: number) => (d === 0 ? fn(a, b) : d),
    0
  );
