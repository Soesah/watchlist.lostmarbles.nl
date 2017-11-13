class Franchise {
  constructor ({id = null, name = null, items = [], date_added = null}) {
    this.type = 4;
    this.id = id;
    this.name = name;
    this.items = items;
    this.date_added = date_added;
  }

  addItem (item) {
    this.items.push(item.id);
  }

  removeItem (item) {
    let index = this.items.indexOf(item.id);
    this.items.splice(index, 1);
  }
}