interface OMDbResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export class OMDbResults {
  public results: OMDbResult[];
  public count: number;

  constructor({
    Search,
    totalResults
  }: {
    Search: OMDbResult[];
    totalResults: string;
  }) {
    this.results = Search;
    this.count = parseInt(totalResults);
  }
}
