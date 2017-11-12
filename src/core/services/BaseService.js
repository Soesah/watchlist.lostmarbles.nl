import Vue from 'Vue';
import axios from 'Axios';

class BaseService {
  constructor () {
    // set up axios proxy to allow requests 
    this.$http = axios;
    // set up Vue as an eventing proxy
    this.event = new Vue();
  }
}