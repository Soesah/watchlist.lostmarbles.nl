import { createSorter } from './sorting';

const sortByName = (a: any, b: any): number =>
  a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
const sortByLast = (a: any, b: any): number =>
  a.last === b.last ? 0 : a.last > b.last ? 1 : -1;
const sortByYear = (a: any, b: any): number =>
  a.year === b.year ? 0 : a.year > b.year ? 1 : -1;

describe('createSorter', () => {
  it('should return a sort function that... sorts', () => {
    const a = { name: 'A' };
    const b = { name: 'B' };
    const c = { name: 'C' };
    const d = { name: 'D' };

    expect([d, c, b, a].sort(createSorter(sortByName))).toEqual([a, b, c, d]);
  });

  it('should return a sort function that sorts on multiple properties', () => {
    const a = { name: 'Z', last: 'A' };
    const b = { name: 'Z', last: 'B' };
    const c = { name: 'Z', last: 'C' };
    const d = { name: 'Z', last: 'D' };

    expect([d, c, b, a].sort(createSorter(sortByName, sortByLast))).toEqual([
      a,
      b,
      c,
      d
    ]);
  });

  it('should return a sort function that sorts on multiple and more properties', () => {
    const a = { name: 'Z', last: 'X', year: 1901 };
    const b = { name: 'Z', last: 'X', year: 1902 };
    const c = { name: 'Z', last: 'X', year: 1903 };
    const d = { name: 'Z', last: 'X', year: 1904 };

    expect(
      [d, c, b, a].sort(createSorter(sortByName, sortByLast, sortByYear))
    ).toEqual([a, b, c, d]);
  });

  describe('sortByName', () => {
    it('should return 0 when both names are the same', () => {
      expect(sortByName({ name: 'A' }, { name: 'A' })).toBe(0);
    });

    it('should return 1 when b.name is after a.name', () => {
      expect(sortByName({ name: 'A' }, { name: 'B' })).toBe(-1);
    });

    it('should return -1 when b.name is before a.name', () => {
      expect(sortByName({ name: 'B' }, { name: 'A' })).toBe(1);
    });

    it('should work as a sorting function to sort by name', () => {
      const a = { name: 'A' };
      const b = { name: 'B' };
      const c = { name: 'C' };
      const d = { name: 'D' };

      expect([d, c, b, a].sort(sortByName)).toEqual([a, b, c, d]);
    });
  });

  describe('sortByLast', () => {
    it('should return 0 when both last names are the same', () => {
      expect(sortByLast({ last: 'A' }, { last: 'A' })).toBe(0);
    });

    it('should return 1 when b.last is after a.last', () => {
      expect(sortByLast({ last: 'A' }, { last: 'B' })).toBe(-1);
    });

    it('should return -1 when b.last is before a.last', () => {
      expect(sortByLast({ last: 'B' }, { last: 'A' })).toBe(1);
    });

    it('should work as a sorting function to sort by last', () => {
      const a = { last: 'A' };
      const b = { last: 'B' };
      const c = { last: 'C' };
      const d = { last: 'D' };

      expect([d, c, b, a].sort(sortByLast)).toEqual([a, b, c, d]);
    });
  });

  describe('sortByYear', () => {
    it('should return 0 when both years are the same', () => {
      expect(sortByYear({ year: 1900 }, { year: 1900 })).toBe(0);
    });

    it('should return 1 when b.year is after a.year', () => {
      expect(sortByYear({ year: 1900 }, { year: 1921 })).toBe(-1);
    });

    it('should return -1 when b.year is before a.year', () => {
      expect(sortByYear({ year: 1921 }, { year: 1900 })).toBe(1);
    });

    it('should work as a sorting function to sort by year', () => {
      const a = { year: 1900 };
      const b = { year: 1921 };
      const c = { year: 1945 };
      const d = { year: 1978 };

      expect([d, c, b, a].sort(sortByYear)).toEqual([a, b, c, d]);
    });
  });
});
