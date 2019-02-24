import { getMaxValue } from './ChartsUtil';

describe('getMaxValue', () => {
  it('should return a rounded value larger than the provided number ( < 100)', () => {
    expect(getMaxValue(76)).toBe(100);
  });
  it('should return a rounded value larger than the provided number ( > 100)', () => {
    expect(getMaxValue(176)).toBe(200);
  });
  it('should return a nicely rounded value larger than the provided number ( > 1000', () => {
    expect(getMaxValue(1076)).toBe(1200);
  });
  it('should return a nicely rounded value larger than the provided number ( > 10000', () => {
    expect(getMaxValue(10076)).toBe(12000);
  });
});
