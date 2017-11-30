import axios from 'Axios';

class BaseService {
  constructor () {
    // set up axios proxy to allow requests 
    this.$http = axios;
  }
}