interface ResultItemType {
  type: number;
  imdbID: string;
  title: string;
  year: number;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string[];
  seasons_count: string;
  plot: string;
  language: string;
  poster: string;
  episodes: string;
}

export class ResultItem {
  public type: number;
  public imdbID: string;
  public title: string;
  public year: number;
  public released: string;
  public runtime: string;
  public genre: string;
  public director: string;
  public writer: string;
  public actors: string[];
  public seasons_count: string;
  public plot: string;
  public language: string;
  public poster: string;
  public episodes: string;

  constructor({
    type = 0,
    imdbID = '',
    title = '',
    year = 0,
    released = '',
    runtime = '',
    genre = '',
    director = '',
    writer = '',
    actors = [],
    seasons_count = '',
    plot = '',
    language = '',
    poster = '',
    episodes = ''
  }) {
    this.type = type;
    this.imdbID = imdbID;
    this.title = title;
    this.year = year;
    this.released = released;
    this.runtime = runtime;
    this.genre = genre;
    this.director = director;
    this.writer = writer;
    this.actors = actors;
    this.seasons_count = seasons_count;
    this.plot = plot;
    this.language = language;
    this.poster = poster;
    this.episodes = episodes;
  }
}
