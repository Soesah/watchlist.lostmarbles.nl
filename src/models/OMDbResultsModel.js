class OMDbResults {
  constructor({Search = null, totalResults = null}) {
    this.results = Search;
    this.count = parseInt(totalResults);
  }
}