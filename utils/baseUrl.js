exports.pureBaseUrl = process.env.NODE_ENV !== "production" && 'http://localhost:3000'


const baseUrl = `${pureBaseUrl}/api/v1`;



// process.env.NODE_ENV !== "production"
//   ? "http://localhost:3000/api/v1"
//   : "http://localhost:3000/api/v1";


module.exports = baseUrl;
