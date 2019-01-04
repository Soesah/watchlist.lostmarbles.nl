export interface OMDBType {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  totalSeasons: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Episodes: string;
}

export class OMDbObject {
  public title: string;
  public year: string;
  public rated: string;
  public released: string;
  public runtime: string;
  public genre: string;
  public director: string;
  public writer: string;
  public actors: string;
  public seasons: number;
  public plot: string;
  public language: string;
  public country: string;
  public awards: string;
  public poster: string;
  public metascore: string;
  public imdbrating: string;
  public imdbvotes: string;
  public imdbId: string;
  public type: string;
  public episodes: string;

  constructor({
    Title,
    Year,
    Rated,
    Released,
    Runtime,
    Genre,
    Director,
    Writer,
    Actors,
    totalSeasons,
    Plot,
    Language,
    Country,
    Awards,
    Poster,
    Metascore,
    imdbRating,
    imdbVotes,
    imdbID,
    Type,
    Episodes
  }: OMDBType) {
    this.title = Title;
    this.year = Year;
    this.rated = Rated;
    this.released = Released;
    this.runtime = Runtime;
    this.genre = Genre;
    this.director = Director;
    this.writer = Writer;
    this.actors = Actors;
    this.seasons = parseInt(totalSeasons);
    this.plot = Plot;
    this.language = Language;
    this.country = Country;
    this.awards = Awards;
    this.poster = Poster;
    this.metascore = Metascore;
    this.imdbrating = imdbRating;
    this.imdbvotes = imdbVotes;
    this.imdbId = imdbID;
    this.type = Type;
    // Season specific
    this.episodes = Episodes;
  }

  isMovie(): boolean {
    return this.type === 'movie';
  }

  isSeries(): boolean {
    return this.type === 'series';
  }

  isGame(): boolean {
    return this.type === 'game';
  }

  getInternalType(): number {
    var type = 0;
    if (this.isSeries()) {
      type = 1;
    }
    if (this.isGame()) {
      type = 3;
    }
    return type;
  }
}
