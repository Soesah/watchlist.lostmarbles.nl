angular.module('watchlistApp').factory('Result', [
  function() {

  class Result {
    constructor(item, search) {

      this.item = item;
      this.haystack = item.name.toLowerCase();
      this.search = search.toLowerCase();

      // does the search occur
      this.index = this.haystack.indexOf(this.search);
      // are we seaching for multiple words?
      this.words = this.search.trim().split(' ');
      // and how many of those words occur in the text
      this.re = new RegExp('\\b(?:' + this.words.join('|') + ')\\b', 'gi');
      this.matched_words = this.haystack.match(this.re);
    }

    get matches() {
      return !!((this.index > -1 || this.matched_words));
    }

    get score() {
      let score = 0;

      // full matches at start
      if (this.index === 0) { 
        score += 8;
      }
      // full match later in haystack
      if (this.index > 0) {
        score += 2;
      }
      // partial match all words
      if (this.matched_words && this.matched_words.length === this.words.length) {
        score += 5;
      }
      // partial match some words
      // give points for every word matched
      if (this.matched_words && this.matched_words.length < this.words.length) {
        score += 1 + (this.words.length / this.matched_words);
      }

      return score;
    }
  }

  return Result;
}]);
