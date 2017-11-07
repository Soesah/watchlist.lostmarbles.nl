import BaseModel from 'core/models/BaseModel';

class Documentary extends BaseModel{

  constructor ({name = null, year = null, score = null, director = null, watched = false}) {
    super();
    this.type = 2;
    this.name = name;
    this.year = year;
    this.director = director;
    this.score = score;
    this.watched = watched;
  }

}