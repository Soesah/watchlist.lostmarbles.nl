class Franchise {
  constructor ({imdbId = null, name = null, items = [], date_added = null}) {
    this.type = 4;
    this.imdbId = imdbId;
    this.name = name;
    this.items = items;
    this.date_added = date_added;
  }

  addItem (item) {
    this.items.push(item.imdbId);
  }

  removeItem (item) {
    let index = this.items.indexOf(item.imdbId);
    this.items.splice(index, 1);
  }

  get path () {
    return this.name.replace(/\W+/g, '-').replace('--', '').toLowerCase();
  }

  get count () {
    return this.items.length;
  }

  clone () {
    return new this.constructor(JSON.parse(JSON.stringify(this)));
  }
}