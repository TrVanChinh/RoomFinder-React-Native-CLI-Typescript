import axios, { AxiosInstance } from 'axios';
import { mapData, mapError } from './mapData';
import baseURL from './baseURL';

export default class Request {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: baseURL.serverTest,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  get(url: string): Promise<any> {
    return this.api.get(url).then(mapData).catch(mapError);
  }
}
