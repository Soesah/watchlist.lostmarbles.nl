import BaseModel from 'core/models/BaseModel';
import DateTimeUtil from 'core/services/DateTimeUtil';

class Game extends BaseModel {

  constructor ({imdbId = null, name = null, year = null, score = null, plot = null, actors = [], publisher = null, genre = null, played = false, date_played = null, date_added = null}) {
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
    this.date_played = date_played;
    this.date_added = date_added;
  }

  togglePlayed () {
    this.played = !this.played;
    this.date_played = this.played ? DateTimeUtil.now() : null;
  }

  toggleWatched () {
    this.togglePlayed();
  }

  get watched () {
    return this.played;
  }

  get date_watched () {
    return this.date_played;
  }

}
