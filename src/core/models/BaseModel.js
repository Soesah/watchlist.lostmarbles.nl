import DateTimeUtil from 'core/services/DateTimeUtil';

class BaseModel {

  get path () {
    return this.name.replace(/\W+/g, '-').replace('--', '').toLowerCase() + '-' + this.year;
  }

  isComplete () {
    return this.name && this.year;
  }

  toggleWatched () {
    this.watched = !this.watched;
    this.date_watched = this.watched ? DateTimeUtil.now() : null;
  }

  clone () {
    return new this.constructor(JSON.parse(JSON.stringify(this)));
  }
}
