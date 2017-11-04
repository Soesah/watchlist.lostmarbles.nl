import Movie from 'models/MovieModel';

class Sequel extends Movie {

  constructor ({parent = null, order = 0}) {
    super(arguments[0]);
    this.type = 4;
    this.parent = parent;
    this.order = order;
  }

}
