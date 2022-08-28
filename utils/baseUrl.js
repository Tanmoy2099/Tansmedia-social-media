const pureBaseUrl = process.env.NODE_ENV !== "production" ? 'http://localhost:3000 ' : 'https://tantegram-git-main-tanmoynath270-gmailcom.vercel.app/';





const baseUrl = `${pureBaseUrl}/api/v1`;


exports = { pureBaseUrl };
module.exports = baseUrl;
