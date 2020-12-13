import axios from 'axios';

//const BASE_URI = 'https://obenson-book-list.herokuapp.com/';
const BASE_URI = 'http://localhost:5000';

const client = axios.create({
 baseURL: BASE_URI,
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

  createBook(book) {
    return this.perform('push', '/book', book);
  }

  deleteBook(book) {
    return this.perform('delete', `/book/${book.id}`);
  }

  getBooks() {
    return this.perform('get', '/books/');
  }

  getAuthors() {
    return this.perform('get', '/authors/');
  }

  getPublishers() {
    return this.perform('get', '/publishers/');
  }

  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
  }
}

export default APIClient;