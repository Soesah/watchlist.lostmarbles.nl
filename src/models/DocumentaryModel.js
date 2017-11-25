import BaseModel from 'core/models/BaseModel';

class Documentary extends BaseModel {

  constructor ({imdbId = null, name = null, year = null, score = null, director = null, watched = false, date_watched = null, date_added = null}) {
    super();
    this.type = 2;
    this.imdbId = imdbId;
    this.name = name;
    this.year = year;
    this.director = director;
    this.score = score;
    this.watched = watched;
    this.date_watched = date_watched;
    this.date_added = date_added;
  }

}