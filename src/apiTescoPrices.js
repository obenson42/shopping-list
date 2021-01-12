import axios from 'axios';
import { config } from './Constants'

const client = axios.create({
 //baseURL: "https://dev.tescolabs.com/grocery/",
 baseURL: config.url.BASE_URI,
 json: true
});

class APITescoPrices {
  constructor(subscriptionKey) {
    this.subscriptionKey = subscriptionKey;
  }

  getItemPrice(itemText) {
    if(itemText)
        return this.perform('get', `products/?query=${itemText}&offset=0&limit=25`);
    else
      return new Promise(function(resolve, reject) {resolve(0.0)});
  }

  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      crossDomain: true,
      headers: {
        "Ocp-Apim-Subscription-Key": this.subscriptionKey,
      }
    }).then(resp => {
      let price = 0.00;
      try {
          const uk = resp.data["uk"];
          const ghs = uk["ghs"];
          const products = ghs["products"];
          const results = products["results"];
          if(results.length === 1) {
            price = results[0]["price"];
          } else {
            price = results;
          }
      } catch {
      }
      return price;
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      return new Promise(function(resolve, reject) {reject(0.0)});
    });
  }
}

export default APITescoPrices;