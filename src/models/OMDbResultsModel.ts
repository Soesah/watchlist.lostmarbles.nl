interface OMDbResults {
  Search: OMDbResult[];
  totalResults: string;
}
interface OMDbResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export class OMDbSearchResults {
  public results: OMDbResult[];
  public count: number;

  constructor({ Search, totalResults }: OMDbResults) {
    this.results = Search;
    this.count = parseInt(totalResults);
  }
}
