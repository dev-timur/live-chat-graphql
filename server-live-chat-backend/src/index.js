/* eslint-disable no-console */
const mongoose = require('mongoose')
const httpStatus = require('http-status')

const app = require('./server')

// connect to mongo db
mongoose.connection.openUri(process.env.MONGODB_URI, {
  autoIndex: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  keepAlive: 120,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => console.info('Mongoose connected.'));

mongoose.connection.on('error', (err) => {
  throw new APIError(
    `Mongoose connection error: ${err}`,
    httpStatus.INTERNAL_SERVER_ERROR
  );
});

mongoose.connection.on('disconnected', () =>
  console.info('Mongoose disconnected.')
);

// listen on port config.port
app.listen(process.env.PORT, () => {
  console.info(`✅ Server started on port ${process.env.PORT} (${process.env.NODE_ENV}).`);
});

module.exports = app;