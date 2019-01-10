interface ResultsType {
  results: ResultType[];
  count: number;
}

interface ResultType {
  type: number;
  imdbID: string;
  title: string;
  year: number;
  poster: string;
}

export class Results {
  public results: ResultType[];
  public count: number;

  constructor({ results = [], count = 0 }: ResultsType) {
    this.results = results.map((r: ResultType) => new Result(r));
    this.count = count;
  }
}

export class Result {
  public type: number;
  public imdbID: string;
  public title: string;
  public year: number;
  public poster: string;

  constructor({
    type = 0,
    imdbID = '',
    title = '',
    year = 0,
    poster = ''
  }: ResultType) {
    this.type = type;
    this.imdbID = imdbID;
    this.title = title;
    this.year = year;
    this.poster = poster;
  }
}
