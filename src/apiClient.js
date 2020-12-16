import axios from 'axios';
import { config } from './Constants'

const client = axios.create({
 baseURL: config.url.BASE_URI,
 json: true
});

class APIClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.username = null;
  }

  async login(username, password) {
    const resp = await this.perform('post', '/auth/api_login', { username: username, password: password });
    return resp;
  }

  getItems() {
    return this.perform('get', `/items?api_key=${this.accessToken}`);
  }

  createItem(item) {
    return this.perform('push', '/item', item);
  }

  updateItem(item) {
    return this.perform('post', '/item_update/', { api_key: this.accessToken, item });
  }

  deleteItem(item) {
    return this.perform('delete', `/item/${item.id}`);
  }

  reorderItems(item) {
    return this.perform('put', `/reorder/`, item);
  }


  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      crossDomain: true
   //   headers: {
   //     Authorization: `Bearer ${this.accessToken}`,
   //     APIKey: `${this.accessToken}`
   //   }
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
  }
}

export default APIClient;