import Movie from 'models/MovieModel';

class Prequel extends Movie {

  constructor ({parent = null, order = 0}) {
    super(arguments[0]);
    this.type = 5;
    this.parent = parent;
    this.order = order;
  }

}

