import BaseModel from 'core/models/BaseModel';

class Game extends BaseModel{

  constructor ({imdbId = null, name = null, year = null, score = null, plot = null, actors = [], publisher = null, genre = null, played = false, date_added = null}) {
    super();
    this.type = 3;
    this.imdbId = imdbId;
    this.name = name;
    this.year = year;
    this.score = score;
    this.plot = plot;
    this.actors = actors;
    this.publisher = publisher;
    this.genre = genre;
    this.played = played;
    this.date_added = date_added;
  }

  togglePlayed () {
    this.played = !this.played;
  }

  toggleWatched () {
    this.togglePlayed();
  }

  get watched () {
    return this.played;
  }

}
