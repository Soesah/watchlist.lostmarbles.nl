export type Specification<T> = (input: T) => boolean;

export const all = <T>(
  ...specifications: Array<Specification<T>>
): Specification<T> => (input: T): boolean =>
  specifications.every(spec => spec(input));

export const some = <T>(
  ...specifications: Array<Specification<T>>
): Specification<T> => (input: T): boolean =>
  specifications.some(spec => spec(input));

export const not = <T>(specification: Specification<T>): Specification<T> => (
  input: T
): boolean => !specification(input);
