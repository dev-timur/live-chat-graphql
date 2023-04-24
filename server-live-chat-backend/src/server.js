const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express')

const schema = require('./graphql/schema')

// create apollo server
const server = new ApolloServer({
  schema,
  subscriptions: {
    onConnect: () => console.info('✅ Connected to websocket'),
    onDisconnect: () => console.info('❌ Disconnect from websocket'),
  },
});

// create express app
const app = express();

// apply apollo middlleware
server.applyMiddleware({
  app,
  cors: true,
  tracing: true,
  playground: process.env.NODE_ENV === 'development',
  onHealthCheck: () =>
    // eslint-disable-next-line no-undef
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState > 0) {
        resolve();
      } else {
        reject();
      }
    }),
});

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  })
);

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

module.exports = httpServer;