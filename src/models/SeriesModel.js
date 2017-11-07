import Season from 'models/SeasonModel';

class Series extends BaseModel{

  constructor ({imdbId = null, name = null, seasons = [], plot = null, actors = [], finished = false}) {
    super();
    this.type = 1;
    this.imdbId = imdbId;
    this.name = name;
    this.plot = plot;
    this.finished = finished;
    this.seasons = seasons.map(function(data) {
      return new Season(data);
    });
    this.actors = actors;
  }

  isComplete () {
    return this.name && this.seasons.length;
  }

  isFinished () {
    return this.finished;
  }

  toggleWatched () {
    // do something with seasons;
  }

  addSeason (year = null) {
    let season = new Season({year: year, nr: this.seasons.length + 1});
    this.seasons.push(season);
    return season;
  }

  // this is a little inaccurate
  // need to update to _.find when seasons have nrs
  getSeason (nr) {
    return this.seasons[nr - 1];
  }

  get watched () {
    return this.seasons.length > 0 && _.filter(this.seasons, {watched: false}).length === 0;
  }

  get year () {
    return this.seasons.length ? this.seasons[0].year : null;
  }

  get lastYear () {
    return this.seasons.length ? this.seasons[this.seasons.length -1].year : null;
  }

}