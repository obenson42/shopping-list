import axios from 'axios';
import { config } from './Constants'

const client = axios.create({
 baseURL: config.url.BASE_URI,
 json: true
});

class APIClient {
  async login(username, password) {
    const resp = await this.perform('post', '/auth/api_login', { username: username, password: password });
    return resp;
  }

  async register(username, password, password2) {
    const resp = await this.perform('post', '/auth/api_register', { username: username, password: password, password2: password2 });
    return resp;
  }
  getItems() {
    return this.perform('get', `/items?api_key=${this.accessToken}`);
  }

  createItem(item) {
    return this.perform('post', '/item/', { api_key: this.accessToken, item });
  }

  updateItem(item) {
    return this.perform('post', '/item_update/', { api_key: this.accessToken, item });
  }

  deleteItem(item) {
    return this.perform('delete', '/item/', { api_key: this.accessToken, item });
  }

  reorderItems(item) {
    return this.perform('post', '/reorder/', { api_key: this.accessToken, item });
  }


  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      crossDomain: true
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
  }
}

export default APIClient;