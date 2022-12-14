// const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000' : 'https://tansmedia.herokuapp.com';

const Url = process.env.URL || 'https://tansmedia-59ne.onrender.com'

const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000' : Url;


const baseUrl = `${pureBaseUrl}/api/v1`;


exports = { pureBaseUrl };
module.exports = baseUrl;
