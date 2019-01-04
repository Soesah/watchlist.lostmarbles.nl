import axios, { AxiosStatic } from 'axios';

export class BaseService {
  public $http: AxiosStatic;

  constructor() {
    // set up axios proxy to allow requests
    this.$http = axios;
  }
}
