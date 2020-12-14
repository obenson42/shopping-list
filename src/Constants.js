// Constants.js
const prod = {
    url: {
        BASE_URI: 'https://obenson-book-list.herokuapp.com/'
    }
};

const dev = {
    url: {
        BASE_URI: 'http://localhost:5000'
    }
};

export const config = process.env.NODE_ENV !== 'production' ? dev : prod;