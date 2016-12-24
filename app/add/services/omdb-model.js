angular.module('watchlistApp').factory('OMDbObject', [
  function() {

    class OMDbObject {
      constructor({Title = null, Year = null, Rated = null, Released = null, Runtime = null, Genre = null, Director = null, Writer = null, Actors = null, Plot = null, Language = null, Country = null, Awards = null, Poster = null, Metascore = null, imdbRating = null, imdbVotes = null, imdbID = null, Type = null}) {

        this.title = Title;
        this.year = Year;
        this.rated = Rated;
        this.released = Released;
        this.runtime = Runtime;
        this.genre = Genre;
        this.director = Director;
        this.writer = Writer;
        this.actors = Actors;
        this.plot = Plot;
        this.language = Language;
        this.country = Country;
        this.awards = Awards;
        this.poster = Poster;
        this.metascore = Metascore;
        this.imdbrating = imdbRating;
        this.imdbvotes = imdbVotes;
        this.imdbid = imdbID;
        this.type = Type;
      }

      isMovie() {
        return this.type === 'movie';
      }

      isSeries() {
        return this.type === 'series';
      }

      isGame() {
        return this.type === 'game';
      }

      getInternalType() {
        var type = 0;
        if (this.isSeries()) {
          type = 1;
        }
        if (this.isGame()) {
          type = 2;
        }
        return type;
      }
    }

    return OMDbObject;
}])