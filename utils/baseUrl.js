const url = process.env.URL || 'http://localhost:3000'
const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000' : url;

const baseUrl = `${pureBaseUrl}/api/v1`;

exports = { pureBaseUrl };
module.exports = baseUrl;
