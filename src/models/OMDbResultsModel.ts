interface OMDbResults {
  results: OMDbResult[];
  count: number;
}
interface OMDbResult {
  title: string;
  year: number;
  imdbID: string;
  type: number;
  poster: string;
}

export class OMDbSearchResults {
  public results: OMDbResult[];
  public count: number;

  constructor({ results, count }: OMDbResults) {
    this.results = results;
    this.count = count;
  }
}
