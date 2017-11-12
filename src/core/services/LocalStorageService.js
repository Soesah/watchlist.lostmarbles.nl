class LocalStorageService {
  constructor() {}

  store (name, value) {
    localStorage.setItem(name, value);
  }

  storeJSON (name, value) {
    this.store(name, JSON.stringify(value));
  }

  has (name) {
    return this.get(name) !== null;
  }

  get (name) {
    return localStorage.getItem(name);
  }

  getJSON (name) {
    return JSON.parse(this.get(name));
  }

  delete (name) {
    return localStorage.removeItem(name);
  }
}