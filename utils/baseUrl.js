// const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000' : process.env.URL || 'https://tansmedia.herokuapp.com';

const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000' : process.env.URL || 'https://main.d33ib74457sklv.amplifyapp.com';


console.log(process.env.URL);


const baseUrl = `${pureBaseUrl}/api/v1`;


exports = { pureBaseUrl };
module.exports = baseUrl;
