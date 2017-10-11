module.exports = {
  port: process.env.PORT || 8000,
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/miami-scheduler',
  api_url: process.env.API_URL || 'http://localhost:8000/api'
};