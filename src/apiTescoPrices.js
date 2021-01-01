import axios from 'axios';

const client = axios.create({
 baseURL: "https://dev.tescolabs.com/grocery/",
 json: true
});

class APITescoPrices {
  constructor(subscriptionKey) {
    this.subscriptionKey = subscriptionKey;
  }

  getItemPrice(itemText) {
    if(itemText)
        return this.perform('get', `products/?query=${itemText}&offset=0&limit=500`);
    else
        return "0.00";
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
            //console.log(results[0]);
            price = results[0]["price"];
        } catch {
        }
        return price;
    })
  }
}

export default APITescoPrices;