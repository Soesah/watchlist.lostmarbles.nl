import BaseModel from 'core/models/BaseModel';

class Episode extends BaseModel {

  constructor ({imdbId = null, nr = null, title = null, watched = false, date_watched = null}) {
    super();
    this.imdbId = imdbId;
    this.nr = nr;
    this.title = title;
    this.watched = watched;
    this.date_watched = date_watched;
  }

}